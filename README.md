# Chatbot Project

This is my first attempt at creating an end-to-end chatbot powered by OpenAI gpt-4o. 

It is built with React (For reusable components and what was used in my previous job) and Flask (Because I am learning Python). This was done with the help of Anthropic's Cursor IDE.

## Features

- **OpenAI-Powered Conversations**
- **File Processing** - Upload and analyze PDFs, Word documents, and images
- **Real-Time Streaming** - Word-by-word response display with typing indicators
- **Voice Recognition** - Speech-to-text input support
- **Dark Mode** - Dark/light theme toggle
- **Responsive Design** - Works on desktop and mobile
- **Chat History** - Persistent conversation storage
- **Secure** - Environment variable protection for API keys


## Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chriskang1311/chatbot.git
   cd chatbot
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python app.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
chatbot/
├── backend/
│   ├── app.py                 # Flask server
│   ├── file_utils.py          # File processing logic
│   ├── requirements.txt       # Python dependencies
│   └── venv/                 # Virtual environment
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── ChatWindow.js     # Chat display
│   │   ├── InputArea.js      # User input handling
│   │   ├── MessageBubble.js  # Individual messages
│   │   └── ...               # Other components
│   ├── package.json          # Node dependencies
│   └── public/               # Static assets
└── README.md                 # This file
```

## Configuration

### Environment Variables
Create a `.env` file in the `backend` directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Supported File Types
- **Documents**: PDF, DOCX, DOC
- **Images**: JPG, JPEG, PNG, GIF, BMP, WEBP

## Key Features Explained

### Real-Time Streaming
The chatbot uses Server-Sent Events (SSE) to display responses word-by-word, creating a more engaging user experience similar to ChatGPT and Claude.

### File Processing
- **PDFs**: Extracts text and tables using pdfplumber
- **Word Documents**: Processes paragraphs and tables using python-docx
- **Images**: Converts to base64 for GPT-4o visual analysis

Note: The file processing requirements and process will change when I try to deploy this to the cloud as I will likely need to upload the files to a storage first, then send via API in a readable format.

### Dark Mode
Fully responsive dark/light theme with consistent styling across all components. 

Note: I don't think this was necessary for an MVP as ChatGPT and Claude do not have this, but I like working in dark mode, so this was a creator-driven requirement.

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
python app.py
```

### Frontend Development
```bash
cd frontend
npm start
```

### Testing File Processing
```bash
cd backend
python test_file_processing.py
```

## 📝 API Endpoints

- `POST /chat` - Main chat endpoint with streaming support
- `POST /upload` - Direct file upload testing endpoint

## Security Considerations

- API keys are stored in environment variables
- File uploads are processed in memory (not stored)
- CORS is configured for local development
- Input validation on all endpoints

## Deployment

### Local Development
- Backend runs on `http://localhost:5050`
- Frontend runs on `http://localhost:3000`

### Production Considerations
- Use HTTPS in production
- Set up proper CORS configuration
- Consider using AWS S3 for file storage
- Implement rate limiting
- Add authentication if needed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
