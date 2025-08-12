import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

localStorage.setItem("API_BASE_URL", "https://tarifkapida.up.railway.app");


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
