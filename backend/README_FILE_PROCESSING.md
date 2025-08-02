# File Processing Setup Guide

This guide will walk you through setting up PDF, Word document, and image analysis capabilities for your chatbot.

## 🚀 Quick Start

### 1. Install Dependencies

First, install the required Python packages:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Test the Installation

Run the test script to verify everything is working:

```bash
python test_file_processing.py
```

You should see output like:
```
🧪 Testing File Processing Functionality
==================================================

📁 Testing: test.pdf
   MIME Type: application/pdf
   Supported: ✅ Yes
   Processing: ✅ Success
   File Type: pdf
   Text Preview: This is dummy file content for testing purposes...
```

### 3. Start the Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5050`

## 📁 Supported File Types

| File Type | Extension | Processing |
|-----------|-----------|------------|
| PDF Documents | `.pdf` | Text extraction + image extraction |
| Word Documents | `.docx`, `.doc` | Text extraction (paragraphs + tables) |
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.webp` | Image analysis with GPT-4o |

## 🧪 Testing Locally

### Option 1: Use the Frontend (Recommended)

1. Start your frontend: `cd frontend && npm start`
2. Start your backend: `cd backend && python app.py`
3. Open the chatbot in your browser
4. Click the paperclip icon to attach files
5. Type a message and send

### Option 2: Test with Postman

1. Open Postman
2. Create a POST request to `http://localhost:5050/upload`
3. Set body to `form-data`
4. Add a key named `file` with type `File`
5. Select a PDF, Word document, or image
6. Send the request

### Option 3: Test the Chat Endpoint

1. Create a POST request to `http://localhost:5050/chat`
2. Set Content-Type to `application/json`
3. Use this sample body:

```json
{
  "message": "Analyze this document",
  "attached_files": [
    {
      "name": "sample.pdf",
      "data": "base64_encoded_file_data_here",
      "type": "application/pdf",
      "size": 12345
    }
  ]
}
```

## 🔧 How It Works

### File Processing Flow

1. **Frontend**: User selects files → files are converted to base64
2. **Backend**: Receives base64 data → decodes → processes based on file type
3. **GPT-4o**: Receives formatted content + images for analysis

### Processing by File Type

#### PDFs
- Extracts text from all pages
- Extracts images (stored as base64 for potential use)
- Maintains page structure

#### Word Documents
- Extracts text from paragraphs
- Extracts text from tables
- Preserves document structure

#### Images
- Converts to base64 for GPT-4o
- Extracts metadata (size, format, etc.)
- Sends directly to GPT-4o for visual analysis

## 🛠️ Troubleshooting

### Common Issues

1. **Import Error: No module named 'fitz'**
   ```bash
   pip install PyMuPDF
   ```

2. **Import Error: No module named 'docx'**
   ```bash
   pip install python-docx
   ```

3. **Import Error: No module named 'PIL'**
   ```bash
   pip install Pillow
   ```

4. **File too large error**
   - Check file size limits in your server configuration
   - Consider implementing file size validation

5. **CORS errors**
   - Ensure CORS is properly configured in `app.py`
   - Check that frontend and backend ports match

### Debug Mode

Enable debug logging by setting:

```python
# In app.py
app.run(debug=True, port=5050)
```

## 📊 Performance Considerations

### File Size Limits
- **Recommended**: Keep files under 10MB
- **PDFs**: Text extraction is fast, image extraction can be slower
- **Images**: Base64 encoding increases size by ~33%

### Memory Usage
- Files are processed in memory (not saved to disk)
- Large files may require more RAM
- Consider implementing streaming for very large files

## 🔒 Security Notes

### Local Development
- Files are processed in memory only
- No files are saved to disk
- Base64 data is sent over HTTP (use HTTPS in production)

### Production Considerations
- Implement file size limits
- Add file type validation
- Use HTTPS for file transmission
- Consider cloud storage for large files
- Add rate limiting

## 🎯 Next Steps

### Potential Enhancements
1. **Cloud Storage**: Integrate with AWS S3 or similar
2. **File Caching**: Cache processed files for repeated analysis
3. **Batch Processing**: Handle multiple files more efficiently
4. **OCR**: Add OCR for scanned PDFs
5. **File Compression**: Compress large files before processing

### Advanced Features
1. **Document Summarization**: Auto-generate summaries
2. **Table Extraction**: Better table parsing for PDFs
3. **Image Annotation**: Draw on images for analysis
4. **File Comparison**: Compare multiple documents

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run the test script: `python test_file_processing.py`
3. Check the console logs for error messages
4. Verify all dependencies are installed correctly 