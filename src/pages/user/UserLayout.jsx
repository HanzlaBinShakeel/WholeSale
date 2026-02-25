import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FiGrid, FiPackage, FiCreditCard } from 'react-icons/fi'
import './UserLayout.css'

const navItems = [
  { path: '/account', icon: FiGrid, label: 'Dashboard', exact: true },
  { path: '/account/orders', icon: FiPackage, label: 'My Orders' },
  { path: '/account/ledger', icon: FiCreditCard, label: 'Payment Ledger' },
]

function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="user-layout">
      <aside className={`user-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/account" className="user-logo" onClick={() => setSidebarOpen(false)}>
            <span className="logo-text">My Account</span>
          </Link>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="user-nav">
          {navItems.map(({ path, icon: Icon, label, exact }) => {
            const isActive = exact
              ? location.pathname === path
              : location.pathname.startsWith(path)
            return (
              <Link
                key={path}
                to={path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="nav-icon" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <Link to="/products" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <FiPackage className="nav-icon" />
            <span>Shop Products</span>
          </Link>
        </div>
      </aside>

      <div className="user-main">
        <header className="user-topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className="user-page-title">Buyer Panel</h1>
        </header>

        <div className="user-content">
          <Outlet />
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="user-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default UserLayout
