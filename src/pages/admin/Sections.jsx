import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import './Admin.css'

const SECTIONS_KEY = 'adminSections'

const DEFAULT_SECTIONS = {
  heroSlider: true,
  topBanner: true,
  categories: true,
  deals: true,
  newArrivals: true,
  featured: true,
  wholesaleNotice: true
}

function AdminSections() {
  const { showNotification } = useNotification()
  const [sections, setSections] = useState(DEFAULT_SECTIONS)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SECTIONS_KEY)
      if (saved) setSections({ ...DEFAULT_SECTIONS, ...JSON.parse(saved) })
    } catch (e) {}
  }, [])

  const toggle = (key) => {
    const updated = { ...sections, [key]: !sections[key] }
    setSections(updated)
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(updated))
    showNotification('Section updated', 'success')
  }

  const sectionList = [
    { key: 'heroSlider', label: 'Hero Slider', desc: 'Main carousel on homepage' },
    { key: 'topBanner', label: 'Top Promo Banner', desc: 'Above navbar announcement bar' },
    { key: 'categories', label: 'Collection List', desc: 'Home page collection cards section' },
    { key: 'deals', label: 'Deals Section', desc: 'Special offers block' },
    { key: 'newArrivals', label: 'New Arrivals', desc: 'Latest products grid' },
    { key: 'featured', label: 'Featured Products', desc: 'Highlighted products' },
    { key: 'wholesaleNotice', label: 'Wholesale Notice', desc: 'B2B info block' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Site Sections</h1>
          <p>Show or hide sections on the storefront</p>
        </div>
      </div>

      <div className="sections-list-admin">
        {sectionList.map(({ key, label, desc }) => (
          <div key={key} className="section-toggle-card">
            <div className="section-toggle-info">
              <h3>{label}</h3>
              <p>{desc}</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={!!sections[key]}
                onChange={() => toggle(key)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminSections
