import { supabase } from '../lib/supabase'

const mapProduct = (r) => ({
  id: r.id,
  name: r.name,
  code: r.code,
  category: r.category,
  subCategory: r.sub_category,
  price: Number(r.price) || 0,
  moq: r.moq || 1,
  stock: r.stock || 'available',
  colors: r.colors || [],
  colorImageMap: r.color_image_map || {},
  image: r.image,
  images: r.images || []
})

const mapCollection = (r) => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  image: r.image,
  enabled: r.enabled !== false,
  order: r.order || 0
})

const mapFabric = (r) => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  image: r.image,
  searchTerm: r.search_term || r.name,
  order: r.order || 0,
  enabled: r.enabled !== false
})

const mapOrder = (r) => ({
  id: r.id,
  date: r.date,
  status: r.status,
  buyerName: r.buyer_name,
  buyerMobile: r.buyer_mobile,
  items: r.items || [],
  total: Number(r.total) || 0,
  notes: r.notes,
  timeline: r.timeline || []
})

const mapLedger = (r) => ({
  id: r.id,
  date: r.date,
  type: r.type,
  orderId: r.order_id,
  description: r.description,
  amount: Number(r.amount) || 0,
  balance: Number(r.balance) || 0,
  notes: r.notes
})

const mapUser = (r) => ({
  id: r.id,
  shopName: r.shop_name,
  buyerName: r.buyer_name,
  mobile: r.mobile,
  city: r.city,
  businessType: r.business_type,
  gst: r.gst,
  status: r.status,
  registeredDate: r.registered_date
})

// Products
export async function fetchProducts() {
  if (!supabase) return []
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true })
  if (error) throw error
  return (data || []).map(mapProduct)
}

export function subscribeProducts(cb) {
  if (!supabase) return null
  const ch = supabase.channel('products-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
    fetchProducts().then(cb).catch(console.error)
  })
  ch.subscribe()
  return ch
}

export async function upsertProducts(products) {
  if (!supabase) return
  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    category: p.category,
    sub_category: p.subCategory,
    price: p.price,
    moq: p.moq,
    stock: p.stock,
    colors: p.colors || [],
    color_image_map: p.colorImageMap || {},
    image: p.image,
    images: p.images || [],
    updated_at: new Date().toISOString()
  }))
  const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

export async function deleteProduct(id) {
  if (!supabase) return
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// Collections
export async function fetchCollections() {
  if (!supabase) return []
  const { data, error } = await supabase.from('collections').select('*').order('order', { ascending: true })
  if (error) throw error
  return (data || []).map(mapCollection)
}

export function subscribeCollections(cb) {
  if (!supabase) return null
  const ch = supabase.channel('collections-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, () => {
    fetchCollections().then(cb).catch(console.error)
  })
  ch.subscribe()
  return ch
}

export async function upsertCollections(collections) {
  if (!supabase) return
  const rows = collections.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image,
    enabled: c.enabled !== false,
    order: c.order || 0,
    updated_at: new Date().toISOString()
  }))
  const { error } = await supabase.from('collections').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

// Fabric Categories
export async function fetchFabricCategories() {
  if (!supabase) return []
  const { data, error } = await supabase.from('fabric_categories').select('*').order('order', { ascending: true })
  if (error) throw error
  return (data || []).map(mapFabric)
}

export function subscribeFabricCategories(cb) {
  if (!supabase) return null
  const ch = supabase.channel('fabric-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'fabric_categories' }, () => {
    fetchFabricCategories().then(cb).catch(console.error)
  })
  ch.subscribe()
  return ch
}

export async function upsertFabricCategories(categories) {
  if (!supabase) return
  const rows = categories.map((f) => ({
    id: f.id,
    name: f.name,
    slug: f.slug,
    image: f.image,
    search_term: f.searchTerm || f.name,
    order: f.order || 0,
    enabled: f.enabled !== false,
    updated_at: new Date().toISOString()
  }))
  const { error } = await supabase.from('fabric_categories').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

// Banners
export async function fetchBanners() {
  if (!supabase) return []
  const { data, error } = await supabase.from('banners').select('*').order('order', { ascending: true })
  if (error) throw error
  return (data || []).map((r) => ({ id: r.id, image: r.image, link: r.link, order: r.order }))
}

export function subscribeBanners(cb) {
  if (!supabase) return null
  const ch = supabase.channel('banners-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, () => {
    fetchBanners().then(cb).catch(console.error)
  })
  ch.subscribe()
  return ch
}

