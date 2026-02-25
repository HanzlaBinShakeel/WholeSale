import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import { useSettings } from '../../hooks/useData'
import { useSupabase } from '../../lib/supabase'
import { seedSupabase } from '../../services/seedSupabase'
import './Admin.css'

const DEFAULT = {
  storeName: 'MKT Wholesale',
  heroTitle: 'Premium Traditional Textiles',
  heroSubtitle: 'Saafa, Odhna & Rajputi — curated for wedding seasons and festivals. Bulk orders with guaranteed quality.',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  whatsappNumber: '',
  aboutText: '',
  ourStoryTitle: 'Our Story',
  ourStorySubtitle: 'WHOLESALE TRADITIONAL TEXTILES',
  ourStoryHeadline: 'Where Heritage Meets Wholesale',
  ourStoryBody: 'MKT Wholesale brings you Saafa, Odhna, Rajputi suits and traditional ethnic wear—curated for wedding seasons and festivals. We work directly with artisans who hand-block print, weave and dye each piece with generations of skill. From Bandhej to Sanganeri, every fabric carries culture and craftsmanship. We serve retailers and bulk buyers who value quality, authenticity and fair pricing. Your store deserves the best—we make sure you get it.',
  ourStoryTagline: 'पारंपरिक कपड़े, बेहतरीन सौदा | Traditional textiles, best deal for your store.',
  ourStorySocial: '@mktwholesale'
}

function AdminSettings() {
  const { showNotification } = useNotification()
  const { data: settingsData, save: saveSettings } = useSettings()
  const hasSupabase = useSupabase()
  const [settings, setSettings] = useState(DEFAULT)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    if (settingsData && Object.keys(settingsData).length) setSettings(prev => ({ ...prev, ...settingsData }))
  }, [settingsData])

  const save = async (e) => {
    e.preventDefault()
    await saveSettings(settings)
    showNotification('Settings saved!', 'success')
  }

  const handleSeed = async () => {
    if (!hasSupabase) {
      showNotification('Supabase not configured', 'error')
      return
    }
    if (!window.confirm('Seed database with default products, collections, users, orders? This will add/update data.')) return
    setSeeding(true)
    try {
      const r = await seedSupabase()
      showNotification(`Seeded: ${r.products} products, ${r.collections} collections, ${r.users} users, ${r.orders} orders`, 'success')
    } catch (e) {
      showNotification('Seed failed: ' + (e.message || 'Unknown error'), 'error')
    } finally {
      setSeeding(false)
    }
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
            <span className="form-hint-inline">Used for footer WhatsApp icon — users can tap to chat</span>
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

        <h2>Our Story (RANGIKA-style section)</h2>
        <p className="form-hint">Earthy brand narrative section with shapes — editable content</p>
        <div className="form-group">
          <label>Our Story Subtitle (small caps)</label>
          <input
            type="text"
            value={settings.ourStorySubtitle}
            onChange={(e) => setSettings({ ...settings, ourStorySubtitle: e.target.value })}
            placeholder="THREADS OF CULTURE AND CRAFT"
          />
        </div>
        <div className="form-group">
          <label>Our Story Headline</label>
          <input
            type="text"
            value={settings.ourStoryHeadline}
            onChange={(e) => setSettings({ ...settings, ourStoryHeadline: e.target.value })}
            placeholder="Where Artisanship Shapes Every Piece"
          />
        </div>
        <div className="form-group">
          <label>Our Story Body</label>
          <textarea
            value={settings.ourStoryBody}
            onChange={(e) => setSettings({ ...settings, ourStoryBody: e.target.value })}
            placeholder="Brand story paragraphs..."
            rows="5"
          />
        </div>
        <div className="form-group">
          <label>Tagline / Slogan</label>
          <input
            type="text"
            value={settings.ourStoryTagline}
            onChange={(e) => setSettings({ ...settings, ourStoryTagline: e.target.value })}
            placeholder="हर रंग बोले कहानी"
          />
        </div>
        <div className="form-group">
          <label>Social Handle</label>
          <input
            type="text"
            value={settings.ourStorySocial}
            onChange={(e) => setSettings({ ...settings, ourStorySocial: e.target.value })}
            placeholder="@yourstore"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Save Settings</button>
          {hasSupabase && (
            <button type="button" className="btn-secondary" onClick={handleSeed} disabled={seeding}>
              {seeding ? 'Seeding...' : 'Seed Database'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AdminSettings
