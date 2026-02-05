import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import './Admin.css'

function AdminPayments() {
  const { showNotification } = useNotification()
  const [ledger, setLedger] = useState([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentData, setPaymentData] = useState({
    orderId: '',
    amount: '',
    paymentMethod: 'cash',
    notes: ''
  })

  useEffect(() => {
    loadLedger()
  }, [])

  const loadLedger = () => {
    const saved = localStorage.getItem('ledger')
    if (saved) {
      try {
        setLedger(JSON.parse(saved))
      } catch (e) {
        setLedger([])
      }
    }
  }

  const saveLedger = (updatedLedger) => {
    localStorage.setItem('ledger', JSON.stringify(updatedLedger))
    setLedger(updatedLedger)
  }

  const handleAddPayment = (e) => {
    e.preventDefault()
    
    if (!paymentData.orderId || !paymentData.amount) {
      showNotification('Please fill all required fields', 'error')
      return
    }

    const newPayment = {
      id: 'TXN-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'payment',
      orderId: paymentData.orderId,
      description: `Payment received - ${paymentData.paymentMethod}`,
      amount: parseFloat(paymentData.amount),
      balance: 0, // Will be calculated
      notes: paymentData.notes,
      paymentMethod: paymentData.paymentMethod
    }

    // Calculate balance
    const currentBalance = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0
    newPayment.balance = currentBalance - newPayment.amount

    const updated = [...ledger, newPayment]
    saveLedger(updated)
    showNotification('Payment added successfully!', 'success')
    setShowPaymentForm(false)
    setPaymentData({
      orderId: '',
      amount: '',
      paymentMethod: 'cash',
      notes: ''
    })
  }

  const handleAddAdjustment = () => {
    const orderId = prompt('Enter Order ID:')
    const amount = prompt('Enter adjustment amount (negative for discount):')
    const notes = prompt('Enter notes:')

    if (orderId && amount) {
      const adjustment = {
        id: 'TXN-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: 'adjustment',
        orderId: orderId,
        description: 'Adjustment',
        amount: parseFloat(amount),
        balance: 0,
        notes: notes || ''
      }

      const currentBalance = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0
      adjustment.balance = currentBalance + adjustment.amount

      const updated = [...ledger, adjustment]
      saveLedger(updated)
      showNotification('Adjustment added!', 'success')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const summary = {
    totalBilled: ledger.filter(t => t.type === 'bill').reduce((sum, t) => sum + Math.abs(t.amount), 0),
    totalPaid: ledger.filter(t => t.type === 'payment').reduce((sum, t) => sum + Math.abs(t.amount), 0),
    adjustments: ledger.filter(t => t.type === 'adjustment').reduce((sum, t) => sum + t.amount, 0)
  }
  summary.pendingBalance = summary.totalBilled - summary.totalPaid + summary.adjustments

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Payment Management</h1>
            <p>Manage payments, bills, and ledger entries</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={handleAddAdjustment}>
              Add Adjustment
            </button>
            <button className="btn-primary" onClick={() => setShowPaymentForm(true)}>
              + Add Payment
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="payment-summary-cards">
          <div className="summary-card">
            <h3>₹{summary.totalBilled.toLocaleString('en-IN')}</h3>
            <p>Total Billed</p>
          </div>
          <div className="summary-card">
            <h3>₹{summary.totalPaid.toLocaleString('en-IN')}</h3>
            <p>Total Paid</p>
          </div>
          <div className="summary-card">
            <h3>₹{summary.pendingBalance.toLocaleString('en-IN')}</h3>
            <p>Pending Balance</p>
          </div>
        </div>

        {showPaymentForm && (
          <div className="admin-form-card">
            <div className="form-header">
              <h2>Add Payment</h2>
              <button className="close-btn" onClick={() => setShowPaymentForm(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddPayment} className="admin-form">
              <div className="form-group">
                <label>Order ID *</label>
                <input
                  type="text"
                  value={paymentData.orderId}
                  onChange={(e) => setPaymentData({ ...paymentData, orderId: e.target.value })}
                  placeholder="ORD-2024-001"
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  placeholder="Payment notes or reference number..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowPaymentForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ledger Table */}
        <div className="ledger-table-container">
          <h2>Payment Ledger</h2>
          <div className="ledger-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Order ID</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Balance</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  ledger.map((transaction, idx) => {
                    const isDebit = transaction.type === 'bill'
                    const isCredit = transaction.type === 'payment'
                    
                    return (
                      <tr key={transaction.id || idx}>
                        <td>{formatDate(transaction.date)}</td>
                        <td>
                          <span className={`type-badge ledger-type-${transaction.type}`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                        <td>{transaction.orderId}</td>
                        <td>{transaction.description}</td>
                        <td className={`amount ${isDebit ? 'debit' : isCredit ? 'credit' : 'adjustment'}`}>
                          {isDebit ? '-' : isCredit ? '+' : ''}
                          ₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                        </td>
                        <td>₹{transaction.balance.toLocaleString('en-IN')}</td>
                        <td>{transaction.notes || '-'}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPayments
