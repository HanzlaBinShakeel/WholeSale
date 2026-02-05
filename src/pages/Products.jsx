import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import './Products.css'

// Sample products data with sub-categories
const allProducts = [
  { id: 1, name: 'Premium Saafa Set - Red', code: 'SAF-001', category: 'saafa', subCategory: 'Wedding', price: 450, moq: 50, stock: 'available', image: 'https://via.placeholder.com/300x300/1E40AF/FFFFFF?text=Premium+Saafa' },
  { id: 2, name: 'Designer Odhna - Blue', code: 'ODH-205', category: 'odhna', subCategory: 'Premium', price: 680, moq: 20, stock: 'available', image: 'https://via.placeholder.com/300x300/D97706/FFFFFF?text=Designer+Odhna' },
  { id: 3, name: 'Royal Rajputi Suit', code: 'RJS-108', category: 'rajputi-suit', subCategory: 'Wedding', price: 1200, moq: 30, stock: 'limited', image: 'https://via.placeholder.com/300x300/7C3AED/FFFFFF?text=Royal+Suit' },
  { id: 4, name: 'Traditional Saafa - Green', code: 'SAF-003', category: 'saafa', subCategory: 'Daily', price: 350, moq: 100, stock: 'available', image: 'https://via.placeholder.com/300x300/059669/FFFFFF?text=Traditional+Saafa' },
  { id: 5, name: 'Daily Wear Odhna', code: 'ODH-101', category: 'odhna', subCategory: 'Daily', price: 450, moq: 50, stock: 'available', image: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=Daily+Odhna' },
  { id: 6, name: 'Wedding Bandhej Set', code: 'BAN-201', category: 'bandhej', subCategory: 'Wedding', price: 850, moq: 25, stock: 'available', image: 'https://via.placeholder.com/300x300/EC4899/FFFFFF?text=Wedding+Bandhej' },
]

function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState(allProducts)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedSubCategory, setSelectedSubCategory] = useState('all')

  useEffect(() => {
    // Load products from admin or use sample
    const adminProducts = localStorage.getItem('adminProducts')
    let allProductsData = allProducts
    
    if (adminProducts) {
      try {
        const parsed = JSON.parse(adminProducts)
        if (parsed.length > 0) {
          allProductsData = parsed
        }
      } catch (e) {
        // Use default
      }
    }

    let filtered = allProductsData

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (selectedSubCategory !== 'all') {
      filtered = filtered.filter(p => p.subCategory === selectedSubCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.code.toLowerCase().includes(query)
      )
    }

    setProducts(filtered)
  }, [searchQuery, selectedCategory, selectedSubCategory])

  return (
    <div className="products-page">
      <div className="container">
        <ScrollReveal variant="fadeUp">
          <div className="page-header">
            <div className="page-header-top">
              <h1>Our Products</h1>
              <span className="pill pill-neutral">{products.length} products</span>
            </div>
            <p>Browse our complete wholesale catalogue</p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp">
          <div className="filter-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>Category</label>
              <div className="filter-chips">
                {['all', 'saafa', 'odhna', 'rajputi-suit', 'rajputi-jod', 'bandhej'].map(cat => (
                  <button
                    key={cat}
                    className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat)
                      setSelectedSubCategory('all')
                    }}
                  >
                    {cat === 'all' ? 'All' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-group">
              <label>Sub-Category</label>
              <div className="filter-chips">
                {['all', 'Wedding', 'Daily', 'Premium'].map(sub => (
                  <button
                    key={sub}
                    className={`chip ${selectedSubCategory === sub ? 'active' : ''}`}
                    onClick={() => setSelectedSubCategory(sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>

        <ScrollReveal variant="stagger" className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollReveal>

        {products.length === 0 && (
          <ScrollReveal variant="fadeUp">
            <div className="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const stockBadgeClass = {
    available: 'available',
    limited: 'limited',
    'out-of-stock': 'out-of-stock'
  }[product.stock] || 'available'

  return (
    <div className="product-card">
      <div className="product-card-tags">
        <span className="pill pill-warning">New</span>
        {product.subCategory && (
          <span className="tag">{product.subCategory}</span>
        )}
      </div>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <span className="pill pill-neutral">Code: {product.code}</span>
        <div className="product-meta">
          <span className="pill">MOQ {product.moq}</span>
          <span className="price">₹{product.price}/pc</span>
        </div>
        <span className={`pill pill-${stockBadgeClass === 'available' ? 'success' : stockBadgeClass === 'limited' ? 'warning' : 'error'}`}>
          {product.stock === 'available' ? 'In Stock' : 
           product.stock === 'limited' ? 'Limited' : 'Out of Stock'}
        </span>
        <Link to={`/product/${product.id}`} className="btn-primary small full-width">
          View Details
        </Link>
      </div>
    </div>
  )
}

export default Products
