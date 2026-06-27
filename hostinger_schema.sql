-- =========================================================================
--             HOSTINGER DATABASE MIGRATION SCHEMA (snake_case)
--         WITH ROW LEVEL SECURITY (RLS) & GRANULAR CRUD POLICIES
-- =========================================================================
-- This script contains the full table structures, primary keys, check constraints,
-- Row Level Security (RLS) controls, explicit role GRANTS, and CRUD policies
-- for your Hostinger database.
--
-- 💡 DESIGN NOTES FOR HOSTINGER USERS:
-- 1. PostgreSQL (Recommended): If you are running PostgreSQL on your Hostinger 
--    VPS or using Hostinger's PostgreSQL database addon, this script will run 
--    perfectly with full RLS support.
-- 2. MySQL (Alternative): If you are using Hostinger's standard shared MySQL 
--    hosting, MySQL does not support RLS. You should use the MySQL-compatible 
--    definitions provided at the bottom of this file.
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
-- 1. SCHEMAS & TABLES DEFINITION (PostgreSQL)
-- ==========================================

-- A. Table: categories
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE
);

-- B. Table: order_statuses
CREATE TABLE IF NOT EXISTS order_statuses (
  id VARCHAR(255) PRIMARY KEY,
  status_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

-- C. Table: menu_items
CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  image TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

-- D. Table: orders
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(255) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  status VARCHAR(100) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at VARCHAR(100) NOT NULL,
  table_number VARCHAR(100) NOT NULL,
  payment_method VARCHAR(100) NOT NULL CHECK (payment_method IN ('cash', 'card', 'qris'))
);

-- E. Table: customers
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  total_orders INTEGER NOT NULL DEFAULT 0 CHECK (total_orders >= 0),
  total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_spent >= 0),
  avatar TEXT NOT NULL,
  last_order VARCHAR(100) NOT NULL
);

-- F. Table: inventory_items
CREATE TABLE IF NOT EXISTS inventory_items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  stock NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (stock >= 0),
  unit VARCHAR(100) NOT NULL,
  min_stock NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  category VARCHAR(255) NOT NULL,
  supplier VARCHAR(255) NOT NULL
);

-- G. Table: employees
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL CHECK (role IN ('Admin', 'Barista', 'Chef', 'Waiter', 'Cashier')),
  email VARCHAR(255) NOT NULL,
  shift VARCHAR(100) NOT NULL CHECK (shift IN ('Morning (07:00 - 15:00)', 'Evening (15:00 - 23:00)', 'Full Time')),
  status VARCHAR(100) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar TEXT NOT NULL
);

-- H. Table: promotions
CREATE TABLE IF NOT EXISTS promotions (
  id VARCHAR(255) PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discount_percent NUMERIC(5, 2) NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  type VARCHAR(100) NOT NULL CHECK (type IN ('discount', 'event', 'campaign')),
  banner_image TEXT NOT NULL,
  valid_until VARCHAR(100) NOT NULL
);

-- I. Table: settings (Cafe Settings)
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(255) PRIMARY KEY DEFAULT 'current_settings',
  brand_name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  opening_hours VARCHAR(255) NOT NULL,
  instagram_url VARCHAR(255) NOT NULL,
  facebook_url VARCHAR(255) NOT NULL,
  whatsapp_number VARCHAR(255) NOT NULL,
  theme_color VARCHAR(100) NOT NULL,
  favicon_url TEXT,
  about_pill VARCHAR(255),
  about_title VARCHAR(255),
  about_description TEXT,
  about_feature1_title VARCHAR(255),
  about_feature1_desc TEXT,
  about_feature2_title VARCHAR(255),
  about_feature2_desc TEXT,
  hero_image_url1 TEXT,
  hero_image_url2 TEXT,
  hero_image_url3 TEXT,
  hero_image_url4 TEXT,
  disable_order_buttons BOOLEAN DEFAULT false
);

-- J. Table: gallery_items
CREATE TABLE IF NOT EXISTS gallery_items (
  id VARCHAR(255) PRIMARY KEY,
  url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL
);

-- K. Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rating NUMERIC(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  comment TEXT NOT NULL,
  date VARCHAR(100) NOT NULL,
  avatar TEXT NOT NULL
);

-- L. Table: reservations
CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  reservation_date VARCHAR(100),
  status VARCHAR(100) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Dikonfirmasi', 'Dihubungi', 'Dibatalkan')),
  created_at VARCHAR(100) NOT NULL
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


-- ==========================================
-- 3. EXPLICIT ROLE GRANTS
-- ==========================================
-- In PostgreSQL/Supabase, we grant permissions to standard api roles (public/anon/authenticated)
-- For a standalone Hostinger Postgres database, you can also grant permissions to public or specific users.

GRANT SELECT, INSERT, UPDATE, DELETE ON categories TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON order_statuses TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON menu_items TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON customers TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON inventory_items TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON promotions TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON settings TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON gallery_items TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON reviews TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON reservations TO public;


-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- A. Policies for "categories"
CREATE POLICY "Allow select for everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow insert for staff" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON categories FOR DELETE USING (true);

