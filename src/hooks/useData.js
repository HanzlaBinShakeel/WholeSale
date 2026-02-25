import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import * as sb from '../services/supabaseService'

const LS = {
  products: 'adminProducts',
  collections: 'adminCollections',
  fabricCategories: 'adminFabricCategories',
  banners: 'adminBanners',
  sections: 'adminSections',
  settings: 'adminSettings',
  users: 'users',
  orders: 'orders',
  ledger: 'ledger',
  advancePercent: 'advancePercent'
}

function getLS(key, def = null) {
  try {
    const v = localStorage.getItem(key)
    if (!v) return def
    return key === 'advancePercent' ? parseInt(v, 10) : JSON.parse(v)
  } catch {
    return def
  }
}

function setLS(key, value) {
  if (key === 'advancePercent') localStorage.setItem(key, String(value))
  else localStorage.setItem(key, JSON.stringify(value))
}

export function useProducts() {
  const [data, setData] = useState(getLS(LS.products, []))
  const [loading, setLoading] = useState(!!supabase)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const list = await sb.fetchProducts()
      setData(list)
      setLS(LS.products, list)
    } catch (e) {
      setData(getLS(LS.products, []))
      console.warn('Supabase products fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setData(getLS(LS.products, []))
      setLoading(false)
      return
    }
    fetch()
    const ch = sb.subscribeProducts(fetch)
    return () => { if (ch?.unsubscribe) ch.unsubscribe() }
  }, [fetch])

  const save = useCallback(async (products) => {
    setData(products)
    setLS(LS.products, products)
    if (supabase) {
      try {
        await sb.upsertProducts(products)
      } catch (e) {
        console.warn('Supabase products save failed', e)
      }
    }
  }, [])

  return { data, loading, save, refetch: fetch }
}

export function useCollections() {
  const [data, setData] = useState(getLS(LS.collections, []))
  const [loading, setLoading] = useState(!!supabase)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const list = await sb.fetchCollections()
      setData(list)
      setLS(LS.collections, list)
    } catch (e) {
      setData(getLS(LS.collections, []))
      console.warn('Supabase collections fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setData(getLS(LS.collections, []))
      setLoading(false)
      return
    }
    fetch()
    const ch = sb.subscribeCollections(fetch)
    return () => { if (ch?.unsubscribe) ch.unsubscribe() }
  }, [fetch])

  const save = useCallback(async (collections) => {
    setData(collections)
    setLS(LS.collections, collections)
    if (supabase) {
      try {
        await sb.upsertCollections(collections)
      } catch (e) {
        console.warn('Supabase collections save failed', e)
      }
    }
  }, [])

  return { data, loading, save, refetch: fetch }
}

export function useFabricCategories() {
  const [data, setData] = useState(getLS(LS.fabricCategories, []))
  const [loading, setLoading] = useState(!!supabase)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const list = await sb.fetchFabricCategories()
      setData(list)
      setLS(LS.fabricCategories, list)
    } catch (e) {
      setData(getLS(LS.fabricCategories, []))
      console.warn('Supabase fabric categories fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setData(getLS(LS.fabricCategories, []))
      setLoading(false)
      return
    }
    fetch()
    const ch = sb.subscribeFabricCategories(fetch)
    return () => { if (ch?.unsubscribe) ch.unsubscribe() }
  }, [fetch])

  const save = useCallback(async (categories) => {
    setData(categories)
    setLS(LS.fabricCategories, categories)
    if (supabase) {
      try {
        await sb.upsertFabricCategories(categories)
      } catch (e) {
        console.warn('Supabase fabric categories save failed', e)
      }
    }
  }, [])

  return { data, loading, save, refetch: fetch }
}

export function useBanners() {
  const [data, setData] = useState(getLS(LS.banners, []))
  const [loading, setLoading] = useState(!!supabase)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const list = await sb.fetchBanners()
      setData(list)
      setLS(LS.banners, list)
    } catch (e) {
      setData(getLS(LS.banners, []))
      console.warn('Supabase banners fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setData(getLS(LS.banners, []))
      setLoading(false)
      return
    }
    fetch()
    const ch = sb.subscribeBanners(fetch)
    return () => { if (ch?.unsubscribe) ch.unsubscribe() }
  }, [fetch])

  const save = useCallback(async (banners) => {
    setData(banners)
    setLS(LS.banners, banners)
    if (supabase) {
      try {
        await sb.upsertBanners(banners)
      } catch (e) {
        console.warn('Supabase banners save failed', e)
      }
    }
  }, [])

  return { data, loading, save, refetch: fetch }
}

