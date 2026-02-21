import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getRecent7DaySeries(orders = []) {
  const points = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const start = d.getTime()
    const end = start + 86400000
    const dayOrders = orders.filter((o) => {
      const ts = o.createdAt || o.date || o.createdOn
      const time = ts ? new Date(ts).getTime() : NaN
      return Number.isFinite(time) && time >= start && time < end
    })
    points.push({
      label: DAY_LABELS[d.getDay()],
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
    })
  }
  return points
}

function toLinePath(values, width, height) {
  const max = Math.max(...values, 1)
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * width
      const y = height - (value / max) * height
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

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
  const [series, setSeries] = useState([])
  const [liveProducts, setLiveProducts] = useState([])
  const [lastSync, setLastSync] = useState(new Date())

  useEffect(() => {
    loadData()
    const onStorage = () => loadData()
    window.addEventListener('storage', onStorage)
    const timer = window.setInterval(() => loadData(), 5000)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.clearInterval(timer)
    }
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
    setLiveProducts(products.slice(0, 6))
    setSeries(getRecent7DaySeries(orders))
    setLastSync(new Date())
  }

  const formatRevenue = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
    return `₹${num.toLocaleString('en-IN')}`
  }

  const getStatusLabel = (status) => {
    const map = { received: 'Received', packed: 'Packed', 'partially-dispatched': 'Partially Dispatched', dispatched: 'Dispatched', delivered: 'Delivered' }
    return map[status] || status
  }

  const revenueValues = series.map((item) => item.revenue)
  const ordersValues = series.map((item) => item.orders)
  const linePath = toLinePath(revenueValues, 320, 120)
  const maxOrders = Math.max(...ordersValues, 1)

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
        <div>
          <div className="admin-graph-grid">
            <div className="admin-graph-card">
              <div className="graph-header">
                <h2>Revenue Trend (7 Days)</h2>
                <span>Live sync: {lastSync.toLocaleTimeString('en-IN')}</span>
              </div>
              <svg viewBox="0 0 320 120" className="revenue-line-chart" role="img" aria-label="Revenue trend chart">
                <defs>
                  <linearGradient id="revenueLine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#b7795f" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#b7795f" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                <path d={linePath} fill="none" stroke="#8f5f4f" strokeWidth="3" strokeLinecap="round" />
                {series.map((item, idx) => {
                  const x = (idx / (series.length - 1 || 1)) * 320
                  const y = 120 - ((item.revenue || 0) / Math.max(...revenueValues, 1)) * 120
                  return <circle key={item.label} cx={x} cy={y} r="3.5" fill="#8f5f4f" />
                })}
              </svg>
              <div className="graph-axis-labels">
                {series.map((item) => <span key={item.label}>{item.label}</span>)}
              </div>
            </div>
            <div className="admin-graph-card">
              <div className="graph-header">
                <h2>Orders Activity (7 Days)</h2>
              </div>
              <div className="order-bars">
                {series.map((item) => (
                  <div key={item.label} className="order-bar-item">
                    <div
                      className="order-bar"
                      style={{ height: `${Math.max(10, (item.orders / maxOrders) * 100)}%` }}
                      title={`${item.orders} orders`}
                    ></div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
              <Link to="/admin/collections" className="action-card">
                <div className="action-icon">🗂️</div>
                <h3>Collections</h3>
                <p>Manage home page collection cards</p>
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
              <Link to="/admin/payments" className="action-card">
                <div className="action-icon">💳</div>
                <h3>Payments</h3>
                <p>Record payments & ledger</p>
              </Link>
            </div>
          </div>

          <div className="admin-catalog-live">
            <div className="recent-orders-header">
              <h2>Live Product Preview</h2>
              <Link to="/admin/products">Manage products</Link>
            </div>
            {liveProducts.length === 0 ? (
              <p className="no-data-inline">No products found</p>
            ) : (
              <div className="dashboard-products-grid">
                {liveProducts.map((item) => (
                  <div key={item.id} className="dashboard-product-card">
                    <img src={item.images?.[0] || item.image} alt={item.name} />
                    <div className="dashboard-product-meta">
                      <h4>{item.name}</h4>
                      <p>{item.code} • {item.images?.length || 1} images</p>
                      <span>{(item.colors && item.colors.length) ? `${item.colors.length} colours` : 'No colours set'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
