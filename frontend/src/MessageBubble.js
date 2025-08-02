import React from "react";
import { Card } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ message, darkMode }) {
  if (message.type === "system") {
    return (
      <div className={`text-center my-4 ${darkMode ? 'text-light-50' : 'text-muted'}`}>
        <div 
          className={`px-3 py-2 rounded-pill d-inline-block`}
          style={{
            backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa'
          }}
        >
          <small>{message.text}</small>
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";
  const isStreaming = message.isStreaming;

  if (isUser) {
    // User message - in a light grey/beige box with shadow
    return (
      <div className="d-flex justify-content-end mb-4">
        <div className="d-flex align-items-end" style={{ maxWidth: '70%' }}>
          <div className="order-1">
            <Card 
              style={{ 
                backgroundColor: darkMode ? '#1a1a1a' : '#f0f0f0',
                border: 'none',
                borderRadius: '20px',
                boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Card.Body className="py-3 px-4">
                <div style={{ color: darkMode ? '#fff' : '#000' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              </Card.Body>
            </Card>
            {message.timestamp && (
              <small className={`mt-2 d-block text-end ${darkMode ? 'text-light-50' : 'text-muted'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            )}
          </div>
          <div 
            className="ms-3 order-2 d-flex align-items-end"
            style={{ marginBottom: '8px' }}
          >
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ 
                width: '36px', 
                height: '36px',
                backgroundColor: '#6c757d',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                border: `2px solid ${darkMode ? '#1a1a1a' : '#fff'}`
              }}
            >
              CK
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // Bot message - in a container that matches the dark theme
    return (
      <div className="d-flex justify-content-start mb-4">
        <div style={{ maxWidth: '85%' }}>
          <div 
            className={`${darkMode ? 'text-light' : 'text-dark'}`}
            style={{ 
              fontSize: '1.05rem', 
              lineHeight: '1.6',
              fontWeight: '400',
              backgroundColor: darkMode ? '#1a1a1a' : 'transparent',
              padding: darkMode ? '12px 16px' : '0',
              borderRadius: darkMode ? '12px' : '0',
              border: darkMode ? '1px solid #333' : 'none'
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
            
            {/* Streaming indicator */}
            {isStreaming && (
              <div className="d-flex align-items-center mt-2">
                <div className="d-flex gap-1 me-2">
                  <div 
                    className="typing-dot"
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: darkMode ? '#fff' : '#6c757d',
                      animation: 'typingDot 1.4s infinite ease-in-out both',
                      animationDelay: '0s'
                    }}
                  ></div>
                  <div 
                    className="typing-dot"
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: darkMode ? '#fff' : '#6c757d',
                      animation: 'typingDot 1.4s infinite ease-in-out both',
                      animationDelay: '0.2s'
                    }}
                  ></div>
                  <div 
                    className="typing-dot"
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: darkMode ? '#fff' : '#6c757d',
                      animation: 'typingDot 1.4s infinite ease-in-out both',
                      animationDelay: '0.4s'
                    }}
                  ></div>
                </div>
                <small className={`${darkMode ? 'text-light-50' : 'text-muted'}`} style={{ fontSize: '0.875rem' }}>
                  AI is typing...
                </small>
              </div>
            )}
          </div>
          {message.timestamp && (
            <small className={`mt-2 d-block ${darkMode ? 'text-light-50' : 'text-muted'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          )}
        </div>
      </div>
    );
  }
}