import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FiSettings, FiHelpCircle, FiSun, FiMoon } from "react-icons/fi";

export default function Header({ onSettingsClick, onHelpClick, darkMode, onToggleDarkMode }) {
  return (
    <Navbar 
      bg={darkMode ? "dark" : "light"} 
      variant={darkMode ? "dark" : "light"} 
      className="border-bottom"
      style={{ 
        backgroundColor: darkMode ? '#1a1a1a' : '#faf9f6',
        borderColor: darkMode ? '#333' : '#e0e0e0'
      }}
    >
      <Container>
        <Navbar.Brand className="fw-bold">Chris's Chatbot</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link 
            onClick={onToggleDarkMode}
            className="me-3"
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            style={{ cursor: 'pointer' }}
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </Nav.Link>
          <Nav.Link onClick={onHelpClick} className="me-3">
            <FiHelpCircle size={20} />
          </Nav.Link>
          <Nav.Link onClick={onSettingsClick}>
            <FiSettings size={20} />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}