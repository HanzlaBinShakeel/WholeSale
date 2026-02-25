import { supabase } from '../lib/supabase'
import { defaultProducts, defaultCollections, defaultFabricCategories } from '../data/defaultCatalog'
import { DUMMY_USERS, DUMMY_ORDERS, DUMMY_LEDGER } from '../data/seedData'

export async function seedSupabase() {
  if (!supabase) throw new Error('Supabase not configured')

  const results = { products: 0, collections: 0, fabricCategories: 0, users: 0, orders: 0, ledger: 0, settings: 0, sections: 0, banners: 0 }

  // Products
  const productRows = defaultProducts.map((p) => ({
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
    images: p.images || []
  }))
  const { error: ep } = await supabase.from('products').upsert(productRows, { onConflict: 'id' })
  if (ep) throw ep
  results.products = productRows.length

  // Collections
  const collectionRows = defaultCollections.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image,
    enabled: c.enabled !== false,
    order: c.order || 0
  }))
  const { error: ec } = await supabase.from('collections').upsert(collectionRows, { onConflict: 'id' })
  if (ec) throw ec
  results.collections = collectionRows.length

  // Fabric categories
  const fabricRows = defaultFabricCategories.map((f) => ({
    id: f.id,
    name: f.name,
    slug: f.slug,
    image: f.image,
    search_term: f.searchTerm || f.name,
    order: f.order || 0,
    enabled: f.enabled !== false
  }))
  const { error: ef } = await supabase.from('fabric_categories').upsert(fabricRows, { onConflict: 'id' })
  if (ef) throw ef
  results.fabricCategories = fabricRows.length

  // Users
  const userRows = DUMMY_USERS.map((u) => ({
    id: u.id,
    shop_name: u.shopName,
    buyer_name: u.buyerName,
    mobile: u.mobile,
    city: u.city,
    business_type: u.businessType,
    gst: u.gst,
    status: u.status,
    registered_date: u.registeredDate
  }))
  const { error: eu } = await supabase.from('users').upsert(userRows, { onConflict: 'id' })
  if (eu) throw eu
  results.users = userRows.length

  // Orders
  const orderRows = DUMMY_ORDERS.map((o) => ({
    id: o.id,
    date: o.date,
    status: o.status,
    buyer_name: o.buyerName,
    buyer_mobile: o.buyerMobile,
    items: o.items || [],
    total: o.total,
    notes: o.notes,
    timeline: o.timeline || []
  }))
  const { error: eo } = await supabase.from('orders').upsert(orderRows, { onConflict: 'id' })
  if (eo) throw eo
  results.orders = orderRows.length

  // Ledger
  const ledgerRows = DUMMY_LEDGER.map((t) => ({
    id: t.id,
    date: t.date,
    type: t.type,
    order_id: t.orderId,
    description: t.description,
    amount: t.amount,
    balance: t.balance,
    notes: t.notes || ''
  }))
  const { error: el } = await supabase.from('ledger').upsert(ledgerRows, { onConflict: 'id' })
  if (el) throw el
  results.ledger = ledgerRows.length

  // Settings
  const defaultSettings = {
    storeName: 'MKT Wholesale',
    heroTitle: 'Premium Traditional Textiles',
    heroSubtitle: 'Saafa, Odhna & Rajputi — curated for wedding seasons and festivals. Bulk orders with guaranteed quality.',
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    whatsappNumber: '919876543210',
    ourStorySubtitle: 'WHOLESALE TRADITIONAL TEXTILES',
    ourStoryHeadline: 'Where Heritage Meets Wholesale',
    ourStoryBody: 'MKT Wholesale brings you Saafa, Odhna, Rajputi suits and traditional ethnic wear—curated for wedding seasons and festivals.',
    ourStoryTagline: 'पारंपरिक कपड़े, बेहतरीन सौदा | Traditional textiles, best deal for your store.',
    ourStorySocial: '@mktwholesale'
  }
  const { error: es } = await supabase.from('settings').upsert({ id: 'main', data: defaultSettings, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  if (es) throw es
  results.settings = 1

  // Sections
  const defaultSections = {
    heroSlider: true,
    topBanner: true,
    shopByCategory: true,
    shopByFabric: true,
    categories: true,
    ourStory: true,
    deals: true,
    newArrivals: true,
    featured: true,
    wholesaleNotice: true
  }
  const { error: esa } = await supabase.from('sections').upsert({ id: 'main', data: defaultSections, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  if (esa) throw esa
  results.sections = 1

  // Advance percent
  await supabase.from('advance_percent').upsert({ id: 'main', value: 20, updated_at: new Date().toISOString() }, { onConflict: 'id' })

  return results
}
