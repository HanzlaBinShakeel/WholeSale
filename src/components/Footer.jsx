import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { useSettings } from '../hooks/useData'
import './Footer.css'

function Footer() {
  const { data: settingsData } = useSettings()
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210')

  useEffect(() => {
    const num = (settingsData?.whatsappNumber || '').replace(/\D/g, '')
    setWhatsappNumber(num ? (num.startsWith('91') ? num : '91' + num) : '919876543210')
  }, [settingsData])

  const whatsappUrl = `https://wa.me/${whatsappNumber || '919876543210'}`

  return (
    <footer className="app-footer">
      <div className="footer-bg-image" aria-hidden="true"></div>
      <div className="container footer-inner">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MKT Wholesale</h3>
            <p>Your trusted partner for bulk orders of traditional Indian clothing items.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/account/orders">My Orders</Link></li>
              <li><Link to="/account/ledger">Payment Ledger</Link></li>
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
          <div className="footer-section footer-contact-section">
            <h4>Contact</h4>
            <p>Email: info@mktwholesale.com</p>
            <p>Phone: +91 XXXXX XXXXX</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp-icon"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">&copy; 2024 MKT Wholesale. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