export async function upsertBanners(banners) {
  if (!supabase) return
  const rows = banners.map((b, i) => ({ id: b.id || i + 1, image: b.image, link: b.link || '', order: b.order ?? i, updated_at: new Date().toISOString() }))
  const { error } = await supabase.from('banners').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

// Sections
export async function fetchSections() {
  if (!supabase) return {}
  const { data, error } = await supabase.from('sections').select('data').eq('id', 'main').single()
  if (error || !data) return {}
  return data.data || {}
}

export function subscribeSections(cb) {
  if (!supabase) return null
  const ch = supabase.channel('sections-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'sections' }, () => {
    fetchSections().then(cb).catch(console.error)
  })
  ch.subscribe()
  return ch
}

export async function upsertSections(data) {
  if (!supabase) return
  const { error } = await supabase.from('sections').upsert({ id: 'main', data, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  if (error) throw error
}

// Settings
export async function fetchSettings() {
  if (!supabase) return {}
  const { data, error } = await supabase.from('settings').select('data').eq('id', 'main').single()
  if (error || !data) return {}
  return data.data || {}
}

export function subscribeSettings(cb) {
  if (!supabase) return null
  const ch = supabase.channel('settings-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
    fetchSettings().then(cb).catch(console.error)
  })
  ch.subscribe()
  return ch
}

export async function upsertSettings(data) {
  if (!supabase) return
  const { error } = await supabase.from('settings').upsert({ id: 'main', data, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  if (error) throw error
}

// Users (buyers)
export async function fetchUsers() {
  if (!supabase) return []
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return (data || []).map(mapUser)
}

export function subscribeUsers(cb) {
  if (!supabase) return null
  const ch = supabase.channel('users-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
    fetchUsers().then(cb).catch(console.error)
  })
  ch.subscribe()
  return ch
}

export async function upsertUsers(users) {
  if (!supabase) return
  const rows = users.map((u) => ({
    id: u.id,
    shop_name: u.shopName,
    buyer_name: u.buyerName,
    mobile: u.mobile,
    city: u.city,
    business_type: u.businessType,
    gst: u.gst,
    status: u.status,
    registered_date: u.registeredDate,
    updated_at: new Date().toISOString()
  }))
  const { error } = await supabase.from('users').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

// Orders
export async function fetchOrders() {
  if (!supabase) return []
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapOrder)
}

export function subscribeOrders(cb) {
  if (!supabase) return null
  const ch = supabase.channel('orders-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
    fetchOrders().then(cb).catch(console.error)
  })
  ch.subscribe()
  return ch
}

export async function upsertOrders(orders) {
  if (!supabase) return
  const rows = orders.map((o) => ({
    id: o.id,
    date: o.date,
    status: o.status,
    buyer_name: o.buyerName,
    buyer_mobile: o.buyerMobile,
    items: o.items || [],
    total: o.total,
    notes: o.notes,
    timeline: o.timeline || [],
    updated_at: new Date().toISOString()
  }))
  const { error } = await supabase.from('orders').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

export async function insertOrder(order) {
  if (!supabase) return
  const row = {
    id: order.id,
    date: order.date,
    status: order.status || 'received',
    buyer_name: order.buyerName,
    buyer_mobile: order.buyerMobile,
    items: order.items || [],
    total: order.total,
    notes: order.notes,
    timeline: order.timeline || [{ status: 'received', date: order.date, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]
  }
  const { error } = await supabase.from('orders').insert(row)
  if (error) throw error
}

// Ledger
export async function fetchLedger() {
  if (!supabase) return []
  const { data, error } = await supabase.from('ledger').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(mapLedger)
}

export function subscribeLedger(cb) {
  if (!supabase) return null
  const ch = supabase.channel('ledger-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'ledger' }, () => {
    fetchLedger().then(cb).catch(console.error)
  })
  ch.subscribe()
  return ch
}

export async function upsertLedger(ledger) {
  if (!supabase) return
  const rows = ledger.map((t) => ({
    id: t.id,
    date: t.date,
    type: t.type,
    order_id: t.orderId,
    description: t.description,
    amount: t.amount,
    balance: t.balance,
    notes: t.notes || ''
  }))
  const { error } = await supabase.from('ledger').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

export async function insertLedgerEntry(entry) {
  if (!supabase) return
  const row = {
    id: entry.id,
    date: entry.date,
    type: entry.type,
    order_id: entry.orderId,
    description: entry.description,
    amount: entry.amount,
    balance: entry.balance,
    notes: entry.notes || ''
  }
  const { error } = await supabase.from('ledger').insert(row)
  if (error) throw error
}

// Advance percent
export async function fetchAdvancePercent() {
  if (!supabase) return 20
  const { data, error } = await supabase.from('advance_percent').select('value').eq('id', 'main').single()
  if (error || !data) return 20
  return Number(data.value) || 20
}

export async function upsertAdvancePercent(value) {
  if (!supabase) return
  const { error } = await supabase.from('advance_percent').upsert({ id: 'main', value, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  if (error) throw error
}
