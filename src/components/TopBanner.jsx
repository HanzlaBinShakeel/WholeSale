import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './TopBanner.css'

const PROMOS = [
  'Wedding Season Sale — Extra 10% off on bulk orders above ₹25,000',
  'Free delivery on orders above ₹10,000 — Pan India',
  'New buyer bonus — Register now & get exclusive wholesale pricing',
]

function TopBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="top-banner">
      <div className="top-banner-bg"></div>
      <div className="top-banner-shimmer"></div>
      <div className="top-banner-content">
        <div className="top-banner-marquee-wrap">
          <div className="top-banner-marquee">
            {PROMOS.map((text, idx) => (
              <span key={idx} className="top-banner-item">
                {text}
              </span>
            ))}
            {PROMOS.map((text, idx) => (
              <span key={`dup-${idx}`} className="top-banner-item">
                {text}
              </span>
            ))}
          </div>
        </div>
        <Link to="/products" className="top-banner-cta">
          Shop Now
        </Link>
        <button
          className="top-banner-close"
          onClick={() => setDismissed(true)}
          aria-label="Close banner"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default TopBanner
