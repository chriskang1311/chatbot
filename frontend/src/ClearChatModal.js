import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";

export default function ClearChatModal({ show, onHide, onConfirm, darkMode }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header 
        closeButton
        style={{
          backgroundColor: darkMode ? '#1a1a1a' : '#fff',
          borderColor: darkMode ? '#333' : '#dee2e6',
          color: darkMode ? '#fff' : '#000'
        }}
      >
        <Modal.Title>
          <FiTrash2 className="me-2" />
          Clear Chat History
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: darkMode ? '#1a1a1a' : '#fff',
          color: darkMode ? '#fff' : '#000'
        }}
      >
        <p>Are you sure you want to clear all chat history?</p>
        <p className={`small mb-0 ${darkMode ? 'text-light-50' : 'text-muted'}`}>
          This action cannot be undone. All your messages and the bot's responses will be permanently deleted.
        </p>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: darkMode ? '#1a1a1a' : '#fff',
          borderColor: darkMode ? '#333' : '#dee2e6'
        }}
      >
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          <FiTrash2 className="me-1" />
          Clear All Messages
        </Button>
      </Modal.Footer>
    </Modal>
  );
}