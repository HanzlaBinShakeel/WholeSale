import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeBuyers: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    // Load real data from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const pendingOrders = orders.filter(o => ['received', 'packed'].includes(o.status)).length
    const pendingApprovals = users.filter(u => u.status === 'pending').length
    const approvedUsers = users.filter(u => u.status === 'approved').length

    setStats({
      totalOrders: orders.length,
      activeBuyers: approvedUsers,
      totalRevenue,
      pendingApprovals,
      pendingOrders
    })
  }, [])

  const formatRevenue = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
    return `₹${num.toLocaleString('en-IN')}`
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your wholesale business</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
              {stats.pendingOrders > 0 && (
                <span className="stat-change warning">{stats.pendingOrders} pending</span>
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
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatRevenue(stats.totalRevenue)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.pendingApprovals}</h3>
              <p>Pending Approvals</p>
              {stats.pendingApprovals > 0 && (
                <span className="stat-change warning">Requires attention</span>
              )}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Add Product</h3>
              <p>Add new product to catalogue</p>
            </Link>
            <Link to="/admin/users" className="action-card">
              <div className="action-icon">✅</div>
              <h3>Approve Users</h3>
              <p>Review pending registrations</p>
            </Link>
            <Link to="/admin/orders" className="action-card">
              <div className="action-icon">📋</div>
              <h3>Process Orders</h3>
              <p>Update order statuses</p>
            </Link>
            <Link to="/admin/payments" className="action-card">
              <div className="action-icon">💳</div>
              <h3>Update Payments</h3>
              <p>Record payments & ledger</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
