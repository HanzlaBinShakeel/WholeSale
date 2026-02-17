import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FiGrid, FiPackage, FiShoppingCart, FiUsers, FiCreditCard, FiImage, FiLayout, FiSettings, FiSliders } from 'react-icons/fi'
import './AdminLayout.css'

const navItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/payments', icon: FiCreditCard, label: 'Payments' },
  { path: '/admin/banners', icon: FiImage, label: 'Banners & Slider' },
  { path: '/admin/sections', icon: FiLayout, label: 'Site Sections' },
  { path: '/admin/settings', icon: FiSliders, label: 'Settings (CMS)' },
]

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="admin-logo">
            <span className="logo-text">MKT</span>
            <span className="logo-badge">Admin</span>
          </Link>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="admin-nav">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path)
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
          <Link to="/" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <FiSettings className="nav-icon" />
            <span>View Store</span>
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className="admin-page-title">Admin Panel</h1>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default AdminLayout
