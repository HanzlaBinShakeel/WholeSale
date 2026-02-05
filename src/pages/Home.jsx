import React from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import './Home.css'

const categories = [
  { id: 'saafa', name: 'Saafa', icon: '🧣', count: 45, desc: 'Traditional headwear' },
  { id: 'odhna', name: 'Odhna', icon: '👗', count: 32, desc: 'Elegant dupattas' },
  { id: 'rajputi-suit', name: 'Rajputi Suit', icon: '👔', count: 28, desc: 'Royal ensembles' },
  { id: 'rajputi-jod', name: 'Rajputi Jod', icon: '👖', count: 18, desc: 'Traditional bottoms' },
  { id: 'bandhej', name: 'Bandhej', icon: '🎀', count: 25, desc: 'Tie & dye crafts' }
]

const newArrivals = [
  { id: 1, name: 'Premium Saafa Set', code: 'SAF-001', price: 450, moq: 50, stock: 'available', image: 'https://via.placeholder.com/300x300/0C4A6E/FFFFFF?text=Premium+Saafa' },
  { id: 2, name: 'Designer Odhna', code: 'ODH-205', price: 680, moq: 20, stock: 'available', image: 'https://via.placeholder.com/300x300/B45309/FFFFFF?text=Designer+Odhna' },
  { id: 3, name: 'Royal Rajputi Suit', code: 'RJS-108', price: 1200, moq: 30, stock: 'limited', image: 'https://via.placeholder.com/300x300/047857/FFFFFF?text=Royal+Suit' },
  { id: 4, name: 'Traditional Saafa', code: 'SAF-002', price: 350, moq: 100, stock: 'available', image: 'https://via.placeholder.com/300x300/0369A1/FFFFFF?text=Traditional+Saafa' }
]

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section - Elegant */}
      <section className="hero-section">
        <div className="hero-bg-pattern"></div>
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">B2B Wholesale</span>
            <h1>Premium Traditional Textiles</h1>
            <p className="hero-subtitle">
              Saafa, Odhna & Rajputi — curated for wedding seasons and festivals.<br className="hide-mobile" />
              Bulk orders with guaranteed quality.
            </p>
            <div className="hero-cta">
              <Link to="/products" className="btn-primary large hero-btn-primary">
                Browse Catalogue
              </Link>
              <Link to="/login" className="btn-secondary large hero-btn-secondary">
                Register as Buyer
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-category-pills">
              {['🧣 Saafa', '👗 Odhna', '👔 Suit', '👖 Jod'].map((item, idx) => (
                <div key={idx} className="hero-pill">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Elegant Cards with Scroll Animation */}
      <section className="categories-section">
        <div className="container">
          <ScrollReveal variant="fadeUp">
            <div className="section-header-elegant">
              <h2 className="section-title-elegant">Shop by Category</h2>
              <p className="section-desc">Explore our curated collection of traditional textiles</p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="stagger" className="categories-grid-elegant">
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-card-elegant">
                <div className="category-card-inner">
                  <span className="category-icon-elegant">{cat.icon}</span>
                  <h3>{cat.name}</h3>
                  <p className="category-desc">{cat.desc}</p>
                  <span className="category-count-elegant">{cat.count} products</span>
                </div>
              </Link>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals - Elegant Grid with Scroll Animation */}
      <section className="new-arrivals-section">
        <div className="container">
          <ScrollReveal variant="fadeUp">
            <div className="section-header-elegant">
              <h2 className="section-title-elegant">New Arrivals</h2>
              <Link to="/products" className="view-all-elegant">View All Products →</Link>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="stagger" className="products-grid-elegant">
            {newArrivals.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Wholesale Notice - Elegant with Scroll Animation */}
      <section className="wholesale-notice-section">
        <div className="container">
          <ScrollReveal variant="fadeUp">
            <div className="wholesale-notice-elegant">
              <div className="wholesale-notice-icon">
                <span>📦</span>
              </div>
              <div className="wholesale-notice-content">
                <h3>Wholesale Orders Only</h3>
                <p>Minimum order quantity (MOQ) applies. Retail orders are not available. Register as a buyer to access our full catalogue and place bulk orders.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }) {
  const stockClass = { available: 'available', limited: 'limited', 'out-of-stock': 'out-of-stock' }[product.stock] || 'available'
  return (
    <Link to={`/product/${product.id}`} className="product-card-elegant">
      <div className="product-card-tags-home">
        <span className="pill pill-warning">New</span>
        {product.subCategory && <span className="tag">{product.subCategory}</span>}
      </div>
      <div className="product-image-elegant">
        <img src={product.image} alt={product.name} />
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
  )
}

export default Home
