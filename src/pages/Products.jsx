import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useProducts } from '../hooks/useData'
import { useWishlist } from '../context/WishlistContext'
import { FiHeart, FiFilter, FiChevronDown, FiGrid, FiList } from 'react-icons/fi'
import ScrollReveal from '../components/ScrollReveal'
import { defaultProducts, normalizeProducts } from '../data/defaultCatalog'
import './Products.css'

const allProducts = defaultProducts

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'newest', label: 'Newest First' },
]

function Products() {
  const [searchParams] = useSearchParams()
  const [allData, setAllData] = useState(allProducts)
  const [products, setProducts] = useState(allProducts)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
    setSelectedCategory(searchParams.get('category') || 'all')
  }, [searchParams])
  const [selectedSubCategory, setSelectedSubCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [priceBand, setPriceBand] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilterTab, setActiveFilterTab] = useState('category')
  const [pendingCategory, setPendingCategory] = useState('all')
  const [pendingSubCategory, setPendingSubCategory] = useState('all')
  const [pendingSort, setPendingSort] = useState('default')
  const [pendingPriceBand, setPendingPriceBand] = useState('all')

  const { data: productsData } = useProducts()

  useEffect(() => {
    const data = productsData?.length ? normalizeProducts(productsData) : allProducts
    setAllData(data && data.length ? data : allProducts)
  }, [productsData])

  useEffect(() => {
    let filtered = allData
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory)
    if (selectedSubCategory !== 'all') filtered = filtered.filter(p => p.subCategory === selectedSubCategory)
    if (priceBand !== 'all') {
      filtered = filtered.filter((p) => {
        const price = Number(p.price) || 0
        if (priceBand === 'under-500') return price < 500
        if (priceBand === '500-1000') return price >= 500 && price <= 1000
        return price > 1000
      })
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) || (p.code && p.code.toLowerCase().includes(q))
      )
    }

    // Sort
    if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0))
    else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0))
    else if (sortBy === 'name') filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    else if (sortBy === 'newest') filtered = [...filtered].sort((a, b) => (b.id || 0) - (a.id || 0))

    setProducts(filtered)
  }, [allData, searchQuery, selectedCategory, selectedSubCategory, sortBy, priceBand])

  const categoryOptions = ['all', ...Array.from(new Set(allData.map((item) => item.category).filter(Boolean)))]
  const subCategoryOptions = ['all', ...Array.from(new Set(allData.map((item) => item.subCategory).filter(Boolean)))]

  useEffect(() => {
    setPendingCategory(selectedCategory)
    setPendingSubCategory(selectedSubCategory)
    setPendingSort(sortBy)
    setPendingPriceBand(priceBand)
  }, [selectedCategory, selectedSubCategory, sortBy, priceBand])

  const applyMobileFilters = () => {
    setSelectedCategory(pendingCategory)
    setSelectedSubCategory(pendingSubCategory)
    setSortBy(pendingSort)
    setPriceBand(pendingPriceBand)
    setFilterOpen(false)
  }

  const openSortPanel = () => {
    setFilterOpen(true)
    setActiveFilterTab('sort')
  }

  return (
    <div className="products-page">
      <div className="container">
        <ScrollReveal variant="fadeUp">
          <div className="page-header">
            <div className="page-header-top">
              <h1>Our Products</h1>
              <span className="pill pill-neutral">{products.length} products</span>
            </div>
            <p>Browse our complete wholesale catalogue</p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp">
          <div className="products-mobile-toolbar">
            <button className="toolbar-action" onClick={() => { setFilterOpen(true); setActiveFilterTab('category') }}>
              <FiFilter />
              <span>Filter</span>
            </button>
            <div className="view-toggle-wrap" role="group" aria-label="View mode">
              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <FiGrid />
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'compact' ? 'active' : ''}`}
                onClick={() => setViewMode('compact')}
                aria-label="Compact list view"
              >
                <FiList />
              </button>
            </div>
            <button className="toolbar-action" onClick={openSortPanel}>
              <span>Sort</span>
              <FiChevronDown />
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp">
          <div className="filter-section">
            <div className="filter-row">
              <div className="filter-group">
                <label>Category</label>
                <div className="filter-chips">
                  {categoryOptions.map(cat => (
                    <button
                      key={cat}
                      className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => { setSelectedCategory(cat); setSelectedSubCategory('all') }}
                    >
                      {cat === 'all' ? 'All' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label>Sub-Category</label>
                <div className="filter-chips">
                  {subCategoryOptions.map(sub => (
                    <button
                      key={sub}
                      className={`chip ${selectedSubCategory === sub ? 'active' : ''}`}
                      onClick={() => setSelectedSubCategory(sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group filter-sort">
                <label>Sort</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Price</label>
                <div className="filter-chips">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'under-500', label: 'Under ₹500' },
                    { value: '500-1000', label: '₹500 - ₹1000' },
                    { value: 'above-1000', label: 'Above ₹1000' }
                  ].map((item) => (
                    <button
                      key={item.value}
                      className={`chip ${priceBand === item.value ? 'active' : ''}`}
                      onClick={() => setPriceBand(item.value)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="stagger" className={`products-grid ${viewMode === 'compact' ? 'compact' : ''}`}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollReveal>

        {products.length === 0 && (
          <ScrollReveal variant="fadeUp">
            <div className="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          </ScrollReveal>
        )}
      </div>

      {filterOpen && (
        <div className="mobile-filter-drawer" role="dialog" aria-modal="true">
          <div className="mobile-filter-overlay" onClick={() => setFilterOpen(false)} aria-hidden="true"></div>
          <div className="mobile-filter-sheet">
            <div className="mobile-filter-header">
              <h3>Filters</h3>
              <button onClick={() => setFilterOpen(false)}>Close</button>
            </div>
            <div className="mobile-filter-body">
              <aside className="mobile-filter-tabs">
                {[
                  { key: 'category', label: 'Category' },
                  { key: 'subCategory', label: 'Sub Category' },
                  { key: 'price', label: 'Price' },
                  { key: 'sort', label: 'Sort' }
                ].map((item) => (
                  <button
                    key={item.key}
                    className={`mobile-filter-tab ${activeFilterTab === item.key ? 'active' : ''}`}
                    onClick={() => setActiveFilterTab(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </aside>
              <div className="mobile-filter-panel">
                {activeFilterTab === 'category' && (
                  <div className="mobile-option-list">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        className={`mobile-option ${pendingCategory === cat ? 'active' : ''}`}
                        onClick={() => { setPendingCategory(cat); setPendingSubCategory('all') }}
                      >
                        {cat === 'all' ? 'All' : cat.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                )}
                {activeFilterTab === 'subCategory' && (
                  <div className="mobile-option-list">
                    {subCategoryOptions.map((sub) => (
                      <button
                        key={sub}
                        className={`mobile-option ${pendingSubCategory === sub ? 'active' : ''}`}
                        onClick={() => setPendingSubCategory(sub)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
                {activeFilterTab === 'price' && (
                  <div className="mobile-option-list">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: 'under-500', label: 'Under ₹500' },
                      { value: '500-1000', label: '₹500 - ₹1000' },
                      { value: 'above-1000', label: 'Above ₹1000' }
                    ].map((item) => (
                      <button
                        key={item.value}
                        className={`mobile-option ${pendingPriceBand === item.value ? 'active' : ''}`}
                        onClick={() => setPendingPriceBand(item.value)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
                {activeFilterTab === 'sort' && (
                  <div className="mobile-option-list">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`mobile-option ${pendingSort === opt.value ? 'active' : ''}`}
                        onClick={() => setPendingSort(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mobile-filter-footer">
              <button
                className="btn-secondary full-width"
                onClick={() => {
                  setPendingCategory('all')
                  setPendingSubCategory('all')
                  setPendingSort('default')
                  setPendingPriceBand('all')
                }}
              >
                Clear
              </button>
              <button className="btn-primary full-width" onClick={applyMobileFilters}>Apply Filter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const stockBadgeClass = { available: 'available', limited: 'limited', 'out-of-stock': 'out-of-stock' }[product.stock] || 'available'
  const img = product.images?.[0] || product.image

  return (
    <div className="product-card">
      <button
        className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
        onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
        aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FiHeart fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
      </button>
      <div className="product-card-tags">
        <span className="pill pill-warning">New</span>
        {product.subCategory && <span className="tag">{product.subCategory}</span>}
      </div>
      <Link to={`/product/${product.id}`} className="product-image">
        <img
          src={img}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = 'https://cdn.shopify.com/s/files/1/0552/5291/0159/files/DSC_1686copy2.jpg?v=1685442942'
          }}
        />
      </Link>
      <div className="product-info">
        <h3>{product.name}</h3>
        <span className="pill pill-neutral">Code: {product.code}</span>
        <div className="product-meta">
          <span className="pill">MOQ {product.moq}</span>
          <span className="price">₹{product.price}/pc</span>
        </div>
        <span className={`pill pill-${stockBadgeClass === 'available' ? 'success' : stockBadgeClass === 'limited' ? 'warning' : 'error'}`}>
          {product.stock === 'available' ? 'In Stock' : product.stock === 'limited' ? 'Limited' : 'Out of Stock'}
        </span>
        <Link to={`/product/${product.id}`} className="btn-primary small full-width">
          View Details
        </Link>
      </div>
    </div>
  )
}

export default Products
