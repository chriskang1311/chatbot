from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
from file_utils import FileProcessor
import base64
import json

load_dotenv()
app = Flask(__name__)
CORS(app)

# Validate OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = openai.OpenAI(api_key=openai_api_key)
file_processor = FileProcessor()

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def process_attached_files(attached_files):
    """Helper function to process attached files"""
    processed_files = []
    if attached_files:
        for file_info in attached_files:
            try:
                # Decode base64 file data
                file_data = base64.b64decode(file_info["data"])
                filename = file_info["name"]
                
                # Process the file
                result = file_processor.process_file(file_data, filename)
                result["filename"] = filename
                processed_files.append(result)
            except Exception as e:
                # Log error and continue with other files
                print(f"Error processing file {file_info.get('name', 'unknown')}: {str(e)}")
                processed_files.append({
                    "success": False,
                    "error": f"Error processing file: {str(e)}",
                    "filename": file_info.get("name", "unknown")
                })
    return processed_files

def create_gpt_messages(user_message, processed_files):
    """Helper function to create messages for GPT"""
    # Format content for GPT
    file_content = file_processor.format_content_for_gpt(processed_files)
    
    # Combine user message with file content
    full_message = user_message
    if file_content:
        full_message = f"{user_message}\n\n{file_content}" if user_message else file_content
    
    # Create messages for GPT
    messages = [
        {"role": "system", "content": "You are a helpful assistant that can analyze documents and images. When users share files, provide detailed analysis and insights based on the content."}
    ]
    
    # Handle images specially for GPT-4o
    has_images = any(f.get("file_type") in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] for f in processed_files if f.get("success"))
    
    if has_images:
        # Create multimodal message for images
        content = [{"type": "text", "text": full_message}]
        
        # Add images
        for file_info in processed_files:
            if file_info.get("success") and file_info.get("file_type") in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']:
                content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{file_info['content']['mime_type']};base64,{file_info['content']['base64']}",
                        "detail": "auto"
                    }
                })
        
        messages.append({"role": "user", "content": content})
    else:
        # Text-only message
        messages.append({"role": "user", "content": full_message})
    
    return messages

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        if not data:
            return Response(
                f"data: {json.dumps({'error': 'No JSON data provided'})}\n\n",
                mimetype='text/event-stream'
            )
        
        user_message = data.get("message", "")
        attached_files = data.get("attached_files", [])
        
        # Validate input
        if not user_message and not attached_files:
            return Response(
                f"data: {json.dumps({'error': 'No message or files provided'})}\n\n",
                mimetype='text/event-stream'
            )
        
        # Process any attached files
        processed_files = process_attached_files(attached_files)
        
        # Create messages for GPT
        messages = create_gpt_messages(user_message, processed_files)
        
        # Always return streaming response
        return Response(
            stream_with_context(generate_streaming_response(messages)),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Cache-Control'
            }
        )
    except Exception as e:
        return Response(
            f"data: {json.dumps({'error': f'Server error: {str(e)}'})}\n\n",
            mimetype='text/event-stream'
        )

def generate_streaming_response(messages):
    """Generate streaming response from OpenAI"""
    try:
        stream = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            stream=True  # Enable streaming
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                # Send each chunk as a Server-Sent Event
                yield f"data: {json.dumps({'content': content, 'type': 'chunk'})}\n\n"
        
        # Send end signal
        yield f"data: {json.dumps({'type': 'end'})}\n\n"
        
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e), 'type': 'error'})}\n\n"

@app.route("/upload", methods=["POST"])
def upload_file():
    """Test endpoint for file uploads"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file_processor.is_supported_file(file.filename):
            return jsonify({"error": "Unsupported file type"}), 400
        
        # Read file data
        file_data = file.read()
        
        # Process the file
        result = file_processor.process_file(file_data, file.filename)
        result["filename"] = file.filename
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}"}), 500

@app.route("/")
def home():
    return "Hello, world! Chatbot API is running."

@app.route("/health")
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "openai_configured": bool(openai_api_key),
        "file_processor": "ready"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5050)