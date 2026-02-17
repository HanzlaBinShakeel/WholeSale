import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import './Admin.css'

const SETTINGS_KEY = 'adminSettings'

const DEFAULT = {
  storeName: 'MKT Wholesale',
  heroTitle: 'Premium Traditional Textiles',
  heroSubtitle: 'Saafa, Odhna & Rajputi — curated for wedding seasons and festivals. Bulk orders with guaranteed quality.',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  whatsappNumber: '',
  aboutText: ''
}

function AdminSettings() {
  const { showNotification } = useNotification()
  const [settings, setSettings] = useState(DEFAULT)

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
      if (Object.keys(s).length) setSettings(prev => ({ ...prev, ...s }))
    } catch (e) {}
  }, [])

  const save = (e) => {
    e.preventDefault()
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    showNotification('Settings saved!', 'success')
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Store Settings (CMS)</h1>
          <p>Manage store name, hero text, contact info & content</p>
        </div>
      </div>

      <form onSubmit={save} className="admin-form-card">
        <h2>General</h2>
        <div className="form-group">
          <label>Store Name</label>
          <input
            type="text"
            value={settings.storeName}
            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
            placeholder="MKT Wholesale"
          />
        </div>

        <h2>Hero Section</h2>
        <div className="form-group">
          <label>Hero Title</label>
          <input
            type="text"
            value={settings.heroTitle}
            onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
            placeholder="Premium Traditional Textiles"
          />
        </div>
        <div className="form-group">
          <label>Hero Subtitle</label>
          <textarea
            value={settings.heroSubtitle}
            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
            placeholder="Description..."
            rows="3"
          />
        </div>

        <h2>Contact</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              placeholder="+91 ..."
            />
          </div>
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input
              type="tel"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              placeholder="919876543210"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              placeholder="hello@store.com"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            value={settings.contactAddress}
            onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
            placeholder="Full address"
            rows="2"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Save Settings</button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings
