-- =========================================================================
--             SUPABASE POSTGRESQL MIGRATION SCHEMA (snake_case)
--              WITH ROW LEVEL SECURITY (RLS) & GRANULAR CRUD POLICIES
-- =========================================================================
-- This script contains the table structure, primary keys, checks, 
-- Row Level Security (RLS) controls, explicit role GRANTS, and CRUD policies
-- for your Supabase PostgreSQL database using standard Postgres snake_case.
--
-- This schema matches the table names queried in your React frontend:
--   - "menu_items"
--   - "orders"
--   - "customers"
--   - "inventory_items"
--   - "employees"
--   - "promotions"
--   - "settings"
--   - "gallery_items"
--   - "reviews"
--   - "reservations"
--   - "categories"
--   - "order_statuses"
-- =========================================================================

-- ==========================================
-- 0. CLEANUP (Optional - Uncomment if rebuilding)
-- ==========================================
-- DROP TABLE IF EXISTS reservations CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS gallery_items CASCADE;
-- DROP TABLE IF EXISTS settings CASCADE;
-- DROP TABLE IF EXISTS promotions CASCADE;
-- DROP TABLE IF EXISTS employees CASCADE;
-- DROP TABLE IF EXISTS inventory_items CASCADE;
-- DROP TABLE IF EXISTS customers CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS menu_items CASCADE;
-- DROP TABLE IF EXISTS order_statuses CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;


-- ==========================================
-- 1. SCHEMAS & TABLES DEFINITION
-- ==========================================

-- A. Table: categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- B. Table: order_statuses
CREATE TABLE IF NOT EXISTS order_statuses (
  id TEXT PRIMARY KEY,
  status_name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- C. Table: menu_items
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  rating NUMERIC NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  image TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

-- D. Table: orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TEXT NOT NULL,
  table_number TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'qris'))
);

-- E. Table: customers
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  total_orders INTEGER NOT NULL DEFAULT 0 CHECK (total_orders >= 0),
  total_spent NUMERIC NOT NULL DEFAULT 0.00 CHECK (total_spent >= 0),
  avatar TEXT NOT NULL,
  last_order TEXT NOT NULL
);

-- F. Table: inventory_items
CREATE TABLE IF NOT EXISTS inventory_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0 CHECK (stock >= 0),
  unit TEXT NOT NULL,
  min_stock NUMERIC NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  category TEXT NOT NULL,
  supplier TEXT NOT NULL
);

-- G. Table: employees
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Barista', 'Chef', 'Waiter', 'Cashier')),
  email TEXT NOT NULL,
  shift TEXT NOT NULL CHECK (shift IN ('Morning (07:00 - 15:00)', 'Evening (15:00 - 23:00)', 'Full Time')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar TEXT NOT NULL
);

-- H. Table: promotions
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discount_percent NUMERIC NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  type TEXT NOT NULL CHECK (type IN ('discount', 'event', 'campaign')),
  banner_image TEXT NOT NULL,
  valid_until TEXT NOT NULL
);

-- I. Table: settings (Cafe Settings)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'current_settings',
  brand_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  opening_hours TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  facebook_url TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  theme_color TEXT NOT NULL,
  favicon_url TEXT,
  about_pill TEXT,
  about_title TEXT,
  about_description TEXT,
  about_feature1_title TEXT,
  about_feature1_desc TEXT,
  about_feature2_title TEXT,
  about_feature2_desc TEXT,
  hero_image_url1 TEXT,
  hero_image_url2 TEXT,
  hero_image_url3 TEXT,
  hero_image_url4 TEXT,
  disable_order_buttons BOOLEAN DEFAULT false
);

-- J. Table: gallery_items
CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL
);

-- K. Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating NUMERIC NOT NULL CHECK (rating >= 0 AND rating <= 5),
  comment TEXT NOT NULL,
  date TEXT NOT NULL,
  avatar TEXT NOT NULL
);

-- L. Table: reservations
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  message TEXT NOT NULL,
  reservation_date TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Dikonfirmasi', 'Dihubungi', 'Dibatalkan')),
  created_at TEXT NOT NULL
);

-- M. Table: coffee_brands
CREATE TABLE IF NOT EXISTS coffee_brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  roast_level TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);


-- ==========================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_brands ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 3. EXPLICIT ROLE GRANTS
-- ==========================================
-- Grants table access to PostgREST API roles (anon, authenticated, service_role)

GRANT SELECT, INSERT, UPDATE, DELETE ON categories TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON order_statuses TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON menu_items TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON customers TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON inventory_items TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON promotions TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON settings TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON gallery_items TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON reviews TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON reservations TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON coffee_brands TO anon, authenticated, service_role;


-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- ------------------------------------------
-- A. Policies for "categories"
-- ------------------------------------------
CREATE POLICY "Allow select for everyone" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for authenticated users" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON categories FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- B. Policies for "order_statuses"
-- ------------------------------------------
CREATE POLICY "Allow select for everyone" ON order_statuses FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for authenticated users" ON order_statuses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON order_statuses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON order_statuses FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- C. Policies for "menu_items"
-- ------------------------------------------
CREATE POLICY "Allow select for everyone" ON menu_items FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for authenticated users" ON menu_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON menu_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON menu_items FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- D. Policies for "orders"
-- ------------------------------------------
CREATE POLICY "Allow select for everyone" ON orders FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for everyone" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON orders FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- E. Policies for "customers"
-- ------------------------------------------
CREATE POLICY "Allow select for authenticated users" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert for everyone" ON customers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON customers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON customers FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- F. Policies for "inventory_items"
-- ------------------------------------------
CREATE POLICY "Allow select for authenticated users" ON inventory_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert for authenticated users" ON inventory_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON inventory_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON inventory_items FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- G. Policies for "employees"
-- ------------------------------------------
CREATE POLICY "Allow select for authenticated users" ON employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert for authenticated users" ON employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON employees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON employees FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- H. Policies for "promotions"
-- ------------------------------------------
CREATE POLICY "Allow select for everyone" ON promotions FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for authenticated users" ON promotions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON promotions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON promotions FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- I. Policies for "settings" (Cafe Settings)
-- ------------------------------------------
CREATE POLICY "Allow select for everyone" ON settings FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for authenticated users" ON settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON settings FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- J. Policies for "gallery_items"
-- ------------------------------------------
CREATE POLICY "Allow select for everyone" ON gallery_items FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for authenticated users" ON gallery_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON gallery_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON gallery_items FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- K. Policies for "reviews"
-- ------------------------------------------
CREATE POLICY "Allow select for everyone" ON reviews FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for everyone" ON reviews FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON reviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON reviews FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- L. Policies for "reservations"
-- ------------------------------------------
CREATE POLICY "Allow select for authenticated users" ON reservations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert for everyone" ON reservations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON reservations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for authenticated users" ON reservations FOR DELETE TO authenticated USING (true);

-- ------------------------------------------
-- M. Policies for "coffee_brands"
-- ------------------------------------------
CREATE POLICY "Allow select for everyone" ON coffee_brands FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for everyone" ON coffee_brands FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow update for everyone" ON coffee_brands FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for everyone" ON coffee_brands FOR DELETE TO public USING (true);
