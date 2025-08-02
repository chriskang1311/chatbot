import React, { useState, useRef } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { FiArrowUp, FiMic, FiPaperclip, FiX, FiFile } from "react-icons/fi";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function InputArea({ onSend, onFileUpload, darkMode, hasMessages }) {
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Add CSS for dark mode input styling
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .dark-input {
        color: #fff !important;
      }
      .dark-input::placeholder {
        color: #6c757d !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [darkMode]);

  // Voice recognition
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
      e.target.value = '';
    }
  };

  // Handle file button click
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // Handle removing a file
  const handleRemoveFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Handle voice input
  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setInput((prev) => prev + " " + transcript);
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  // Handle send
  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() || attachedFiles.length > 0) {
      onSend(input.trim(), attachedFiles, true); // Always true for streaming
      setInput("");
      setAttachedFiles([]);
    }
  };

  // Keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // Dynamic placeholder text
  const placeholderText = hasMessages ? "Reply to Chatbot..." : "Start a conversation with Chatbot...";

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div 
      className={`border-top p-4 ${darkMode ? 'bg-dark' : ''}`}
      style={{ 
        backgroundColor: darkMode ? '#1a1a1a' : '#faf9f6',
        borderColor: darkMode ? '#333' : '#e0e0e0'
      }}
    >
      <Container className="px-4" style={{ maxWidth: '800px' }}>
        <Form onSubmit={handleSend}>
          <div className="position-relative">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              style={{ display: 'none' }}
            />
            
            {/* Main input area */}
            <div 
              className={`rounded-4 border p-4 shadow-sm`}
              style={{
                backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                borderColor: darkMode ? '#333' : '#dee2e6',
                boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)'
              }}
            >
              {/* Attached files display */}
              {attachedFiles.length > 0 && (
                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-2">
                    {attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="d-flex align-items-center gap-2 p-2 rounded-3"
                        style={{
                          backgroundColor: darkMode ? '#333' : '#f8f9fa',
                          border: `1px solid ${darkMode ? '#555' : '#dee2e6'}`,
                          fontSize: '0.875rem'
                        }}
                      >
                        <FiFile 
                          size={16} 
                          color={darkMode ? '#fff' : '#6c757d'} 
                        />
                        <span 
                          className="text-truncate"
                          style={{ 
                            maxWidth: '120px',
                            color: darkMode ? '#fff' : '#000'
                          }}
                          title={file.name}
                        >
                          {file.name}
                        </span>
                        <span 
                          style={{ 
                            color: darkMode ? '#6c757d' : '#6c757d',
                            fontSize: '0.75rem'
                          }}
                        >
                          ({formatFileSize(file.size)})
                        </span>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-0 m-0"
                          style={{
                            color: darkMode ? '#dc3545' : '#dc3545',
                            minWidth: 'auto',
                            padding: '0',
                            margin: '0'
                          }}
                        >
                          <FiX size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Form.Control
                as="textarea"
                value={listening ? transcript : input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholderText}
                disabled={listening}
                rows={1}
                style={{ 
                  resize: 'none', 
                  border: 'none', 
                  boxShadow: 'none',
                  fontSize: '1rem',
                  padding: '0.5rem 0',
                  backgroundColor: 'transparent',
                  color: darkMode ? '#fff' : '#000'
                }}
                className={`border-0 shadow-none ${darkMode ? 'dark-input' : ''}`}
              />
              
              {/* Bottom row with buttons */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                {/* Left side - action buttons */}
                <div className="d-flex gap-2">
                  <Button
                    variant="light"
                    size="sm"
                    type="button"
                    onClick={handleFileClick}
                    title="Attach file"
                    className="rounded-3 p-2 border-0"
                    style={{ 
                      width: '36px', 
                      height: '36px',
                      backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
                      borderColor: darkMode ? '#333' : '#dee2e6',
                      color: darkMode ? '#fff' : '#000',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <FiPaperclip size={16} />
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    type="button"
                    onClick={handleMicClick}
                    title="Voice input"
                    className="rounded-3 p-2 border-0"
                    style={{ 
                      width: '36px', 
                      height: '36px',
                      backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
                      borderColor: darkMode ? '#333' : '#dee2e6',
                      color: darkMode ? '#fff' : '#000',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <FiMic size={16} color={listening ? "#0d6efd" : undefined} />
                  </Button>
                </div>
                
                {/* Right side - send button */}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!input.trim() && attachedFiles.length === 0}
                  title="Send"
                  className="rounded-3 p-2 border-0 d-flex align-items-center justify-content-center"
                  style={{ 
                    backgroundColor: '#d97706', 
                    borderColor: '#d97706',
                    width: '32px',
                    height: '32px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(217, 119, 6, 0.3)',
                    padding: '0'
                  }}
                  onClick={handleSend}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 4px 8px rgba(217, 119, 6, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 4px rgba(217, 119, 6, 0.3)';
                  }}
                >
                  <FiArrowUp size={14} />
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Container>
    </div>
  );
}