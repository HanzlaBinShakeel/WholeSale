-- MKT Wholesale Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Products
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  category TEXT,
  sub_category TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  moq INT DEFAULT 1,
  stock TEXT DEFAULT 'available',
  colors JSONB DEFAULT '[]',
  color_image_map JSONB DEFAULT '{}',
  image TEXT,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Collections
CREATE TABLE IF NOT EXISTS collections (
  id BIGINT PRIMARY KEY DEFAULT (floor(random() * 900000 + 100000)::bigint),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  enabled BOOLEAN DEFAULT true,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fabric Categories
CREATE TABLE IF NOT EXISTS fabric_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image TEXT,
  search_term TEXT,
  "order" INT DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id BIGINT PRIMARY KEY DEFAULT (floor(random() * 900000 + 100000)::bigint),
  image TEXT NOT NULL,
  link TEXT,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sections (show/hide home sections)
CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Settings (store config, hero, contact, our story)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Users (buyers)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  shop_name TEXT,
  buyer_name TEXT,
  mobile TEXT,
  city TEXT,
  business_type TEXT,
  gst TEXT,
  status TEXT DEFAULT 'pending',
  registered_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'received',
  buyer_name TEXT,
  buyer_mobile TEXT,
  items JSONB DEFAULT '[]',
  total DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  timeline JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ledger
CREATE TABLE IF NOT EXISTS ledger (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  order_id TEXT,
  description TEXT,
  amount DECIMAL(12,2) NOT NULL,
  balance DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Advance percent (single value)
CREATE TABLE IF NOT EXISTS advance_percent (
  id TEXT PRIMARY KEY DEFAULT 'main',
  value INT DEFAULT 20,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Allow all for now (you can tighten later with auth)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_percent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all collections" ON collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all fabric_categories" ON fabric_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all banners" ON banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all sections" ON sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all ledger" ON ledger FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all advance_percent" ON advance_percent FOR ALL USING (true) WITH CHECK (true);
