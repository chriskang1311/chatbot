// src/chatStorage.js

const CHAT_STORAGE_KEY = 'chatbot_messages';

// Save messages to localStorage
export const saveMessages = (messages) => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save messages to localStorage:', error);
  }
};

// Load messages from localStorage
export const loadMessages = () => {
  try {
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  } catch (error) {
    console.error('Failed to load messages from localStorage:', error);
    return [];
  }
};

// Clear all saved messages
export const clearSavedMessages = () => {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear messages from localStorage:', error);
  }
};

// Get chat statistics
export const getChatStats = () => {
  const messages = loadMessages();
  const userMessages = messages.filter(msg => msg.role === 'user').length;
  const botMessages = messages.filter(msg => msg.role === 'bot').length;
  const totalMessages = messages.length;
  
  return {
    totalMessages,
    userMessages,
    botMessages,
    hasHistory: totalMessages > 0
  };
};