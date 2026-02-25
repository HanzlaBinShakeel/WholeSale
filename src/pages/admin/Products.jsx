import React, { useState, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import { defaultProducts, normalizeProducts } from '../../data/defaultCatalog'
import { useProducts } from '../../hooks/useData'
import './Admin.css'

const categories = [
  { value: 'saafa', label: 'Saafa' },
  { value: 'odhna', label: 'Odhna' },
  { value: 'rajputi-suit', label: 'Rajputi Suit' },
  { value: 'rajputi-jod', label: 'Rajputi Jod' },
  { value: 'bandhej', label: 'Bandhej' }
]
const subCategories = ['Wedding', 'Daily', 'Premium']
const stockStatuses = ['available', 'limited', 'out-of-stock']

function AdminProducts() {
  const { showNotification } = useNotification()
  const { data: productsData, save: saveProducts } = useProducts()
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    subCategory: '',
    price: '',
    moq: '',
    stock: 'available',
    fabric: '',
    gsm: '',
    size: '',
    colors: [],
    description: '',
    use: '',
    quality: '',
    packing: '',
    images: []
  })

  useEffect(() => {
    const list = productsData?.length ? normalizeProducts(productsData) : normalizeProducts(defaultProducts)
    setProducts(list)
  }, [productsData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.code || !formData.category || !formData.price || !formData.moq) {
      showNotification('Please fill all required fields', 'error')
      return
    }

    const productData = {
      ...formData,
      id: editingProduct?.id || Date.now(),
      price: Number(formData.price),
      moq: Number(formData.moq),
      images: formData.images.length > 0 ? formData.images : [
        defaultProducts[0].image
      ]
    }

    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? productData : p)
      await saveProducts(updated)
      showNotification('Product updated successfully!', 'success')
    } else {
      await saveProducts([...products, productData])
      showNotification('Product added successfully!', 'success')
    }

    resetForm()
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      code: product.code || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      price: product.price || '',
      moq: product.moq || '',
      stock: product.stock || 'available',
      fabric: product.fabric || '',
      gsm: product.gsm || '',
      size: product.size || '',
      colors: product.colors || [],
      description: product.description || '',
      use: product.use || '',
      quality: product.quality || '',
      packing: product.packing || '',
      images: product.images || []
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id)
      await saveProducts(updated)
      showNotification('Product deleted successfully!', 'success')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: '',
      subCategory: '',
      price: '',
      moq: '',
      stock: 'available',
      fabric: '',
      gsm: '',
      size: '',
      colors: [],
      description: '',
      use: '',
      quality: '',
      packing: '',
      images: []
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  const addColor = () => {
    const color = prompt('Enter color name:')
    if (color && !formData.colors.includes(color)) {
      setFormData({ ...formData, colors: [...formData.colors, color] })
    }
  }

  const removeColor = (color) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) })
  }

  const addImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      setFormData({ ...formData, images: [...formData.images, url] })
    }
  }

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (!files?.length) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }))
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Product Management</h1>
            <p>Add, edit, and manage products</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Add Product
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <div className="form-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sub-Category</label>
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  >
                    <option value="">Select sub-category</option>
                    {subCategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price per piece (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>MOQ (Minimum Order Quantity) *</label>
                  <input
                    type="number"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Status *</label>
                  <select
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  >
                    {stockStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fabric Type</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g., Premium Cotton"
                  />
                </div>

                <div className="form-group">
                  <label>GSM / Weight</label>
                  <input
                    type="text"
                    value={formData.gsm}
                    onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}
                    placeholder="e.g., 180 GSM"
                  />
                </div>

                <div className="form-group">
                  <label>Size / Length</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g., 5 meters"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Colors Available</label>
                <div className="colors-list">
                  {formData.colors.map((color, idx) => (
                    <span key={idx} className="color-tag">
                      {color}
                      <button type="button" onClick={() => removeColor(color)}>×</button>
                    </span>
                  ))}
                  <button type="button" className="btn-secondary small" onClick={addColor}>
                    + Add Color
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Product Images (upload from storage or add URL)</label>
                <div className="image-upload-actions">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="image-upload-input"
                    id="product-images"
                  />
                  <label htmlFor="product-images" className="btn-secondary small upload-btn-label">
                    📁 Upload from Storage
                  </label>
                </div>
                <div className="images-list">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="image-preview">
                      <img src={img} alt={`Preview ${idx + 1}`} />
                      <button type="button" onClick={() => {
                        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })
                      }}>×</button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary small" onClick={addImage}>
                    + Add Image URL
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Use</label>
                <input
                  type="text"
                  value={formData.use}
                  onChange={(e) => setFormData({ ...formData, use: e.target.value })}
                  placeholder="e.g., Perfect for weddings and festivals"
                />
              </div>

              <div className="form-group">
                <label>Quality</label>
                <input
                  type="text"
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                  placeholder="e.g., Premium grade cotton"
                />
              </div>

              <div className="form-group">
                <label>Packing</label>
                <input
                  type="text"
                  value={formData.packing}
                  onChange={(e) => setFormData({ ...formData, packing: e.target.value })}
                  placeholder="e.g., 10 pieces per box"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="products-grid-admin">
          {products.length === 0 ? (
            <div className="no-data">
              <p>No products added yet. Click "Add Product" to get started.</p>
            </div>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-card-admin">
                <div className="product-image-admin">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/300x300'} alt={product.name} />
                  <span className={`stock-badge ${product.stock}`}>
                    {product.stock}
                  </span>
                </div>
                <div className="product-info-admin">
                  <h3>{product.name}</h3>
                  <p className="product-code">Code: {product.code}</p>
                  <p className="product-category">{product.category} {product.subCategory && `- ${product.subCategory}`}</p>
                  <div className="product-meta">
                    <span>MOQ: {product.moq} pcs</span>
                    <span>₹{product.price}/pc</span>
                  </div>
                  <div className="product-actions">
                    <button className="btn-secondary small" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className="btn-danger small" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminProducts
