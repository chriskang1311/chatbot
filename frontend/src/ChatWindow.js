import React, { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, darkMode }) {
  const chatRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={chatRef}
      className="flex-grow-1 overflow-auto p-3"
      style={{ height: 'calc(100vh - 200px)' }}
    >
      <Container className="px-4" style={{ maxWidth: '800px' }}>
        {messages.length === 0 ? (
          <div className={`text-center my-5 ${darkMode ? 'text-light' : 'text-dark'}`}>
            <div className="mb-4">
              <span style={{ fontSize: '4rem' }}>��</span>
            </div>
            <h3 className="mb-3 fw-bold">Welcome to Chris's Chatbot</h3>
            <p className={`mb-4 ${darkMode ? 'text-light-50' : 'text-muted'}`} style={{ fontSize: '1.1rem' }}>
              I'm here to help you with any questions or tasks. What would you like to know?
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} darkMode={darkMode} />
          ))
        )}
      </Container>
    </div>
  );
}