export function useSections() {
  const [data, setData] = useState(getLS(LS.sections, {}))
  const [loading, setLoading] = useState(!!supabase)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const obj = await sb.fetchSections()
      setData(obj)
      setLS(LS.sections, obj)
    } catch (e) {
      setData(getLS(LS.sections, {}))
      console.warn('Supabase sections fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setData(getLS(LS.sections, {}))
      setLoading(false)
      return
    }
    fetch()
    const ch = sb.subscribeSections(fetch)
    return () => { if (ch?.unsubscribe) ch.unsubscribe() }
  }, [fetch])

  const save = useCallback(async (sections) => {
    setData(sections)
    setLS(LS.sections, sections)
    if (supabase) {
      try {
        await sb.upsertSections(sections)
      } catch (e) {
        console.warn('Supabase sections save failed', e)
      }
    }
  }, [])

  return { data, loading, save, refetch: fetch }
}

export function useSettings() {
  const [data, setData] = useState(getLS(LS.settings, {}))
  const [loading, setLoading] = useState(!!supabase)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const obj = await sb.fetchSettings()
      setData(obj)
      setLS(LS.settings, obj)
    } catch (e) {
      setData(getLS(LS.settings, {}))
      console.warn('Supabase settings fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setData(getLS(LS.settings, {}))
      setLoading(false)
      return
    }
    fetch()
    const ch = sb.subscribeSettings(fetch)
    return () => { if (ch?.unsubscribe) ch.unsubscribe() }
  }, [fetch])

  const save = useCallback(async (settings) => {
    setData(settings)
    setLS(LS.settings, settings)
    if (supabase) {
      try {
        await sb.upsertSettings(settings)
      } catch (e) {
        console.warn('Supabase settings save failed', e)
      }
    }
  }, [])

  return { data, loading, save, refetch: fetch }
}

export function useUsers() {
  const [data, setData] = useState(getLS(LS.users, []))
  const [loading, setLoading] = useState(!!supabase)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const list = await sb.fetchUsers()
      setData(list)
      setLS(LS.users, list)
    } catch (e) {
      setData(getLS(LS.users, []))
      console.warn('Supabase users fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setData(getLS(LS.users, []))
      setLoading(false)
      return
    }
    fetch()
    const ch = sb.subscribeUsers(fetch)
    return () => { if (ch?.unsubscribe) ch.unsubscribe() }
  }, [fetch])

  const save = useCallback(async (users) => {
    setData(users)
    setLS(LS.users, users)
    if (supabase) {
      try {
        await sb.upsertUsers(users)
      } catch (e) {
        console.warn('Supabase users save failed', e)
      }
    }
  }, [])

  return { data, loading, save, refetch: fetch }
}

export function useOrders() {
  const [data, setData] = useState(getLS(LS.orders, []))
  const [loading, setLoading] = useState(!!supabase)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const list = await sb.fetchOrders()
      setData(list)
      setLS(LS.orders, list)
    } catch (e) {
      setData(getLS(LS.orders, []))
      console.warn('Supabase orders fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setData(getLS(LS.orders, []))
      setLoading(false)
      return
    }
    fetch()
    const ch = sb.subscribeOrders(fetch)
    return () => { if (ch?.unsubscribe) ch.unsubscribe() }
  }, [fetch])

  const save = useCallback(async (orders) => {
    setData(orders)
    setLS(LS.orders, orders)
    if (supabase) {
      try {
        await sb.upsertOrders(orders)
      } catch (e) {
        console.warn('Supabase orders save failed', e)
      }
    }
  }, [])

  return { data, loading, save, refetch: fetch }
}

export function useLedger() {
  const [data, setData] = useState(getLS(LS.ledger, []))
  const [loading, setLoading] = useState(!!supabase)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const list = await sb.fetchLedger()
      setData(list)
      setLS(LS.ledger, list)
    } catch (e) {
      setData(getLS(LS.ledger, []))
      console.warn('Supabase ledger fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setData(getLS(LS.ledger, []))
      setLoading(false)
      return
    }
    fetch()
    const ch = sb.subscribeLedger(fetch)
    return () => { if (ch?.unsubscribe) ch.unsubscribe() }
  }, [fetch])

  const save = useCallback(async (ledger) => {
    setData(ledger)
    setLS(LS.ledger, ledger)
    if (supabase) {
      try {
        await sb.upsertLedger(ledger)
      } catch (e) {
        console.warn('Supabase ledger save failed', e)
      }
    }
  }, [])

  return { data, loading, save, refetch: fetch }
}

export function useAdvancePercent() {
  const [data, setData] = useState(getLS(LS.advancePercent, 20))
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!supabase) return
    try {
      const v = await sb.fetchAdvancePercent()
      setData(v)
      setLS(LS.advancePercent, v)
    } catch (e) {
      setData(getLS(LS.advancePercent, 20))
    }
  }, [])

  useEffect(() => {
    if (supabase) fetch()
  }, [fetch])

  const save = useCallback(async (value) => {
    const n = Math.max(0, Math.min(50, parseInt(value, 10) || 20))
    setData(n)
    setLS(LS.advancePercent, n)
    if (supabase) {
      try {
        await sb.upsertAdvancePercent(n)
      } catch (e) {
        console.warn('Supabase advance percent save failed', e)
      }
    }
  }, [])

  return { data, loading, save }
}
