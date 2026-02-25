import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSections } from '../hooks/useData'
import './TopBanner.css'

const PROMOS = [
  'Wedding Season Sale — Extra 10% off on bulk orders above ₹25,000',
  'Free delivery on orders above ₹10,000 — Pan India',
  'New buyer bonus — Register now & get exclusive wholesale pricing',
]

function TopBanner() {
  const { data: sectionsData } = useSections()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (sectionsData?.topBanner === false) setVisible(false)
  }, [sectionsData])

  if (!visible) return null

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
      </div>
    </div>
  )
}

export default TopBanner
