import { createGlobalStyle } from 'styled-components';
import './Fonts/Fonts.css';


export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    -webkit-tap-highlight-color: transparent;
  }

  html {
    font-size: 16px;
    font-family: Arial, sans-serif;
    scroll-behavior: smooth;
  }

  ul, ol {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    margin: 0;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
  }

  img, video {
    max-width: 100%;
    height: auto;
  }

  /* Hide anything marked with .no-print */
  @media print {
    .no-print {
      display: none !important;
      visibility: hidden !important;
    }
  }
`;
