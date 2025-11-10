import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SystemConfigProvider } from './context/SystemConfigContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SystemConfigProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SystemConfigProvider>
    </ThemeProvider>
  </React.StrictMode>
);