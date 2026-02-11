import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import './Admin.css'

const statusOptions = [
  { value: 'received', label: 'Order Received' },
  { value: 'packed', label: 'Packed' },
  { value: 'partially-dispatched', label: 'Partially Dispatched' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' }
]

function AdminOrders() {
  const { showNotification } = useNotification()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const saved = localStorage.getItem('orders')
    if (saved) {
      try {
        setOrders(JSON.parse(saved))
      } catch (e) {
        setOrders([])
      }
    }
  }

  const updateOrderStatus = (orderId, newStatus, dispatchNote = '') => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        const updatedTimeline = order.timeline || []
        updatedTimeline.push({
          status: newStatus,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          note: dispatchNote
        })
        return {
          ...order,
          status: newStatus,
          timeline: updatedTimeline
        }
      }
      return order
    })
    localStorage.setItem('orders', JSON.stringify(updated))
    setOrders(updated)
    showNotification('Order status updated successfully!', 'success')
    setSelectedOrder(null)
  }

  const updatePartialDispatch = (orderId, itemIndex, dispatchedQty) => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = [...order.items]
        if (updatedItems[itemIndex]) {
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            dispatched: dispatchedQty,
            pending: updatedItems[itemIndex].qty - dispatchedQty
          }
        }
        return {
          ...order,
          items: updatedItems,
          status: updatedItems.some(item => item.pending > 0) ? 'partially-dispatched' : 'dispatched'
        }
      }
      return order
    })
    localStorage.setItem('orders', JSON.stringify(updated))
    setOrders(updated)
    showNotification('Partial dispatch updated!', 'success')
  }

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true
    return order.status === filterStatus
  })

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Order Management</h1>
            <p>Update order statuses and manage dispatches</p>
          </div>
        </div>

        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'received', label: 'Received' },
            { key: 'packed', label: 'Packed' },
            { key: 'partially-dispatched', label: 'Partially Dispatched' },
            { key: 'dispatched', label: 'Dispatched' },
            { key: 'delivered', label: 'Delivered' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${filterStatus === tab.key ? 'active' : ''}`}
              onClick={() => setFilterStatus(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="orders-list-admin">
          {filteredOrders.length === 0 ? (
            <div className="no-data">
              <p>No orders found</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="order-card-admin">
                <div className="order-header-admin">
                  <div>
                    <h3>{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="buyer-info">Buyer: {order.buyerName || 'N/A'}</p>
                  </div>
                  <span className={`pill pill-${order.status === 'delivered' ? 'success' : order.status === 'received' || order.status === 'packed' ? 'info' : order.status === 'partially-dispatched' ? 'warning' : 'neutral'}`}>
                    {statusOptions.find(s => s.value === order.status)?.label || order.status}
                  </span>
                </div>

                <div className="order-items-admin">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item-admin">
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">{item.qty} pcs × ₹{item.price}</span>
                      </div>
                      {item.dispatched !== undefined && (
                        <div className="dispatch-info">
                          <span>Dispatched: {item.dispatched} pcs</span>
                          {item.pending > 0 && <span className="pending">Pending: {item.pending} pcs</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="order-footer-admin">
                  <div className="order-total-admin">
                    <span>Total: ₹{order.total?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                  <div className="order-actions-admin">
                    {order.status === 'received' && (
                      <button
                        className="btn-success small"
                        onClick={() => updateOrderStatus(order.id, 'packed', 'Order approved')}
                      >
                        Approve Order
                      </button>
                    )}
                    <button
                      className="btn-primary small"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          onUpdatePartialDispatch={updatePartialDispatch}
        />
      )}
    </div>
  )
}

function OrderStatusModal({ order, onClose, onUpdateStatus, onUpdatePartialDispatch }) {
  const [newStatus, setNewStatus] = useState(order.status)
  const [dispatchNote, setDispatchNote] = useState('')
  const [partialDispatch, setPartialDispatch] = useState({})

  const handleStatusUpdate = () => {
    if (newStatus === 'partially-dispatched') {
      // Handle partial dispatch for each item
      Object.keys(partialDispatch).forEach(itemIndex => {
        const qty = parseInt(partialDispatch[itemIndex])
        if (qty > 0 && qty <= order.items[itemIndex].qty) {
          onUpdatePartialDispatch(order.id, parseInt(itemIndex), qty)
        }
      })
    }
    onUpdateStatus(order.id, newStatus, dispatchNote)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Order Status - {order.id}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Current Status</label>
            <div className="current-status">{order.status}</div>
          </div>

          <div className="form-group">
            <label>Update Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="form-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {newStatus === 'partially-dispatched' && (
            <div className="partial-dispatch-section">
              <h4>Partial Dispatch Details</h4>
              {order.items?.map((item, idx) => (
                <div key={idx} className="partial-dispatch-item">
                  <label>{item.name} (Total: {item.qty} pcs)</label>
                  <input
                    type="number"
                    min="0"
                    max={item.qty}
                    placeholder="Dispatched qty"
                    value={partialDispatch[idx] || ''}
                    onChange={(e) => setPartialDispatch({
                      ...partialDispatch,
                      [idx]: e.target.value
                    })}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={dispatchNote}
              onChange={(e) => setDispatchNote(e.target.value)}
              placeholder="Add any notes about this status update..."
              rows="3"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleStatusUpdate}>
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