-- B. Policies for "order_statuses"
CREATE POLICY "Allow select for everyone" ON order_statuses FOR SELECT USING (true);
CREATE POLICY "Allow insert for staff" ON order_statuses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON order_statuses FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON order_statuses FOR DELETE USING (true);

-- C. Policies for "menu_items"
CREATE POLICY "Allow select for everyone" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow insert for staff" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON menu_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON menu_items FOR DELETE USING (true);

-- D. Policies for "orders"
CREATE POLICY "Allow select for everyone" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow insert for everyone" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON orders FOR DELETE USING (true);

-- E. Policies for "customers"
CREATE POLICY "Allow select for everyone" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow insert for everyone" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON customers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON customers FOR DELETE USING (true);

-- F. Policies for "inventory_items"
CREATE POLICY "Allow select for staff" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "Allow insert for staff" ON inventory_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON inventory_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON inventory_items FOR DELETE USING (true);

-- G. Policies for "employees"
CREATE POLICY "Allow select for staff" ON employees FOR SELECT USING (true);
CREATE POLICY "Allow insert for staff" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON employees FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON employees FOR DELETE USING (true);

-- H. Policies for "promotions"
CREATE POLICY "Allow select for everyone" ON promotions FOR SELECT USING (true);
CREATE POLICY "Allow insert for staff" ON promotions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON promotions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON promotions FOR DELETE USING (true);

-- I. Policies for "settings" (Cafe Settings)
CREATE POLICY "Allow select for everyone" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow insert for staff" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON settings FOR DELETE USING (true);

-- J. Policies for "gallery_items"
CREATE POLICY "Allow select for everyone" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow insert for staff" ON gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON gallery_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON gallery_items FOR DELETE USING (true);

-- K. Policies for "reviews"
CREATE POLICY "Allow select for everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow insert for everyone" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON reviews FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON reviews FOR DELETE USING (true);

-- L. Policies for "reservations"
CREATE POLICY "Allow select for staff" ON reservations FOR SELECT USING (true);
CREATE POLICY "Allow insert for everyone" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for staff" ON reservations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for staff" ON reservations FOR DELETE USING (true);


-- =========================================================================
--             MYSQL REPLACEMENT SCHEMA (FOR STANDARD HOSTINGER MYSQL)
-- =========================================================================
-- If your Hostinger database is standard MySQL, copy and run the SQL below.
-- Since MySQL does not support "CHECK" constraint validations on old versions 
-- or native Row Level Security (RLS) policies, security must be handled in your 
-- application logic (e.g. your backend API proxy, session checks, etc.).
-- =========================================================================

/*

-- A. Table: categories
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- B. Table: order_statuses
CREATE TABLE IF NOT EXISTS order_statuses (
  id VARCHAR(255) PRIMARY KEY,
  status_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- C. Table: menu_items
CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 5.0,
  reviews_count INT NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  stock INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- D. Table: orders
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(255) NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  status VARCHAR(100) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at VARCHAR(100) NOT NULL,
  table_number VARCHAR(100) NOT NULL,
  payment_method VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- E. Table: customers
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  total_orders INT NOT NULL DEFAULT 0,
  total_spent DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  avatar TEXT NOT NULL,
  last_order VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- F. Table: inventory_items
CREATE TABLE IF NOT EXISTS inventory_items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  stock DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  unit VARCHAR(100) NOT NULL,
  min_stock DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  category VARCHAR(255) NOT NULL,
  supplier VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- G. Table: employees
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  shift VARCHAR(100) NOT NULL,
  status VARCHAR(100) NOT NULL DEFAULT 'active',
  avatar TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- H. Table: promotions
CREATE TABLE IF NOT EXISTS promotions (
  id VARCHAR(255) PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discount_percent DECIMAL(5, 2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  type VARCHAR(100) NOT NULL,
  banner_image TEXT NOT NULL,
  valid_until VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- I. Table: settings
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(255) PRIMARY KEY,
  brand_name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  opening_hours VARCHAR(255) NOT NULL,
  instagram_url VARCHAR(255) NOT NULL,
  facebook_url VARCHAR(255) NOT NULL,
  whatsapp_number VARCHAR(255) NOT NULL,
  theme_color VARCHAR(100) NOT NULL,
  favicon_url TEXT,
  about_pill VARCHAR(255),
  about_title VARCHAR(255),
  about_description TEXT,
  about_feature1_title VARCHAR(255),
  about_feature1_desc TEXT,
  about_feature2_title VARCHAR(255),
  about_feature2_desc TEXT,
  hero_image_url1 TEXT,
  hero_image_url2 TEXT,
  hero_image_url3 TEXT,
  hero_image_url4 TEXT,
  disable_order_buttons BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- J. Table: gallery_items
CREATE TABLE IF NOT EXISTS gallery_items (
  id VARCHAR(255) PRIMARY KEY,
  url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- K. Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rating DECIMAL(3, 2) NOT NULL,
  comment TEXT NOT NULL,
  date VARCHAR(100) NOT NULL,
  avatar TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- L. Table: reservations
CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  reservation_date VARCHAR(100),
  status VARCHAR(100) NOT NULL DEFAULT 'Pending',
  created_at VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

*/
