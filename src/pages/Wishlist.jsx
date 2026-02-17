import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FiHeart } from 'react-icons/fi'
import './Wishlist.css'

function Wishlist() {
  const { wishlist, removeFromWishlist, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="empty-wishlist">
            <FiHeart className="empty-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Save products you like by tapping the heart icon</p>
            <Link to="/products" className="btn-primary large">Browse Products</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="page-header">
          <h1>Wishlist</h1>
          <span className="pill pill-neutral">{wishlist.length} items</span>
        </div>
        <div className="wishlist-grid">
          {wishlist.map(product => {
            const img = product.images?.[0] || product.image
            return (
              <div key={product.id} className="wishlist-card">
                <button
                  className="wishlist-remove"
                  onClick={() => toggleWishlist(product)}
                  aria-label="Remove from wishlist"
                >
                  <FiHeart fill="currentColor" />
                </button>
                <Link to={`/product/${product.id}`} className="wishlist-image">
                  <img src={img} alt={product.name} />
                </Link>
                <div className="wishlist-info">
                  <h3>{product.name}</h3>
                  <span className="wishlist-code">{product.code}</span>
                  <div className="wishlist-meta">
                    <span>₹{product.price}/pc</span>
                    <span>MOQ: {product.moq}</span>
                  </div>
                  <div className="wishlist-actions">
                    <Link to={`/product/${product.id}`} className="btn-secondary small">View</Link>
                    {isAuthenticated && (
                      <button
                        className="btn-primary small"
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(product, product.moq || 1)
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
