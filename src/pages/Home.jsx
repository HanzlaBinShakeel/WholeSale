import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { FiHeart } from 'react-icons/fi'
import ScrollReveal from '../components/ScrollReveal'
import HeroSlider from '../components/HeroSlider'
import { defaultCollections, defaultProducts, normalizeCollections, normalizeProducts } from '../data/defaultCatalog'
import './Home.css'

const SECTIONS_KEY = 'adminSections'
const BANNERS_KEY = 'adminBanners'
const PRODUCTS_KEY = 'adminProducts'
const SETTINGS_KEY = 'adminSettings'
const COLLECTIONS_KEY = 'adminCollections'

const fallbackCollections = defaultCollections
const fallbackProducts = defaultProducts

function Home() {
  const [sections, setSections] = useState({ heroSlider: true, categories: true, newArrivals: true, wholesaleNotice: true })
  const [showAdminSlider, setShowAdminSlider] = useState(false)
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState(fallbackCollections)
  const [settings, setSettings] = useState({ heroTitle: 'Premium Traditional Textiles', heroSubtitle: 'Saafa, Odhna & Rajputi — curated for wedding seasons and festivals.' })

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SECTIONS_KEY) || '{}')
      if (s) setSections(prev => ({ ...prev, ...s }))
    } catch (e) {}
  }, [])

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const p = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]')
        const normalizedProducts = normalizeProducts(p)
        if (normalizedProducts.length) {
          setProducts(normalizedProducts.slice(0, 12))
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(normalizedProducts))
        }
        const c = JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]')
        const normalizedCollections = normalizeCollections(c)
        if (normalizedCollections.length) {
          setCollections(normalizedCollections)
          localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(normalizedCollections))
        }
      } catch (e) {}
    }
    window.addEventListener('storage', syncFromStorage)
    const timer = window.setInterval(syncFromStorage, 5000)
    return () => {
      window.removeEventListener('storage', syncFromStorage)
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    try {
      const st = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
      if (Object.keys(st).length) setSettings(prev => ({ ...prev, ...st }))
    } catch (e) {}
  }, [])

  useEffect(() => {
    const banners = JSON.parse(localStorage.getItem(BANNERS_KEY) || '[]')
    setShowAdminSlider(banners.length > 0 && sections.heroSlider)
  }, [sections.heroSlider])

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]')
      const normalizedProducts = normalizeProducts(p)
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(normalizedProducts))
      setProducts(normalizedProducts.slice(0, 12))
    } catch (e) {
      setProducts(fallbackProducts)
    }
  }, [])

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]')
      const normalizedCollections = normalizeCollections(c)
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(normalizedCollections))
      setCollections(normalizedCollections)
    } catch (e) {}
  }, [])

  return (
    <div className="home-page">
      <div className="hero-fixed-wrap">
        {showAdminSlider && <HeroSlider />}
        {!showAdminSlider && (
          <section className="hero-section hero-split">
          <div className="hero-left">
            <div className="hero-left-bg"></div>
            <div className="hero-left-content">
              <span className="hero-badge hero-anim" style={{ animationDelay: '0.1s' }}>B2B Wholesale</span>
              <h1 className="hero-anim" style={{ animationDelay: '0.2s' }}>{settings.heroTitle || 'Premium Traditional Textiles'}</h1>
              <p className="hero-subtitle hero-anim" style={{ animationDelay: '0.3s' }}>
                {settings.heroSubtitle || 'Saafa, Odhna & Rajputi — curated for wedding seasons and festivals.'}
                <br className="hide-mobile" />
                Bulk orders with guaranteed quality.
              </p>
              <div className="hero-tags hero-anim" style={{ animationDelay: '0.4s' }}>
                {['🧣 Saafa', '👗 Odhna', '👔 Suit', '👖 Jod'].map((item, idx) => (
                  <span key={idx} className="hero-tag">{item}</span>
                ))}
              </div>
              <div className="hero-cta hero-anim" style={{ animationDelay: '0.5s' }}>
                <Link to="/products" className="btn-primary large hero-btn-primary">Browse Catalogue</Link>
                <Link to="/login" className="btn-secondary large hero-btn-secondary">Register as Buyer</Link>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image-wrap">
              <img src="/hero-bg.png" alt="Traditional textiles" />
            </div>
          </div>
          <div className="hero-cloud-bottom" aria-hidden="true"></div>
          </section>
        )}
        <div className="hero-spacer" aria-hidden="true"></div>
      </div>

      {sections.categories !== false && (
        <section className="categories-section">
          <div className="container">
            <ScrollReveal variant="fadeUp">
              <div className="section-header-elegant">
                <h2 className="section-title-elegant section-title-luxe">Collection list</h2>
                <p className="section-desc">Explore signature drops curated for wholesale buyers</p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="stagger" className="collections-grid-home">
              {collections
                .filter((item) => item.enabled !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item) => (
                <Link key={item.id} to="/products" className="collection-card-home">
                  <div className="collection-card-media">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = 'https://cdn.shopify.com/s/files/1/0552/5291/0159/files/DSC_7127copy.jpg?v=1743675084'
                      }}
                    />
                  </div>
                  <div className="collection-card-label">
                    <h3>{item.name}</h3>
                  </div>
                </Link>
              ))}
            </ScrollReveal>
          </div>
        </section>
      )}

      {sections.newArrivals !== false && (
        <section className="new-arrivals-section">
          <div className="container">
            <ScrollReveal variant="fadeUp">
              <div className="section-header-elegant">
                <h2 className="section-title-elegant">New Arrivals</h2>
                <Link to="/products" className="view-all-elegant">View All Products →</Link>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="stagger" className="products-grid-elegant">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ScrollReveal>
          </div>
        </section>
      )}

      {sections.deals !== false && (
        <section className="deals-section">
          <div className="container">
            <ScrollReveal variant="fadeUp">
              <div className="deals-banner">
                <div className="deals-content">
                  <span className="deals-badge">Limited Time</span>
                  <h2>Wedding Season Sale — Up to 15% Off</h2>
                  <p>Bulk orders above ₹25,000 get exclusive discounts</p>
                  <Link to="/products" className="btn-primary">Shop Deals</Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {sections.wholesaleNotice !== false && (
        <section className="wholesale-notice-section">
          <div className="container">
            <ScrollReveal variant="fadeUp">
              <div className="wholesale-notice-elegant">
                <div className="wholesale-notice-icon"><span>📦</span></div>
                <div className="wholesale-notice-content">
                  <h3>Wholesale Orders Only</h3>
                  <p>Minimum order quantity (MOQ) applies. Retail orders are not available. Register as a buyer to access our full catalogue and place bulk orders.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  )
}

function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const stockClass = { available: 'available', limited: 'limited', 'out-of-stock': 'out-of-stock' }[product.stock] || 'available'
  const img = product.images?.[0] || product.image
  return (
    <div className="product-card-elegant-wrap">
      <button
        className={`wishlist-btn-home ${isInWishlist(product.id) ? 'active' : ''}`}
        onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
        aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FiHeart fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
      </button>
    <Link to={`/product/${product.id}`} className="product-card-elegant">
      <div className="product-card-tags-home">
        <span className="pill pill-warning">New</span>
        {product.subCategory && <span className="tag">{product.subCategory}</span>}
      </div>
      <div className="product-image-elegant">
        <img
          src={img}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = 'https://cdn.shopify.com/s/files/1/0552/5291/0159/files/DSC_1682copy2.jpg?v=1685443071'
          }}
        />
      </div>
      <div className="product-info-elegant">
        <h3>{product.name}</h3>
        <span className="product-code-elegant">{product.code}</span>
        <div className="product-meta-elegant">
          <span>MOQ: {product.moq}</span>
          <span className="product-price-elegant">₹{product.price}/pc</span>
        </div>
        <span className={`pill pill-${stockClass === 'available' ? 'success' : stockClass === 'limited' ? 'warning' : 'error'}`}>
          {product.stock === 'available' ? 'In Stock' : product.stock === 'limited' ? 'Limited' : 'Out of Stock'}
        </span>
      </div>
    </Link>
    </div>
  )
}

export default Home
