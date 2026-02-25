import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import { useOrders, useLedger } from '../../hooks/useData'
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
  const { data: ordersData, save: saveOrders } = useOrders()
  const { data: ledgerData, save: saveLedger } = useLedger()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    setOrders(ordersData || [])
  }, [ordersData])

  const updateOrderStatus = async (orderId, newStatus, dispatchNote = '') => {
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
    await saveOrders(updated)
    setOrders(updated)
    showNotification('Order status updated successfully!', 'success')
    setSelectedOrder(null)
  }

  const recordPayment = async (orderId, amount, method) => {
    const order = orders.find(o => o.id === orderId)
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const adv = (o.advanceReceived || 0) + amount
        const bal = (o.total || 0) - adv
        let paymentStatus = 'pending'
        if (bal <= 0) paymentStatus = 'paid'
        else if (adv > 0) paymentStatus = 'advance_received'
        return {
          ...o,
          advanceReceived: adv,
          balancePending: Math.max(0, bal),
          paymentStatus,
          payments: [...(o.payments || []), { amount, method, date: new Date().toISOString().split('T')[0] }]
        }
      }
      return o
    })
    await saveOrders(updated)
    setOrders(updated)
    // Sync to ledger
    const ledger = ledgerData || []
    const lastBal = ledger.length ? ledger[ledger.length - 1].balance : 0
    const ledgerEntry = {
      id: 'TXN-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'payment',
      orderId,
      description: `Payment - ${method.toUpperCase()}`,
      amount,
      balance: lastBal - amount,
      paymentMethod: method
    }
    await saveLedger([...ledger, ledgerEntry])
    showNotification('Payment recorded!', 'success')
  }

  const updatePartialDispatch = async (orderId, itemIndex, dispatchedQty) => {
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
    await saveOrders(updated)
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

                <div className="order-payment-info">
                  <span>Total: ₹{order.total?.toLocaleString('en-IN') || '0'}</span>
                  {(order.advanceAmount || order.advanceReceived > 0) && (
                    <span>Advance: ₹{(order.advanceReceived || 0).toLocaleString('en-IN')} / ₹{(order.advanceAmount || order.total).toLocaleString('en-IN')}</span>
                  )}
                  {(order.balancePending > 0 || order.balancePending === 0) && (
                    <span className={order.balancePending === 0 ? 'paid' : 'pending'}>Balance: ₹{(order.balancePending || order.total).toLocaleString('en-IN')}</span>
                  )}
                </div>
                <div className="order-footer-admin">
                  <div className="order-total-admin">
                    <span>Total: ₹{order.total?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                  <div className="order-actions-admin">
                    <a
                      href={`https://wa.me/?text=Order ${order.id} - Total ₹${(order.total || 0).toLocaleString('en-IN')}. Payment: UPI/NEFT/Cash. We'll contact you.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary small"
                    >
                      WhatsApp
                    </a>
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
          onRecordPayment={recordPayment}
        />
      )}
    </div>
  )
}

function OrderStatusModal({ order, onClose, onUpdateStatus, onUpdatePartialDispatch, onRecordPayment }) {
  const [newStatus, setNewStatus] = useState(order.status)
  const [dispatchNote, setDispatchNote] = useState('')
  const [partialDispatch, setPartialDispatch] = useState({})
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi')

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
          {/* Payment Section - Phase 2: Advance / Phase 3: Partial */}
          <div className="order-payment-section">
            <h4>Payment (UPI / NEFT / Cash)</h4>
            <div className="payment-summary-inline">
              <span>Total: ₹{(order.total || 0).toLocaleString('en-IN')}</span>
              <span>Received: ₹{(order.advanceReceived || 0).toLocaleString('en-IN')}</span>
              <span className={order.balancePending === 0 ? 'paid' : ''}>Balance: ₹{(order.balancePending ?? order?.total ?? 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="record-payment-row">
              <input
                type="number"
                placeholder="Amount (₹)"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                min="0"
              />
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="upi">UPI</option>
                <option value="neft">NEFT</option>
                <option value="cash">Cash</option>
              </select>
              <button
                type="button"
                className="btn-success small"
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                onClick={() => {
                  const amt = parseFloat(paymentAmount)
                  if (amt > 0) {
                    onRecordPayment(order.id, amt, paymentMethod)
                    setPaymentAmount('')
                  }
                }}
              >
                Record Payment
              </button>
            </div>
          </div>

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
