import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useOrders, useLedger } from '../../hooks/useData'
import { FiPackage, FiCreditCard } from 'react-icons/fi'
import './UserDashboard.css'

function UserDashboard() {
  const [orders, setOrders] = useState([])
  const [ledger, setLedger] = useState([])
  const [summary, setSummary] = useState({ totalBilled: 0, totalPaid: 0, pendingBalance: 0 })

  const { data: ordersData } = useOrders()
  const { data: ledgerData } = useLedger()

  useEffect(() => {
    setOrders(ordersData && Array.isArray(ordersData) ? ordersData : [])
  }, [ordersData])

  useEffect(() => {
    setLedger(ledgerData && Array.isArray(ledgerData) ? ledgerData : [])
  }, [ledgerData])

  useEffect(() => {
    const totalBilled = ledger.filter(t => t.type === 'bill').reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const totalPaid = ledger.filter(t => t.type === 'payment').reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const adjustments = ledger.filter(t => t.type === 'adjustment').reduce((sum, t) => sum + t.amount, 0)
    setSummary({
      totalBilled,
      totalPaid,
      pendingBalance: Math.max(0, totalBilled - totalPaid + adjustments)
    })
  }, [ledger])

  const pendingOrders = orders.filter(o => ['received', 'packed', 'partially-dispatched'].includes(o.status))

  return (
    <div className="user-dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your orders and payments</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/account/orders" className="dashboard-card">
          <div className="card-icon orders">
            <FiPackage />
          </div>
          <div className="card-content">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
            {pendingOrders.length > 0 && (
              <span className="card-badge">{pendingOrders.length} pending</span>
            )}
          </div>
        </Link>

        <Link to="/account/ledger" className="dashboard-card">
          <div className="card-icon ledger">
            <FiCreditCard />
          </div>
          <div className="card-content">
            <h3>₹{summary.pendingBalance.toLocaleString('en-IN')}</h3>
            <p>Pending Balance</p>
            <span className="card-meta">Billed: ₹{summary.totalBilled.toLocaleString('en-IN')} · Paid: ₹{summary.totalPaid.toLocaleString('en-IN')}</span>
          </div>
        </Link>
      </div>

      <div className="dashboard-quick-actions">
        <Link to="/account/orders" className="btn-primary">View My Orders</Link>
        <Link to="/account/ledger" className="btn-secondary">View Payment Ledger</Link>
        <Link to="/products" className="btn-secondary">Browse Products</Link>
      </div>
    </div>
  )
}

export default UserDashboard
