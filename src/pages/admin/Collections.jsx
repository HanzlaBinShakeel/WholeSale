import React, { useEffect, useMemo, useState } from 'react'
import { useNotification } from '../../context/NotificationContext'
import { defaultCollections, normalizeCollections } from '../../data/defaultCatalog'
import { useCollections } from '../../hooks/useData'
import './Admin.css'

const DEFAULT_COLLECTIONS = defaultCollections

const newForm = {
  name: '',
  slug: '',
  image: '',
  enabled: true,
  order: 1
}

function slugify(text = '') {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function AdminCollections() {
  const { showNotification } = useNotification()
  const { data: collectionsData, save: saveCollections } = useCollections()
  const [collections, setCollections] = useState([])
  const [form, setForm] = useState(newForm)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const list = collectionsData?.length ? normalizeCollections(collectionsData) : normalizeCollections(DEFAULT_COLLECTIONS)
    setCollections(list)
  }, [collectionsData])

  const sorted = useMemo(
    () => [...collections].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [collections]
  )

  const persist = async (next) => {
    setCollections(next)
    await saveCollections(next)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.image) {
      showNotification('Collection name and image are required', 'error')
      return
    }

    const payload = {
      id: editingId || Date.now(),
      name: form.name.trim(),
      slug: form.slug ? slugify(form.slug) : slugify(form.name),
      image: form.image.trim(),
      enabled: !!form.enabled,
      order: Number(form.order) || 1
    }

    if (editingId) {
      const next = collections.map((item) => (item.id === editingId ? payload : item))
      await persist(next)
      showNotification('Collection updated', 'success')
    } else {
      await persist([...collections, payload])
      showNotification('Collection created', 'success')
    }

    setEditingId(null)
    setForm(newForm)
  }

  const onEdit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name || '',
      slug: item.slug || '',
      image: item.image || '',
      enabled: item.enabled !== false,
      order: item.order || 1
    })
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this collection?')) return
    await persist(collections.filter((item) => item.id !== id))
    showNotification('Collection deleted', 'success')
  }

  const toggleEnabled = async (id) => {
    const next = collections.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    )
    await persist(next)
    showNotification('Collection updated', 'success')
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Collections</h1>
          <p>Create, edit, hide, and reorder home page collection cards</p>
        </div>
      </div>

      <form className="admin-form-card admin-form" onSubmit={onSubmit}>
        <h2>{editingId ? 'Edit Collection' : 'Add Collection'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Collection Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value
                setForm((prev) => ({
                  ...prev,
                  name,
                  slug: prev.slug || slugify(name)
                }))
              }}
              placeholder="Bandhani Saree"
              required
            />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
              placeholder="bandhani-saree"
            />
          </div>
          <div className="form-group">
            <label>Image URL *</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="https://..."
              required
            />
          </div>
          <div className="form-group">
            <label>Display Order</label>
            <input
              type="number"
              min="1"
              value={form.order}
              onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-group auto-approve-toggle">
          <label>
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
            />
            Show this collection on storefront
          </label>
        </div>
        <div className="form-actions">
          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditingId(null)
                setForm(newForm)
              }}
            >
              Cancel Edit
            </button>
          )}
          <button type="submit" className="btn-primary">
            {editingId ? 'Update Collection' : 'Add Collection'}
          </button>
        </div>
      </form>

      <div className="banners-grid-admin">
        {sorted.map((item) => (
          <div key={item.id} className="banner-card-admin">
            <div className="banner-preview-admin">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="banner-info-admin">
              <h3>{item.name}</h3>
              <p>{item.slug}</p>
              <div className="action-buttons">
                <button className="btn-secondary small" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn-secondary small" onClick={() => toggleEnabled(item.id)}>
                  {item.enabled ? 'Hide' : 'Show'}
                </button>
                <button className="btn-danger small" onClick={() => onDelete(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminCollections
