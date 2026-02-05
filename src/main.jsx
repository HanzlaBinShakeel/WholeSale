import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { seedDataIfNeeded } from './data/seedData'
import './index.css'

// Seed dummy data for testing (products, orders, users, ledger)
seedDataIfNeeded()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
