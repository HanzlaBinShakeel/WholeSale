import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { FiHeart } from 'react-icons/fi'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import ScrollReveal from '../components/ScrollReveal'
import './ProductDetail.css'

// Sample product data
const productData = {
  1: {
    id: 1,
    name: 'Premium Saafa Set - Red',
    code: 'SAF-001',
    category: 'Saafa',
    subCategory: 'Wedding', // Wedding / Daily / Premium
    price: 450,
    moq: 50,
    stock: 'available',
    fabric: 'Premium Cotton',
    gsm: '180 GSM',
    size: '5 meters',
    length: '5 meters',
    weight: '180 GSM',
    colors: ['Red', 'Blue', 'Green', 'Purple'],
    images: [
      'https://via.placeholder.com/600x600/1E40AF/FFFFFF?text=Image+1',
      'https://via.placeholder.com/600x600/D97706/FFFFFF?text=Image+2',
      'https://via.placeholder.com/600x600/7C3AED/FFFFFF?text=Image+3',
      'https://via.placeholder.com/600x600/059669/FFFFFF?text=Image+4'
    ],
    description: 'Premium quality saafa set perfect for weddings and special occasions. Made from high-grade cotton fabric with traditional designs.',
    use: 'Perfect for weddings, festivals, and special occasions',
    quality: 'Premium grade cotton with handcrafted traditional designs',
    packing: 'Standard packing: 10 pieces per box'
  }
}

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { showNotification } = useNotification()
  const { isAuthenticated } = useAuth()
  
  const product = productData[id] || productData[1]
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(product.moq)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showNotification('Please login to add products to cart', 'warning')
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }

    addToCart(product, quantity, selectedColor)
    showNotification('Product added to cart!', 'success')
    navigate('/cart')
  }

  const increaseQty = () => {
    setQuantity(prev => prev + product.moq)
  }

  const decreaseQty = () => {
    if (quantity > product.moq) {
      setQuantity(prev => prev - product.moq)
    }
  }

  const total = quantity * product.price

  return (
    <div className="product-detail-page">
      {/* Sticky Add-to-Cart Bar - Mobile Only */}
      {(
        <div className="product-sticky-bar">
          <div className="sticky-bar-content">
            <div className="sticky-bar-price">
              <span className="sticky-bar-label">Total</span>
              <span className="sticky-bar-total">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button className="btn-primary sticky-bar-cta" onClick={handleAddToCart}>
              {isAuthenticated ? 'Add to Cart' : 'Login to Add'}
            </button>
          </div>
        </div>
      )}
      <div className="container">
        <ScrollReveal variant="fadeUp" className="product-detail-container">
          <div className="product-image-gallery">
            <div className="main-image">
              <img src={selectedImage} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info-detail">
            <div className="product-header-detail">
              <div>
                <h1>{product.name}</h1>
                <div className="product-code-large">Code: {product.code}</div>
              </div>
              <button
                className={`wishlist-btn-detail ${isInWishlist(product.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="product-badges">
              <span className="pill">{product.category}</span>
              {product.subCategory && (
                <span className="tag">{product.subCategory}</span>
              )}
              <span className={`pill pill-${product.stock === 'available' ? 'success' : product.stock === 'limited' ? 'warning' : 'error'}`}>
                {product.stock === 'available' ? 'In Stock' : 
                 product.stock === 'limited' ? 'Limited Stock' : 'Out of Stock'}
              </span>
              <span className="pill pill-info">Wholesale</span>
            </div>

            <div className="product-specifications">
              <div className="spec-item">
                <span className="spec-label">Category:</span>
                <span className="spec-value">{product.category}</span>
              </div>
              {product.subCategory && (
                <div className="spec-item">
                  <span className="spec-label">Sub-Category:</span>
                  <span className="spec-value">{product.subCategory}</span>
                </div>
              )}
              <div className="spec-item">
                <span className="spec-label">Fabric Type:</span>
                <span className="spec-value">{product.fabric}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">GSM / Weight:</span>
                <span className="spec-value">{product.gsm || product.weight}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Size / Length:</span>
                <span className="spec-value">{product.size || product.length}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Colors Available:</span>
                <div className="color-options">
                  {product.colors.map(color => (
                    <span
                      key={color}
                      className={`color-chip ${selectedColor === color ? 'active' : ''}`}
                      style={{ background: getColorHex(color) }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="moq-section">
              <div className="moq-header">
                <span className="moq-icon">📦</span>
                <div>
                  <h3>Minimum Order Quantity</h3>
                  <p className="moq-value"><span className="pill pill-neutral">{product.moq} pieces</span></p>
                </div>
              </div>
              <div className="wholesale-notice-small">
                <span>⚠️</span>
                <span>Wholesale orders only. Retail not available.</span>
              </div>
            </div>

            <div className="pricing-section">
              {isAuthenticated ? (
                <div className="price-display">
                  <span className="price-label">Price per piece:</span>
                  <span className="price-large">₹{product.price}</span>
                </div>
              ) : (
                <div className="price-display contact-price">
                  <span className="price-label">Price:</span>
                  <span className="price-large">Contact for Price</span>
                  <p className="login-prompt">Login to view pricing</p>
                </div>
              )}
            </div>

            <div className="product-description">
              <h3>Product Description</h3>
              <p>{product.description}</p>
              
              {product.use && (
                <div className="description-section">
                  <h4>Use:</h4>
                  <p>{product.use}</p>
                </div>
              )}
              
              {product.quality && (
                <div className="description-section">
                  <h4>Quality:</h4>
                  <p>{product.quality}</p>
                </div>
              )}
              
              {product.packing && (
                <div className="description-section">
                  <h4>Packing:</h4>
                  <p>{product.packing}</p>
                </div>
              )}
            </div>

            <div className="order-section">
              <div className="quantity-selector">
                <label>Select Quantity (MOQ: {product.moq} pcs)</label>
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={decreaseQty} type="button">−</button>
                  <input type="number" value={quantity} readOnly />
                  <button className="qty-btn" onClick={increaseQty} type="button">+</button>
                </div>
                <p className="qty-note">Bulk units only (increments of {product.moq})</p>
              </div>

              <div className="color-selector">
                <label>Select Color</label>
                <div className="color-options-large">
                  {product.colors.map(color => (
                    <div
                      key={color}
                      className={`color-option ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      <div className="color-preview" style={{ background: getColorHex(color) }} />
                      <span>{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="total-calculation">
                <div className="calc-row">
                  <span>Quantity:</span>
                  <span>{quantity} pcs</span>
                </div>
                <div className="calc-row">
                  <span>Price per piece:</span>
                  <span>₹{product.price}</span>
                </div>
                <div className="calc-row total">
                  <span>Total Amount:</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button className="btn-primary full-width large" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

function getColorHex(color) {
  const colors = {
    'Red': 'var(--swatch-red)',
    'Blue': 'var(--swatch-blue)',
    'Green': 'var(--swatch-green)',
    'Purple': 'var(--swatch-purple)'
  }
  return colors[color] || 'var(--color-text-muted)'
}

export default ProductDetail
