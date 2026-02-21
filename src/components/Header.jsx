import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { FiSearch, FiShoppingCart, FiHeart } from 'react-icons/fi'
import './Header.css'

function Header() {
  const { user, logout, isAdmin } = useAuth()
  const { getItemCount } = useCart()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const cartCount = getItemCount()
  const wishlistCount = useWishlist().wishlist.length

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-text">MKT</span>
              {isAdmin && <span className="admin-badge">Admin</span>}
            </Link>

            <nav className="main-nav">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/products" className="nav-link">
                Products
              </Link>
              {user && (
                <>
                  <Link to="/orders" className="nav-link">
                    My Orders
                  </Link>
                  <Link to="/ledger" className="nav-link">
                    Ledger
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              )}
            </nav>

            <div className="header-actions">
              <button
                className="icon-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <FiSearch />
              </button>
              <Link to="/wishlist" className="icon-btn cart-btn" aria-label="Wishlist">
                <FiHeart />
                {wishlistCount > 0 && (
                  <span className="badge">{wishlistCount > 99 ? '99+' : wishlistCount}</span>
                )}
              </Link>
              <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
                <FiShoppingCart />
                {cartCount > 0 && (
                  <span className="badge">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </Link>

              {user ? (
                <div className="user-menu">
                  <span className="user-name">{user.name || user.shopName}</span>
                  <button className="btn-secondary small" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary small">
                  Login
                </Link>
              )}

            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="search-bar">
          <div className="container">
            <form onSubmit={handleSearch} className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by product name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="close-search"
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
              >
                ×
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
