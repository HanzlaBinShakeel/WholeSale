import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useLedger, useAdvancePercent } from '../../hooks/useData'
import './Admin.css'

function AdminPayments() {
  const { showNotification } = useNotification()
  const { data: ledgerData, save: saveLedger } = useLedger()
  const { data: advancePercentValue, save: saveAdvancePercent } = useAdvancePercent()
  const [advancePercent, setAdvancePercent] = useState(20)
  const [ledger, setLedger] = useState([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [paymentData, setPaymentData] = useState({
    orderId: '',
    amount: '',
    paymentMethod: 'cash',
    notes: ''
  })

  useEffect(() => {
    setLedger(ledgerData || [])
  }, [ledgerData])

  useEffect(() => {
    setAdvancePercent(advancePercentValue ?? 20)
  }, [advancePercentValue])

  const handleAddPayment = async (e) => {
    e.preventDefault()
    
    if (!paymentData.orderId || !paymentData.amount) {
      showNotification('Please fill all required fields', 'error')
      return
    }

    const methodLabel = { upi: 'UPI', neft: 'NEFT', cash: 'Cash', bank: 'NEFT', cheque: 'Cheque', other: 'Other' }[paymentData.paymentMethod] || paymentData.paymentMethod
    const newPayment = {
      id: 'TXN-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'payment',
      orderId: paymentData.orderId,
      description: `Payment received - ${methodLabel}`,
      amount: parseFloat(paymentData.amount),
      balance: 0, // Will be calculated
      notes: paymentData.notes,
      paymentMethod: paymentData.paymentMethod
    }

    // Calculate balance
    const currentBalance = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0
    newPayment.balance = currentBalance - newPayment.amount

    const updated = [...ledger, newPayment]
    await saveLedger(updated)
    showNotification('Payment added successfully!', 'success')
    setShowPaymentForm(false)
    setPaymentData({
      orderId: '',
      amount: '',
      paymentMethod: 'cash',
      notes: ''
    })
  }

  const handleAddAdjustment = async () => {
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
      await saveLedger(updated)
      showNotification('Adjustment added!', 'success')
    }
  }

  const handleEdit = (transaction, idx) => {
    setEditingEntry({
      idx,
      ...transaction
    })
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingEntry) return
    const { idx, id, date, type, orderId, description, amount, notes } = editingEntry
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount)) {
      showNotification('Invalid amount', 'error')
      return
    }

    const updated = [...ledger]
    updated[idx] = {
      id,
      date,
      type,
      orderId,
      description: description || (type === 'adjustment' ? 'Adjustment' : description),
      amount: parsedAmount,
      notes: notes || ''
    }

    // Recalculate balances from this point onward
    const prevBalance = idx > 0 ? updated[idx - 1].balance : 0
    let running = prevBalance
    for (let i = idx; i < updated.length; i++) {
      const t = updated[i]
      if (t.type === 'bill') running += Math.abs(t.amount)
      else if (t.type === 'payment') running -= Math.abs(t.amount)
      else running += t.amount
      updated[i] = { ...updated[i], balance: running }
    }

    await saveLedger(updated)
    showNotification('Entry updated!', 'success')
    setEditingEntry(null)
  }

  const handleDelete = async (idx) => {
    if (!window.confirm('Delete this entry? Balances will be recalculated.')) return
    const updated = ledger.filter((_, i) => i !== idx)

    // Recalculate all balances
    let running = 0
    const fixed = updated.map((t) => {
      if (t.type === 'bill') running += Math.abs(t.amount)
      else if (t.type === 'payment') running -= Math.abs(t.amount)
      else running += t.amount
      return { ...t, balance: running }
    })

    await saveLedger(fixed)
    showNotification('Entry deleted!', 'success')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleAdvancePercentBlur = async (val) => {
    const n = Math.max(0, Math.min(50, parseInt(val, 10) || 20))
    setAdvancePercent(n)
    await saveAdvancePercent(n)
    showNotification('Advance % updated', 'success')
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
            <p>Record UPI / NEFT / Cash payments. Ledger for credit & partial payments.</p>
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

        {/* Advance % Setting - Phase 2 */}
        <div className="advance-setting-card">
          <h3>Default Advance %</h3>
          <p>Used for new orders (e.g. 20-30% advance, balance on delivery)</p>
          <div className="advance-input-row">
            <input
              type="number"
              min="0"
              max="50"
              value={advancePercent}
              onChange={(e) => setAdvancePercent(parseInt(e.target.value) || 20)}
              onBlur={(e) => handleAdvancePercentBlur(e.target.value)}
            />
            <span>%</span>
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
                  <option value="upi">UPI</option>
                  <option value="neft">NEFT / Bank Transfer</option>
                  <option value="cash">Cash</option>
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

        {editingEntry && (
          <div className="admin-form-card">
            <div className="form-header">
              <h2>Edit Entry</h2>
              <button className="close-btn" onClick={() => setEditingEntry(null)}>×</button>
            </div>
            <form onSubmit={handleSaveEdit} className="admin-form">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={editingEntry.date}
                  onChange={(e) => setEditingEntry({ ...editingEntry, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select
                  value={editingEntry.type}
                  onChange={(e) => setEditingEntry({ ...editingEntry, type: e.target.value })}
                  required
                >
                  <option value="bill">Bill</option>
                  <option value="payment">Payment</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>
              <div className="form-group">
                <label>Order ID *</label>
                <input
                  type="text"
                  value={editingEntry.orderId}
                  onChange={(e) => setEditingEntry({ ...editingEntry, orderId: e.target.value })}
                  placeholder="ORD-2024-001"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={editingEntry.description || ''}
                  onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
                  placeholder="Description"
                />
              </div>
              <div className="form-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  value={editingEntry.amount}
                  onChange={(e) => setEditingEntry({ ...editingEntry, amount: e.target.value })}
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={editingEntry.notes || ''}
                  onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                  placeholder="Notes..."
                  rows="2"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditingEntry(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">
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
                        <td>
                          <div className="ledger-actions">
                            <button
                              type="button"
                              className="ledger-action-btn edit"
                              onClick={() => handleEdit(transaction, idx)}
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              type="button"
                              className="ledger-action-btn delete"
                              onClick={() => handleDelete(idx)}
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
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
