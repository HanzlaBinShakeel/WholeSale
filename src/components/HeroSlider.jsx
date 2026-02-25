import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBanners } from '../hooks/useData'
import './HeroSlider.css'

function HeroSlider() {
  const { data: bannersData } = useBanners()
  const [banners, setBanners] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setBanners(bannersData || [])
  }, [bannersData])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => {
      setActiveIndex(i => (i + 1) % banners.length)
    }, 5000)
    return () => clearInterval(t)
  }, [banners.length])

  if (banners.length === 0) return null

  return (
    <section className="hero-slider-section">
      <div className="hero-slider">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className={`hero-slide ${idx === activeIndex ? 'active' : ''}`}
            style={{ backgroundImage: b.image ? `url(${b.image})` : undefined }}
          >
            <div className="hero-slide-overlay"></div>
            <div className="container hero-slide-content">
              {(b.title || b.subtitle) && (
                <div className="hero-slide-text">
                  {b.title && <h1>{b.title}</h1>}
                  {b.subtitle && <p>{b.subtitle}</p>}
                  {b.link && b.link !== '#' && (
                    <Link to={b.link.startsWith('/') ? b.link : `/products`} className="btn-primary large hero-slide-cta">
                      Shop Now
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <div className="hero-slider-dots">
          {banners.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroSlider
