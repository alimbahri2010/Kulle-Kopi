-- ==========================================
-- SUPABASE POSTGRESQL CAMELCASE SCHEMA
-- Copy and paste this script into your Supabase SQL Editor
-- (Dashboard > SQL Editor > New query)
-- ==========================================

-- Drop tables if they already exist (uncomment if you want to rebuild)
-- DROP TABLE IF EXISTS "Reservation" CASCADE;
-- DROP TABLE IF EXISTS "Review" CASCADE;
-- DROP TABLE IF EXISTS "GalleryItem" CASCADE;
-- DROP TABLE IF EXISTS "CafeSettings" CASCADE;
-- DROP TABLE IF EXISTS "Promotion" CASCADE;
-- DROP TABLE IF EXISTS "Employee" CASCADE;
-- DROP TABLE IF EXISTS "InventoryItem" CASCADE;
-- DROP TABLE IF EXISTS "Customer" CASCADE;
-- DROP TABLE IF EXISTS "Order" CASCADE;
-- DROP TABLE IF EXISTS "MenuItem" CASCADE;

-- 1. "MenuItem" Table
CREATE TABLE IF NOT EXISTS "MenuItem" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL CHECK ("category" IN ('black coffee', 'white coffee', 'non kopi', 'juice', 'makanan berat', 'makanan ringan')),
  "price" NUMERIC NOT NULL,
  "rating" NUMERIC NOT NULL DEFAULT 5.0,
  "reviewsCount" INTEGER NOT NULL DEFAULT 0,
  "image" TEXT NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
  "stock" INTEGER NOT NULL DEFAULT 0
);

-- 2. "Order" Table
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "items" JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of OrderItem
  "total" NUMERIC NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN ('pending', 'processing', 'completed', 'cancelled')),
  "notes" TEXT,
  "createdAt" TEXT NOT NULL,
  "tableNumber" TEXT NOT NULL,
  "paymentMethod" TEXT NOT NULL CHECK ("paymentMethod" IN ('cash', 'card', 'qris'))
);

-- 3. "Customer" Table
CREATE TABLE IF NOT EXISTS "Customer" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "totalOrders" INTEGER NOT NULL DEFAULT 0,
  "totalSpent" NUMERIC NOT NULL DEFAULT 0.00,
  "avatar" TEXT NOT NULL,
  "lastOrder" TEXT NOT NULL
);

-- 4. "InventoryItem" Table
CREATE TABLE IF NOT EXISTS "InventoryItem" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "stock" NUMERIC NOT NULL DEFAULT 0,
  "unit" TEXT NOT NULL,
  "minStock" NUMERIC NOT NULL DEFAULT 0,
  "category" TEXT NOT NULL,
  "supplier" TEXT NOT NULL
);

-- 5. "Employee" Table
CREATE TABLE IF NOT EXISTS "Employee" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL CHECK ("role" IN ('Admin', 'Barista', 'Chef', 'Waiter', 'Cashier')),
  "email" TEXT NOT NULL,
  "shift" TEXT NOT NULL CHECK ("shift" IN ('Morning (07:00 - 15:00)', 'Evening (15:00 - 23:00)', 'Full Time')),
  "status" TEXT NOT NULL CHECK ("status" IN ('active', 'inactive')),
  "avatar" TEXT NOT NULL
);

-- 6. "Promotion" Table
CREATE TABLE IF NOT EXISTS "Promotion" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "discountPercent" NUMERIC NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "type" TEXT NOT NULL CHECK ("type" IN ('discount', 'event', 'campaign')),
  "bannerImage" TEXT NOT NULL,
  "validUntil" TEXT NOT NULL
);

-- 7. "CafeSettings" Table
CREATE TABLE IF NOT EXISTS "CafeSettings" (
  "id" TEXT PRIMARY KEY DEFAULT 'current_settings',
  "brandName" TEXT NOT NULL,
  "tagline" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "contactPhone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "openingHours" TEXT NOT NULL,
  "instagramUrl" TEXT NOT NULL,
  "facebookUrl" TEXT NOT NULL,
  "whatsappNumber" TEXT NOT NULL,
  "themeColor" TEXT NOT NULL,
  "faviconUrl" TEXT,
  "aboutPill" TEXT,
  "aboutTitle" TEXT,
  "aboutDescription" TEXT,
  "aboutFeature1Title" TEXT,
  "aboutFeature1Desc" TEXT,
  "aboutFeature2Title" TEXT,
  "aboutFeature2Desc" TEXT,
  "heroImageUrl1" TEXT,
  "heroImageUrl2" TEXT,
  "heroImageUrl3" TEXT,
  "heroImageUrl4" TEXT,
  "disableOrderButtons" BOOLEAN DEFAULT false
);

-- 8. "GalleryItem" Table
CREATE TABLE IF NOT EXISTS "GalleryItem" (
  "id" TEXT PRIMARY KEY,
  "url" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL
);

-- 9. "Review" Table
CREATE TABLE IF NOT EXISTS "Review" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "rating" NUMERIC NOT NULL,
  "comment" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "avatar" TEXT NOT NULL
);

-- 10. "Reservation" Table
CREATE TABLE IF NOT EXISTS "Reservation" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "reservationDate" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Pending' CHECK ("status" IN ('Pending', 'Dikonfirmasi', 'Dihubungi', 'Dibatalkan')),
  "createdAt" TEXT NOT NULL
);

-- ==========================================
-- ENABLE RLS ON ALL TABLES FOR SECURITY
-- ==========================================
ALTER TABLE "MenuItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InventoryItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Employee" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Promotion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CafeSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reservation" ENABLE ROW LEVEL SECURITY;

-- Create Policies (Read-Only access for anyone, Full access for authenticated Admins)
-- Note: Adjust based on your authentication needs

-- MenuItem Policies
CREATE POLICY "Allow public read MenuItem" ON "MenuItem" FOR SELECT TO public USING (true);
CREATE POLICY "Allow full auth MenuItem" ON "MenuItem" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Order Policies
CREATE POLICY "Allow public read Order" ON "Order" FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert Order" ON "Order" FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow full auth Order" ON "Order" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Customer Policies
CREATE POLICY "Allow full auth Customer" ON "Customer" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert Customer" ON "Customer" FOR INSERT TO public WITH CHECK (true);

-- InventoryItem Policies
CREATE POLICY "Allow full auth InventoryItem" ON "InventoryItem" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Employee Policies
CREATE POLICY "Allow full auth Employee" ON "Employee" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Promotion Policies
CREATE POLICY "Allow public read Promotion" ON "Promotion" FOR SELECT TO public USING (true);
CREATE POLICY "Allow full auth Promotion" ON "Promotion" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- CafeSettings Policies
CREATE POLICY "Allow public read CafeSettings" ON "CafeSettings" FOR SELECT TO public USING (true);
CREATE POLICY "Allow full auth CafeSettings" ON "CafeSettings" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- GalleryItem Policies
CREATE POLICY "Allow public read GalleryItem" ON "GalleryItem" FOR SELECT TO public USING (true);
CREATE POLICY "Allow full auth GalleryItem" ON "GalleryItem" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Review Policies
CREATE POLICY "Allow public read Review" ON "Review" FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert Review" ON "Review" FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow full auth Review" ON "Review" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Reservation Policies
CREATE POLICY "Allow public insert Reservation" ON "Reservation" FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow full auth Reservation" ON "Reservation" FOR ALL TO authenticated USING (true) WITH CHECK (true);
