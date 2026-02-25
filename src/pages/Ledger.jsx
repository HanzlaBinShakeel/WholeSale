import React, { useState, useEffect } from 'react'
import { useLedger } from '../hooks/useData'
import './Ledger.css'

// Sample ledger data
const sampleLedger = [
  {
    id: 'TXN-001',
    date: '2024-01-20',
    type: 'bill',
    orderId: 'ORD-2024-001',
    description: 'Premium Saafa Set, Designer Odhna',
    amount: 36100,
    balance: 36100
  },
  {
    id: 'TXN-002',
    date: '2024-01-22',
    type: 'payment',
    orderId: 'ORD-2024-001',
    description: 'Partial payment received',
    amount: 20000,
    balance: 16100,
    notes: 'Cash payment'
  },
  {
    id: 'TXN-003',
    date: '2024-01-18',
    type: 'bill',
    orderId: 'ORD-2024-002',
    description: 'Royal Rajputi Suit',
    amount: 36000,
    balance: 52100
  },
  {
    id: 'TXN-004',
    date: '2024-01-19',
    type: 'payment',
    orderId: 'ORD-2024-002',
    description: 'Full payment received',
    amount: 36000,
    balance: 16100,
    notes: 'Bank transfer'
  },
  {
    id: 'TXN-005',
    date: '2024-01-25',
    type: 'adjustment',
    orderId: 'ORD-2024-001',
    description: 'Discount adjustment',
    amount: -1000,
    balance: 15100,
    notes: 'Early payment discount'
  }
]

function Ledger() {
  const [ledger, setLedger] = useState([])
  const [summary, setSummary] = useState({
    totalBilled: 0,
    totalPaid: 0,
    pendingBalance: 0
  })

  const { data: ledgerData } = useLedger()

  useEffect(() => {
    setLedger(ledgerData?.length ? ledgerData : sampleLedger)
  }, [ledgerData])

  useEffect(() => {
    // Calculate summary
    const totalBilled = ledger
      .filter(t => t.type === 'bill')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const totalPaid = ledger
      .filter(t => t.type === 'payment')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const adjustments = ledger
      .filter(t => t.type === 'adjustment')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const pendingBalance = totalBilled - totalPaid + adjustments
    
    setSummary({
      totalBilled,
      totalPaid,
      pendingBalance: Math.max(0, pendingBalance)
    })
  }, [ledger])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getTypeLabel = (type) => {
    const labels = {
      bill: 'Bill',
      payment: 'Payment',
      adjustment: 'Adjustment'
    }
    return labels[type] || type
  }

  const getTypeClass = (type) => {
    return `ledger-type-${type}`
  }

  return (
    <div className="ledger-page">
      <div className="container">
        <div className="page-header">
          <h1>Payment Ledger</h1>
          <p>Track all your bills, payments, and outstanding balance</p>
        </div>

        {/* Summary Cards */}
        <div className="ledger-summary-cards">
          <div className="summary-card total-billed">
            <div className="summary-icon">📄</div>
            <div className="summary-content">
              <h3>₹{summary.totalBilled.toLocaleString('en-IN')}</h3>
              <p>Total Billed</p>
            </div>
          </div>
          
          <div className="summary-card total-paid">
            <div className="summary-icon">✅</div>
            <div className="summary-content">
              <h3>₹{summary.totalPaid.toLocaleString('en-IN')}</h3>
              <p>Total Paid</p>
            </div>
          </div>
          
          <div className="summary-card pending">
            <div className="summary-icon">⏳</div>
            <div className="summary-content">
              <h3>₹{summary.pendingBalance.toLocaleString('en-IN')}</h3>
              <p>Pending Balance</p>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="ledger-table-container">
          <div className="table-header">
            <h2>Transaction History</h2>
            <div className="table-filters">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Bills</button>
              <button className="filter-btn">Payments</button>
            </div>
          </div>

          <div className="ledger-table-wrapper">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Order/Reference</th>
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
                    const isAdjustment = transaction.type === 'adjustment'
                    
                    return (
                      <tr key={transaction.id || idx} className="ledger-row">
                        <td>{formatDate(transaction.date)}</td>
                        <td>
                          <span className={`pill pill-${transaction.type === 'bill' ? 'info' : transaction.type === 'payment' ? 'success' : 'warning'}`}>
                            {getTypeLabel(transaction.type)}
                          </span>
                        </td>
                        <td>
                          <a href={`/orders`} className="order-link">
                            {transaction.orderId}
                          </a>
                        </td>
                        <td>{transaction.description}</td>
                        <td className={`amount ${isDebit ? 'debit' : isCredit ? 'credit' : 'adjustment'}`}>
                          {isDebit ? '-' : isCredit ? '+' : ''}
                          ₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="balance">
                          ₹{transaction.balance.toLocaleString('en-IN')}
                        </td>
                        <td className="notes">
                          {transaction.notes || '-'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Info */}
        <div className="payment-info-card">
          <h3>Payment Information</h3>
          <div className="payment-details">
            <div className="payment-item">
              <strong>Payment Methods:</strong>
              <span>Cash, Bank Transfer, UPI</span>
            </div>
            <div className="payment-item">
              <strong>Credit Terms:</strong>
              <span>As per agreement with admin</span>
            </div>
            <div className="payment-item">
              <strong>Contact:</strong>
              <span>Contact admin for payment updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ledger
