import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AuthApp from './components/AuthApp'

ReactDOM.createRoot(document.getElementById('auth-root')).render(
  <React.StrictMode>
    <AuthApp />
  </React.StrictMode>,
)