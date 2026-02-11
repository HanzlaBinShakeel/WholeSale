import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import './Admin.css'

const BANNERS_KEY = 'adminBanners'

function AdminBanners() {
  const { showNotification } = useNotification()
  const [banners, setBanners] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    image: '',
    imageFile: null,
    title: '',
    subtitle: '',
    link: '',
    order: 0
  })

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = () => {
    try {
      const saved = localStorage.getItem(BANNERS_KEY)
      setBanners(saved ? JSON.parse(saved) : [])
    } catch (e) {
      setBanners([])
    }
  }

  const saveBanners = (data) => {
    localStorage.setItem(BANNERS_KEY, JSON.stringify(data))
    setBanners(data)
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result, imageFile: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.image && !formData.title) {
      showNotification('Add at least an image or title', 'error')
      return
    }
    const banner = {
      id: editingBanner?.id || Date.now(),
      image: formData.image || '',
      title: formData.title || '',
      subtitle: formData.subtitle || '',
      link: formData.link || '#',
      order: Number(formData.order) || 0
    }
    if (editingBanner) {
      const updated = banners.map(b => b.id === editingBanner.id ? banner : b)
      saveBanners(updated)
      showNotification('Banner updated!', 'success')
    } else {
      saveBanners([...banners, banner].sort((a, b) => a.order - b.order))
      showNotification('Banner added!', 'success')
    }
    resetForm()
  }

  const handleEdit = (b) => {
    setEditingBanner(b)
    setFormData({
      image: b.image || '',
      imageFile: null,
      title: b.title || '',
      subtitle: b.subtitle || '',
      link: b.link || '',
      order: b.order || 0
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this banner?')) {
      saveBanners(banners.filter(b => b.id !== id))
      showNotification('Banner deleted', 'success')
    }
  }

  const resetForm = () => {
    setFormData({ image: '', imageFile: null, title: '', subtitle: '', link: '', order: 0 })
    setEditingBanner(null)
    setShowForm(false)
  }

  const sortedBanners = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Banners & Slider</h1>
          <p>Manage homepage hero slider and promotional banners</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Banner
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <div className="form-header">
            <h2>{editingBanner ? 'Edit Banner' : 'Add Banner'}</h2>
            <button className="close-btn" onClick={resetForm}>×</button>
          </div>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Image * (upload or URL)</label>
              <div className="image-upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="banner-image-input"
                  className="image-input"
                />
                {formData.image ? (
                  <div className="image-preview-large">
                    <img src={formData.image} alt="Preview" />
                  </div>
                ) : (
                  <label htmlFor="banner-image-input" className="upload-placeholder">
                    Click to upload image
                  </label>
                )}
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Banner title"
                />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Subtitle text"
                />
              </div>
              <div className="form-group">
                <label>Link URL</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/products or https://..."
                />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  min="0"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
              <button type="submit" className="btn-primary">{editingBanner ? 'Update' : 'Add'} Banner</button>
            </div>
          </form>
        </div>
      )}

      <div className="banners-grid-admin">
        {sortedBanners.length === 0 ? (
          <div className="no-data">
            <p>No banners yet. Add your first slider/banner above.</p>
          </div>
        ) : (
          sortedBanners.map(b => (
            <div key={b.id} className="banner-card-admin">
              <div className="banner-preview-admin">
                {b.image ? (
                  <img src={b.image} alt={b.title || 'Banner'} />
                ) : (
                  <div className="banner-placeholder">No image</div>
                )}
              </div>
              <div className="banner-info-admin">
                <h3>{b.title || 'Untitled'}</h3>
                <p>{b.subtitle || '-'}</p>
                <div className="product-actions">
                  <button className="btn-secondary small" onClick={() => handleEdit(b)}>Edit</button>
                  <button className="btn-danger small" onClick={() => handleDelete(b.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminBanners
