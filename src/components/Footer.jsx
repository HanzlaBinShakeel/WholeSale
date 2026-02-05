import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MKT Wholesale</h3>
            <p>Your trusted partner for bulk orders of traditional Indian clothing items.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/ledger">Payment Ledger</Link></li>
              <li><Link to="/login">Login/Register</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/products?category=saafa">Saafa</Link></li>
              <li><Link to="/products?category=odhna">Odhna</Link></li>
              <li><Link to="/products?category=rajputi-suit">Rajputi Suit</Link></li>
              <li><Link to="/products?category=rajputi-jod">Rajputi Jod</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@mktwholesale.com</p>
            <p>Phone: +91 XXXXX XXXXX</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 MKT Wholesale. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
