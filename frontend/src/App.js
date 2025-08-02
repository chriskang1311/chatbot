import React, { useState, useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import Header from "./Header";
import ChatWindow from "./ChatWindow";
import InputArea from "./InputArea";
import ClearChatModal from "./ClearChatModal";
import LoadingIndicator from "./LoadingIndicator";
import { saveMessages, loadMessages, clearSavedMessages, getChatStats } from "./chatStorage";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // Load saved messages when the app starts
  useEffect(() => {
    const savedMessages = loadMessages();
    setMessages(savedMessages);
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const handleSettingsClick = () => alert("Settings panel coming soon!");
  const handleHelpClick = () => alert("Help coming soon!");

  // Add new user message to chat
  const handleSend = async (text, attachedFiles = [], streaming = true) => {
    // Create file list text if files are attached
    let fileListText = "";
    if (attachedFiles.length > 0) {
      fileListText = attachedFiles
        .map((file) => `\`${file.name}\` (${file.type ? file.type.toUpperCase().split("/").pop() : "file"}, ${Math.round(file.size / 1024)} KB)`)
        .join(", ");
    }

    // Combine text and file information for display
    const displayMessage = text + (fileListText ? (text ? " " : "") + `[Attached files: ${fileListText}]` : "");

    // Add user message to chat
    setMessages((msgs) => [
      ...msgs,
      { role: "user", text: displayMessage, timestamp: Date.now() },
    ]);
    setLoading(true);

    try {
      // Prepare files for backend
      const filesForBackend = [];
      for (const file of attachedFiles) {
        const base64Data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result.split(',')[1]; // Remove data URL prefix
            resolve(base64);
          };
          reader.readAsDataURL(file.file);
        });
        
        filesForBackend.push({
          name: file.name,
          data: base64Data,
          type: file.type,
          size: file.size
        });
      }

      if (streaming) {
        // Add a placeholder bot message for streaming
        const botMessageId = Date.now();
        setMessages((msgs) => [
          ...msgs,
          { 
            id: botMessageId,
            role: "bot", 
            text: "", 
            timestamp: Date.now(),
            isStreaming: true 
          },
        ]);

        // Call backend with streaming enabled
        const res = await fetch("http://localhost:5050/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: text,
            attached_files: filesForBackend,
            streaming: true  // Enable streaming
          }),
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Handle streaming response
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'end') {
                  // Streaming finished
                  setMessages((msgs) =>
                    msgs.map((msg) =>
                      msg.id === botMessageId
                        ? { ...msg, text: accumulatedText, isStreaming: false }
                        : msg
                    )
                  );
                  break;
                } else if (data.error) {
                  throw new Error(data.error);
                } else if (data.content) {
                  // Add new content to the streaming message
                  accumulatedText += data.content;
                  setMessages((msgs) =>
                    msgs.map((msg) =>
                      msg.id === botMessageId
                        ? { ...msg, text: accumulatedText }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      } else {
        // Call backend with streaming disabled (original behavior)
        const res = await fetch("http://localhost:5050/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: text,
            attached_files: filesForBackend,
            streaming: false
          }),
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        // Add bot message
        setMessages((msgs) => [
          ...msgs,
          { role: "bot", text: data.response, timestamp: Date.now() },
        ]);

      
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        {
          type: "system",
          text: `❌ Error: ${err.message}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle file uploads (legacy function - kept for compatibility)
  const handleFileUpload = (files) => {
    const fileList = files
      .map(
        (f) =>
          `\`${f.name}\` (${f.type ? f.type.toUpperCase().split("/").pop() : "file"}, ${Math.round(f.size / 1024)} KB)`
      )
      .join(", ");
    setMessages((msgs) => [
      ...msgs,
      {
        type: "system",
        text: `📎 Uploaded file${files.length > 1 ? "s" : ""}: ${fileList}`,
        timestamp: Date.now(),
      },
    ]);
  };

  // Clear chat history
  const handleClearChat = () => {
    setShowClearModal(true);
  };

  const handleConfirmClearChat = () => {
    setMessages([]);
    clearSavedMessages();
    setShowClearModal(false);
  };

  // Get chat statistics
  const chatStats = getChatStats();

  return (
    <div 
      className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : ''}`}
      style={{ 
        backgroundColor: darkMode ? '#1a1a1a' : '#faf9f6',
        color: darkMode ? '#fff' : '#000'
      }}
    >
      <Header 
        onSettingsClick={handleSettingsClick} 
        onHelpClick={handleHelpClick}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
      />
      
      <div className="d-flex flex-column" style={{ height: 'calc(100vh - 56px)' }}>
        <ChatWindow messages={messages} darkMode={darkMode} />
        
        {loading && <LoadingIndicator darkMode={darkMode} />}
        
        <InputArea 
          onSend={handleSend} 
          onFileUpload={handleFileUpload} 
          darkMode={darkMode} 
          hasMessages={messages.length > 0}
        />
        
        <div 
          className="py-3"
        >
          <div className="d-flex justify-content-center">
            {chatStats.hasHistory && (
              <Button 
                variant="outline-light"
                onClick={handleClearChat}
                size="sm"
                className="px-4 py-2"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: darkMode ? '#ffffff' : '#dc3545',
                  color: darkMode ? '#ffffff' : '#dc3545',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (darkMode) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1.02)';
                  } else {
                    e.target.style.backgroundColor = '#dc3545';
                    e.target.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (darkMode) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                  } else {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#dc3545';
                  }
                }}
              >
                Clear Chat History
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Clear Chat Modal */}
      <ClearChatModal
        show={showClearModal}
        onHide={() => setShowClearModal(false)}
        onConfirm={handleConfirmClearChat}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;