import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { FiHeart } from 'react-icons/fi'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import ScrollReveal from '../components/ScrollReveal'
import { defaultProducts, normalizeProducts } from '../data/defaultCatalog'
import './ProductDetail.css'

const PRODUCTS_KEY = 'adminProducts'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { showNotification } = useNotification()
  const { isAuthenticated } = useAuth()

  const getLiveProduct = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]')
      const catalog = normalizeProducts(saved)
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(catalog))
      return catalog.find((item) => String(item.id) === String(id)) || catalog[0] || defaultProducts[0]
    } catch (e) {
      return defaultProducts.find((item) => String(item.id) === String(id)) || defaultProducts[0]
    }
  }

  const product = useMemo(() => getLiveProduct(), [id])
  const [liveProduct, setLiveProduct] = useState(product)

  const productColors = liveProduct.colors?.length ? liveProduct.colors : ['Default']
  const productImages = liveProduct.images?.length ? liveProduct.images : [liveProduct.image].filter(Boolean)
  const [selectedColor, setSelectedColor] = useState(productColors[0])
  const [selectedImage, setSelectedImage] = useState(getColorImage(liveProduct, productColors[0]) || productImages[0] || liveProduct.image)
  const [quantity, setQuantity] = useState(liveProduct.moq || 1)

  useEffect(() => {
    const firstColor = (liveProduct.colors && liveProduct.colors[0]) || 'Default'
    setSelectedColor(firstColor)
    setSelectedImage(getColorImage(liveProduct, firstColor) || productImages[0] || liveProduct.image)
    setQuantity(liveProduct.moq || 1)
  }, [liveProduct, productImages])

  useEffect(() => {
    const syncProduct = () => {
      const next = getLiveProduct()
      setLiveProduct(next)
    }
    window.addEventListener('storage', syncProduct)
    const timer = window.setInterval(syncProduct, 5000)
    return () => {
      window.removeEventListener('storage', syncProduct)
      window.clearInterval(timer)
    }
  }, [id])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showNotification('Please login to add products to cart', 'warning')
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }

    addToCart(liveProduct, quantity, selectedColor || productColors[0])
    showNotification('Product added to cart!', 'success')
    navigate('/cart')
  }

  const increaseQty = () => {
    setQuantity(prev => prev + liveProduct.moq)
  }

  const decreaseQty = () => {
    if (quantity > liveProduct.moq) {
      setQuantity(prev => prev - liveProduct.moq)
    }
  }

  const total = quantity * liveProduct.price

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
              <img src={selectedImage} alt={liveProduct.name} />
            </div>
            <div className="thumbnail-images">
              {productImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${liveProduct.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info-detail">
            <div className="product-header-detail">
              <div>
                <h1>{liveProduct.name}</h1>
                <div className="product-code-large">Code: {liveProduct.code}</div>
              </div>
              <button
                className={`wishlist-btn-detail ${isInWishlist(liveProduct.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(liveProduct)}
                aria-label={isInWishlist(liveProduct.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart fill={isInWishlist(liveProduct.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="product-badges">
              <span className="pill">{liveProduct.category}</span>
              {liveProduct.subCategory && (
                <span className="tag">{liveProduct.subCategory}</span>
              )}
              <span className={`pill pill-${liveProduct.stock === 'available' ? 'success' : liveProduct.stock === 'limited' ? 'warning' : 'error'}`}>
                {liveProduct.stock === 'available' ? 'In Stock' : 
                 liveProduct.stock === 'limited' ? 'Limited Stock' : 'Out of Stock'}
              </span>
              <span className="pill pill-info">Wholesale</span>
            </div>

            <div className="product-specifications">
              <div className="spec-item">
                <span className="spec-label">Category:</span>
                <span className="spec-value">{liveProduct.category}</span>
              </div>
              {liveProduct.subCategory && (
                <div className="spec-item">
                  <span className="spec-label">Sub-Category:</span>
                  <span className="spec-value">{liveProduct.subCategory}</span>
                </div>
              )}
              <div className="spec-item">
                <span className="spec-label">Fabric Type:</span>
                <span className="spec-value">{liveProduct.fabric}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">GSM / Weight:</span>
                <span className="spec-value">{liveProduct.gsm || liveProduct.weight}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Size / Length:</span>
                <span className="spec-value">{liveProduct.size || liveProduct.length}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Colors Available:</span>
                <div className="color-options">
                  {productColors.map(color => (
                    <span
                      key={color}
                      className={`color-chip ${selectedColor === color ? 'active' : ''}`}
                      style={{ background: getColorHex(color) }}
                      onClick={() => {
                        setSelectedColor(color)
                        const colorImage = getColorImage(liveProduct, color)
                        if (colorImage) setSelectedImage(colorImage)
                      }}
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
                  <p className="moq-value"><span className="pill pill-neutral">{liveProduct.moq} pieces</span></p>
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
                  <span className="price-large">₹{liveProduct.price}</span>
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
              <p>{liveProduct.description}</p>
              
              {liveProduct.use && (
                <div className="description-section">
                  <h4>Use:</h4>
                  <p>{liveProduct.use}</p>
                </div>
              )}
              
              {liveProduct.quality && (
                <div className="description-section">
                  <h4>Quality:</h4>
                  <p>{liveProduct.quality}</p>
                </div>
              )}
              
              {liveProduct.packing && (
                <div className="description-section">
                  <h4>Packing:</h4>
                  <p>{liveProduct.packing}</p>
                </div>
              )}
            </div>

            <div className="order-section">
              <div className="quantity-selector">
                <label>Select Quantity (MOQ: {liveProduct.moq} pcs)</label>
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={decreaseQty} type="button">−</button>
                  <input type="number" value={quantity} readOnly />
                  <button className="qty-btn" onClick={increaseQty} type="button">+</button>
                </div>
                <p className="qty-note">Bulk units only (increments of {liveProduct.moq})</p>
              </div>

              <div className="color-selector">
                <label>Select Color</label>
                <div className="color-options-large">
                  {productColors.map(color => (
                    <div
                      key={color}
                      className={`color-option ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedColor(color)
                        const colorImage = getColorImage(liveProduct, color)
                        if (colorImage) setSelectedImage(colorImage)
                      }}
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
                  <span>₹{liveProduct.price}</span>
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
    'Purple': 'var(--swatch-purple)',
    'Black': '#1f1f1f',
    'Black Gold': '#2d2926',
    'Maroon': '#7b2337',
    'Pink': '#e79cb3',
    'Rose': '#d97b93',
    'Rose Pink': '#cf7397',
    'Fuchsia': '#ba3f7a',
    'Peach': '#e9b39a',
    'Coral': '#de8d7f',
    'Coral Pink': '#e18f97',
    'Soft Rose': '#d8929f',
    'Ivory': '#f5f0df',
    'Off White': '#f7f1e8',
    'Orange': '#de8f43',
    'Magenta': '#ba397d',
    'Navy': '#2f3d68',
    'Blue Grey': '#5b6983',
    'Royal Blue': '#2f4f92',
    'Leaf Green': '#5f8b49',
    'Olive': '#6f7440',
    'Multicolour': 'linear-gradient(135deg,#dc6d6d 0%,#e6b54c 35%,#74b67a 70%,#6c7fd3 100%)'
  }
  return colors[color] || 'var(--color-text-muted)'
}

function getColorImage(product, color) {
  if (!product) return ''
  const mapped = product.colorImageMap?.[color]
  if (mapped) return mapped
  const images = product.images || []
  if (!images.length) return product.image || ''
  const index = Math.abs(hashString(color || 'default')) % images.length
  return images[index]
}

function hashString(input = '') {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i)
    hash |= 0
  }
  return hash
}

export default ProductDetail
