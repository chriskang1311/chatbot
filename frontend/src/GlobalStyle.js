// src/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif;
    transition: background 0.3s, color 0.3s;
  }
`;

export default GlobalStyle;
