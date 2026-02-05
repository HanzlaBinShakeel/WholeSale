import React, { useState, useEffect } from 'react'
import './SplashScreen.css'

function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        onComplete()
      }, 500)
    }, 2500) // Show for 2.5 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-container">
        {/* Side Images */}
        <div className="splash-side-images">
          <div className="side-image left saafa">
            <div className="splash-icon">🧣</div>
            <span>Saafa</span>
          </div>
          <div className="side-image left odhna">
            <div className="splash-icon">👗</div>
            <span>Odhna</span>
          </div>
          <div className="side-image right suit">
            <div className="splash-icon">👔</div>
            <span>Rajputi Suit</span>
          </div>
          <div className="side-image right jod">
            <div className="splash-icon">👖</div>
            <span>Rajputi Jod</span>
          </div>
        </div>

        {/* Center Logo */}
        <div className="splash-center">
          <div className="splash-logo">
            <div className="logo-circle">
              <span className="logo-text">MKT</span>
            </div>
            <h1 className="splash-title">Wholesale</h1>
            <p className="splash-subtitle">Bulk Orders for Saafa, Odhna & Rajputi Items</p>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="splash-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
