import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import { useUsers } from '../../hooks/useData'
import './Admin.css'

const FALLBACK_USERS = [
  { id: '1', shopName: 'Rajput Traders', buyerName: 'Rajesh Kumar', mobile: '9876543210', city: 'Jaipur', businessType: 'Dealer', gst: '', status: 'approved', registeredDate: '2024-01-15' },
  { id: '2', shopName: 'New Shop', buyerName: 'New Buyer', mobile: '9876543211', city: 'Delhi', businessType: 'Shop', gst: '', status: 'pending', registeredDate: '2024-01-25' }
]

function AdminUsers() {
  const { showNotification } = useNotification()
  const { data: usersData, save: saveUsers } = useUsers()
  const [users, setUsers] = useState(FALLBACK_USERS)
  const [filterStatus, setFilterStatus] = useState('all')
  const [autoApprove, setAutoApprove] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('autoApprove') || 'false')
    } catch { return false }
  })

  useEffect(() => {
    setUsers(usersData?.length ? usersData : FALLBACK_USERS)
  }, [usersData])

  const handleApprove = async (userId) => {
    const updated = users.map(user =>
      user.id === userId ? { ...user, status: 'approved' } : user
    )
    await saveUsers(updated)
    showNotification('User approved successfully!', 'success')
  }

  const handleReject = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      const updated = users.map(user =>
        user.id === userId ? { ...user, status: 'rejected' } : user
      )
      await saveUsers(updated)
      showNotification('User rejected', 'success')
    }
  }

  const handleBlock = async (userId) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      const updated = users.map(user =>
        user.id === userId ? { ...user, status: 'blocked' } : user
      )
      await saveUsers(updated)
      showNotification('User blocked', 'success')
    }
  }

  const handleUnblock = async (userId) => {
    const updated = users.map(user =>
      user.id === userId ? { ...user, status: 'approved' } : user
    )
    await saveUsers(updated)
    showNotification('User unblocked', 'success')
  }

  const handleAutoApproveToggle = () => {
    const newValue = !autoApprove
    setAutoApprove(newValue)
    localStorage.setItem('autoApprove', JSON.stringify(newValue))
    showNotification(
      newValue ? 'Auto-approve enabled' : 'Auto-approve disabled',
      'success'
    )
  }

  const filteredUsers = users.filter(user => {
    if (filterStatus === 'all') return true
    return user.status === filterStatus
  })

  const getStatusBadgeClass = (status) => {
    const classes = {
      approved: 'status-approved',
      pending: 'status-pending',
      rejected: 'status-rejected',
      blocked: 'status-blocked'
    }
    return classes[status] || 'status-pending'
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>User Management</h1>
            <p>Approve, reject, and manage buyers</p>
          </div>
          <div className="auto-approve-toggle">
            <label>
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={handleAutoApproveToggle}
              />
              <span>Auto-approve new users</span>
            </label>
          </div>
        </div>

        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Users' },
            { key: 'pending', label: 'Pending Approval' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
            { key: 'blocked', label: 'Blocked' }
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

        <div className="users-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Buyer Name</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Business Type</th>
                <th>GST</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.shopName}</td>
                    <td>{user.buyerName}</td>
                    <td>{user.mobile}</td>
                    <td>{user.city}</td>
                    <td>{user.businessType}</td>
                    <td>{user.gst || '-'}</td>
                    <td>
                      <span className={`pill pill-${user.status === 'approved' ? 'success' : user.status === 'pending' ? 'warning' : user.status === 'rejected' || user.status === 'blocked' ? 'error' : 'neutral'}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(user.registeredDate).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className="action-buttons">
                        {user.status === 'pending' && (
                          <>
                            <button
                              className="btn-success small"
                              onClick={() => handleApprove(user.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-danger small"
                              onClick={() => handleReject(user.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {user.status === 'approved' && (
                          <button
                            className="btn-warning small"
                            onClick={() => handleBlock(user.id)}
                          >
                            Block
                          </button>
                        )}
                        {user.status === 'blocked' && (
                          <button
                            className="btn-success small"
                            onClick={() => handleUnblock(user.id)}
                          >
                            Unblock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <h3>{users.filter(u => u.status === 'pending').length}</h3>
            <p>Pending Approval</p>
          </div>
          <div className="stat-item">
            <h3>{users.filter(u => u.status === 'approved').length}</h3>
            <p>Approved Users</p>
          </div>
          <div className="stat-item">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
