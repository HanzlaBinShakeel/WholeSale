import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeBuyers: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    pendingOrders: 0,
    totalProducts: 0,
    outOfStock: 0
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const products = JSON.parse(localStorage.getItem('adminProducts') || '[]')

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const pendingOrders = orders.filter(o => ['received', 'packed'].includes(o.status)).length
    const pendingApprovals = users.filter(u => u.status === 'pending').length
    const approvedUsers = users.filter(u => u.status === 'approved').length
    const outOfStock = products.filter(p => p.stock === 'out-of-stock').length

    setStats({
      totalOrders: orders.length,
      activeBuyers: approvedUsers,
      totalRevenue,
      pendingApprovals,
      pendingOrders,
      totalProducts: products.length || 0,
      outOfStock
    })
    setRecentOrders(orders.slice(0, 5))
  }

  const formatRevenue = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
    return `₹${num.toLocaleString('en-IN')}`
  }

  const getStatusLabel = (status) => {
    const map = { received: 'Received', packed: 'Packed', 'partially-dispatched': 'Partially Dispatched', dispatched: 'Dispatched', delivered: 'Delivered' }
    return map[status] || status
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your wholesale business</p>
      </div>

      <div className="stats-grid dashboard-stats">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
            {stats.pendingOrders > 0 && (
              <span className="stat-change warning">{stats.pendingOrders} to process</span>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.activeBuyers}</h3>
            <p>Active Buyers</p>
          </div>
        </div>
        <div className="stat-card stat-card-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatRevenue(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Products</p>
            {stats.outOfStock > 0 && (
              <span className="stat-change warning">{stats.outOfStock} out of stock</span>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Add Product</h3>
              <p>Add new product with images & details</p>
            </Link>
            <Link to="/admin/banners" className="action-card">
              <div className="action-icon">🖼️</div>
              <h3>Banners & Slider</h3>
              <p>Manage homepage hero slider</p>
            </Link>
            <Link to="/admin/orders" className="action-card">
              <div className="action-icon">📋</div>
              <h3>Process Orders</h3>
              <p>Approve & update order status</p>
            </Link>
            <Link to="/admin/users" className="action-card">
              <div className="action-icon">✅</div>
              <h3>Approve Users</h3>
              <p>Review buyer registrations</p>
            </Link>
            <Link to="/admin/sections" className="action-card">
              <div className="action-icon">⚙️</div>
              <h3>Site Sections</h3>
              <p>Show/hide website sections</p>
            </Link>
            <Link to="/admin/payments" className="action-card">
              <div className="action-icon">💳</div>
              <h3>Payments</h3>
              <p>Record payments & ledger</p>
            </Link>
          </div>
        </div>

        <div className="recent-orders-card">
          <div className="recent-orders-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="no-data-inline">No orders yet</p>
          ) : (
            <div className="recent-orders-list">
              {recentOrders.map(order => (
                <Link key={order.id} to="/admin/orders" className="recent-order-item">
                  <div>
                    <strong>{order.id}</strong>
                    <span className="order-buyer">{order.buyerName || 'N/A'}</span>
                  </div>
                  <div className="order-meta">
                    <span>₹{order.total?.toLocaleString('en-IN') || '0'}</span>
                    <span className={`pill pill-small pill-${order.status === 'delivered' ? 'success' : 'info'}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
