import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './Orders.css'

// Sample orders data with timeline
const sampleOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-20',
    status: 'partially-dispatched',
    items: [
      { name: 'Premium Saafa Set - Red', qty: 100, price: 450, dispatched: 100, pending: 0 },
      { name: 'Designer Odhna - Blue', qty: 50, price: 680, dispatched: 20, pending: 30 }
    ],
    total: 67600,
    notes: 'Please deliver before wedding season',
    timeline: [
      { status: 'received', date: '2024-01-20', time: '10:30 AM' },
      { status: 'packed', date: '2024-01-21', time: '02:15 PM' },
      { status: 'partially-dispatched', date: '2024-01-22', time: '11:00 AM', note: '100 pcs Saafa + 20 pcs Odhna dispatched' }
    ]
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-18',
    status: 'dispatched',
    items: [
      { name: 'Royal Rajputi Suit', qty: 30, price: 1200, dispatched: 30, pending: 0 }
    ],
    total: 36000,
    timeline: [
      { status: 'received', date: '2024-01-18', time: '09:00 AM' },
      { status: 'packed', date: '2024-01-19', time: '03:00 PM' },
      { status: 'dispatched', date: '2024-01-20', time: '10:00 AM' }
    ]
  }
]

const statusOrder = {
  'received': 1,
  'packed': 2,
  'partially-dispatched': 3,
  'dispatched': 4,
  'delivered': 5
}

function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    // Load orders from localStorage or use sample
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders)
        setOrders(parsed.length > 0 ? parsed : sampleOrders)
      } catch (e) {
        setOrders(sampleOrders)
      }
    } else {
      setOrders(sampleOrders)
    }
  }, [])

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return ['received', 'packed'].includes(order.status)
    if (activeTab === 'dispatched') return ['dispatched', 'partially-dispatched'].includes(order.status)
    if (activeTab === 'delivered') return order.status === 'delivered'
    return true
  })

  const downloadInvoice = (order) => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('MKT Wholesale', 105, 20, { align: 'center' })
    doc.setFontSize(14)
    doc.text('Invoice', 105, 30, { align: 'center' })
    
    // Order Details
    doc.setFontSize(10)
    doc.text(`Order ID: ${order.id}`, 20, 45)
    doc.text(`Date: ${new Date(order.date).toLocaleDateString('en-IN')}`, 20, 52)
    doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 20, 59)
    
    // Table
    const tableData = order.items.map(item => [
      item.name,
      item.qty,
      `₹${item.price}`,
      `₹${item.qty * item.price}`
    ])
    
    doc.autoTable({
      startY: 70,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [30, 64, 175] }
    })
    
    // Total
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(12)
    doc.text(`Total Amount: ₹${order.total.toLocaleString('en-IN')}`, 20, finalY)
    
    doc.save(`Invoice-${order.id}.pdf`)
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track your wholesale orders and delivery status</p>
        </div>

        <div className="order-tabs">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'pending', label: 'Pending' },
            { key: 'dispatched', label: 'Dispatched' },
            { key: 'delivered', label: 'Delivered' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="orders-list">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={() => setSelectedOrder(order)}
              onDownloadInvoice={() => downloadInvoice(order)}
            />
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <p>No orders found</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDownloadInvoice={() => downloadInvoice(selectedOrder)}
        />
      )}
    </div>
  )
}

function OrderCard({ order, onViewDetails, onDownloadInvoice }) {
  const statusClass = {
    received: 'received',
    packed: 'packed',
    'partially-dispatched': 'partially-dispatched',
    dispatched: 'dispatched',
    delivered: 'delivered'
  }[order.status] || 'received'

  const statusLabel = {
    'received': 'Order Received',
    'packed': 'Packed',
    'partially-dispatched': 'Partially Dispatched',
    'dispatched': 'Dispatched',
    'delivered': 'Delivered'
  }[order.status] || order.status

  const hasPartialDispatch = order.items.some(item => item.pending > 0)

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <h3>{order.id}</h3>
          <p className="order-date">
            Placed on: {new Date(order.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
        <span className={`pill pill-${statusClass === 'delivered' ? 'success' : statusClass === 'received' || statusClass === 'packed' ? 'info' : statusClass === 'partially-dispatched' ? 'warning' : 'neutral'}`}>
          {statusLabel}
        </span>
      </div>

      <div className="order-items">
        {order.items.map((item, idx) => (
          <div key={idx} className="order-item-summary">
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-qty">{item.qty} pcs × ₹{item.price}</span>
            </div>
            {hasPartialDispatch && (
              <div className="item-dispatch-info">
                <span className="pill pill-success">Dispatched: {item.dispatched}</span>
                {item.pending > 0 && (
                  <span className="pill pill-warning">Pending: {item.pending}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="order-notes">
          <strong>Notes:</strong> {order.notes}
        </div>
      )}

      <div className="order-footer">
        <div className="order-total">
          <span>Total:</span>
          <span>₹{order.total.toLocaleString('en-IN')}</span>
        </div>
        <div className="order-actions">
          <button className="btn-secondary small" onClick={onViewDetails}>
            View Details
          </button>
          <button className="btn-primary small" onClick={onDownloadInvoice}>
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

function OrderDetailsModal({ order, onClose, onDownloadInvoice }) {
  const currentStatusIndex = statusOrder[order.status] || 1
  const statusSteps = [
    { key: 'received', label: 'Order Received', icon: '📥' },
    { key: 'packed', label: 'Packed', icon: '📦' },
    { key: 'partially-dispatched', label: 'Partially Dispatched', icon: '🚚' },
    { key: 'dispatched', label: 'Dispatched', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details - {order.id}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Status Timeline */}
          <div className="order-timeline">
            <h3>Order Status Timeline</h3>
            <div className="timeline-container">
              {order.timeline && order.timeline.map((step, idx) => {
                const stepIndex = statusOrder[step.status] || idx + 1
                const isActive = stepIndex <= currentStatusIndex
                const isLast = idx === order.timeline.length - 1

                return (
                  <div key={idx} className={`timeline-step ${isActive ? 'active' : ''} ${isLast ? 'last' : ''}`}>
                    <div className="timeline-icon">{statusSteps.find(s => s.key === step.status)?.icon || '📌'}</div>
                    <div className="timeline-content">
                      <h4>{statusSteps.find(s => s.key === step.status)?.label || step.status}</h4>
                      <p>{step.date} at {step.time}</p>
                      {step.note && <p className="timeline-note">{step.note}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-detail">
            <h3>Order Items</h3>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  {order.items.some(item => item.dispatched !== undefined) && (
                    <>
                      <th>Dispatched</th>
                      <th>Pending</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.qty} pcs</td>
                    <td>₹{item.price}</td>
                    <td>₹{(item.qty * item.price).toLocaleString('en-IN')}</td>
                    {item.dispatched !== undefined && (
                      <>
                        <td>{item.dispatched} pcs</td>
                        <td>{item.pending || 0} pcs</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="order-summary-detail">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {order.notes && (
            <div className="order-notes-detail">
              <h4>Order Notes:</h4>
              <p>{order.notes}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={onDownloadInvoice}>
            Download Invoice PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default Orders
