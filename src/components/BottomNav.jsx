import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './BottomNav.css'

function BottomNav() {
  const location = useLocation()
  const { user } = useAuth()
  const { getItemCount } = useCart()
  const cartCount = getItemCount()

  // Hide on login and admin pages
  if (location.pathname === '/login' || location.pathname.startsWith('/admin')) {
    return null
  }

  const navItems = [
    { to: '/', icon: FiHome, label: 'Home' },
    { to: '/products', icon: FiGrid, label: 'Products' },
    { to: '/cart', icon: FiShoppingCart, label: 'Cart', badge: cartCount },
    { to: user ? '/orders' : '/login', icon: FiUser, label: user ? 'Orders' : 'Login' },
  ]

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <div className="bottom-nav-inner">
        {navItems.map(({ to, icon: Icon, label, badge }) => {
          const isActive = location.pathname === to || 
            (to === '/products' && location.pathname.startsWith('/product'))
          return (
            <Link
              key={to}
              to={to}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="bottom-nav-icon">
                <Icon />
                {badge > 0 && (
                  <span className="bottom-nav-badge">{badge > 99 ? '99+' : badge}</span>
                )}
              </span>
              <span className="bottom-nav-label">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
