-- ==========================================
-- SAUGAAT SUPABASE DATABASE SETUP & SEED SCRIPT
-- Copy and paste this script directly into the 
-- Supabase SQL Editor and click "Run".
-- ==========================================

-- 1. CREATE TABLES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount_percentage INT DEFAULT 0,
  gst DECIMAL(5, 2) DEFAULT 18,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  points INT DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'Bronze Tier Member',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. ENABLE ROW LEVEL SECURITY & DEFINE BASIC POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist to avoid duplication errors
DROP POLICY IF EXISTS "Allow public read" ON public.categories;
DROP POLICY IF EXISTS "Allow public read" ON public.products;
DROP POLICY IF EXISTS "Allow public read" ON public.product_images;
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;

CREATE POLICY "Allow public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Allow users to read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- 3. TRUNCATE CURRENT DATA TO PREVENT DUPLICATE KEY ERRORS
TRUNCATE public.product_images, public.products, public.categories CASCADE;

-- 4. SEED CATEGORIES
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('c8a0cf66-9b1b-4d43-bb1e-7b79d20c562e', 'Home Decor', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', NULL, 1, 'Home Decor Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('05105e46-17b7-4c74-9f20-c9a3bf16a5b6', 'Wall Decor', 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', 'c8a0cf66-9b1b-4d43-bb1e-7b79d20c562e', 1, 'Wall Decor Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('91a78ee9-8f0a-4286-bfd4-1a3b93ee9ea8', 'Showpieces', 'https://images.unsplash.com/photo-1572186192734-1779ef884240?auto=format&fit=crop&q=80&w=800', 'c8a0cf66-9b1b-4d43-bb1e-7b79d20c562e', 2, 'Showpieces Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('4f27be08-5544-4860-98db-4e1e3b6fb6e0', 'Vases & Planters', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', 'c8a0cf66-9b1b-4d43-bb1e-7b79d20c562e', 3, 'Vases & Planters Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('8d601b0b-6a58-4ad0-b851-46df22ee9b6a', 'Idols', 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', NULL, 2, 'Idols Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('df2ea428-2ce1-46a3-bb24-9b247fdbb621', 'Ganesha Idols', 'https://images.unsplash.com/photo-1609137144813-2dbe4889bf65?auto=format&fit=crop&q=80&w=800', '8d601b0b-6a58-4ad0-b851-46df22ee9b6a', 1, 'Ganesha Idols Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('c7d5c7f8-7db1-4e4b-a25e-399a0ff39ef2', 'Krishna Idols', 'https://images.unsplash.com/photo-1561564730-22c60f785bc0?auto=format&fit=crop&q=80&w=800', '8d601b0b-6a58-4ad0-b851-46df22ee9b6a', 2, 'Krishna Idols Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('29df219d-7f41-4770-98de-b4fdf4ee9997', 'Festivals', 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800', NULL, 3, 'Festivals Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('8e100ee9-43c2-47de-84d4-53907ebf0923', 'Diwali', 'https://images.unsplash.com/photo-1510076857177-74700760b497?auto=format&fit=crop&q=80&w=800', '29df219d-7f41-4770-98de-b4fdf4ee9997', 1, 'Diwali Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('d2d2a450-466c-48c0-824c-b4db4f2e90c8', 'Holi', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800', '29df219d-7f41-4770-98de-b4fdf4ee9997', 2, 'Holi Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('a8f8d9db-60a6-43b8-936e-d2b38ef0a400', 'Toys', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', NULL, 4, 'Toys Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('df7b9e0a-0be9-4e78-bc4a-9b1d3ef9a823', 'Wooden Toys', 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800', 'a8f8d9db-60a6-43b8-936e-d2b38ef0a400', 1, 'Wooden Toys Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('d19fbda4-8b6d-4720-94e8-8a8b27346892', 'Educational Toys', 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=800', 'a8f8d9db-60a6-43b8-936e-d2b38ef0a400', 2, 'Educational Toys Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('688fe883-20eb-48f8-b3d6-444a8ff39fa2', 'Gift Packs', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', NULL, 5, 'Gift Packs Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('fae8d89e-4c7b-4d43-98db-1a92e8fa3910', 'Premium Gifts', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', '688fe883-20eb-48f8-b3d6-444a8ff39fa2', 1, 'Premium Gifts Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('b841a2b2-cc31-4c6e-82df-09fa4f8102a0', 'Combo Packs', 'https://images.unsplash.com/photo-1575549594211-8f328cf00a7b?auto=format&fit=crop&q=80&w=800', '688fe883-20eb-48f8-b3d6-444a8ff39fa2', 2, 'Combo Packs Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('c8d9dfdf-df4b-4a2a-b6ea-c3de9b10ee83', 'Return Gifts', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', NULL, 6, 'Return Gifts Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('278a7f92-56cd-4d8e-94e8-9dfba452eb8c', 'Wedding Favors', 'https://images.unsplash.com/photo-1602665742701-389671bc40c0?auto=format&fit=crop&q=80&w=800', 'c8d9dfdf-df4b-4a2a-b6ea-c3de9b10ee83', 1, 'Wedding Favors Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('ae9bca02-4c28-4442-9988-bb3b3cd8fa01', 'Party Favors', 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800', 'c8d9dfdf-df4b-4a2a-b6ea-c3de9b10ee83', 2, 'Party Favors Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('1fcfdbda-88d3-4f92-bd88-82df09ee3bfa', 'Just Like That', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', NULL, 7, 'Just Like That Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('ab9102c9-e74b-4882-94a2-cfdf290b200b', 'Mugs', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800', '1fcfdbda-88d3-4f92-bd88-82df09ee3bfa', 1, 'Mugs Collection');
INSERT INTO public.categories (id, name, image_url, parent_id, sort_order, description) VALUES 
  ('cd83cde2-5b6d-4340-9a2c-e3eb2a901ff2', 'Spontaneous Gifts', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', '1fcfdbda-88d3-4f92-bd88-82df09ee3bfa', 2, 'Spontaneous Gifts Collection');

-- 5. SEED PRODUCTS & IMAGES
-- [Product 1/70]: Brass Urli with Diyas
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Brass Urli with Diyas', 'A stunning brass urli perfect for floating candles and flowers. Handcrafted with traditional techniques by local artisans.', '91a78ee9-8f0a-4286-bfd4-1a3b93ee9ea8', 1299, 1599, 19, 18, true, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 2/70]: Ceramic Vases Trio
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000002', 'Ceramic Vases Trio', 'A set of three minimalist ceramic vases with elegant matte textures. Adds clean Nordic charm to any living room.', '4f27be08-5544-4860-98db-4e1e3b6fb6e0', 1899, 2499, 24, 18, true, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 3/70]: Terracotta Planters (3pcs)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000003', 'Terracotta Planters (3pcs)', 'Eco-friendly terracotta planters ideal for small indoor plants and succulents. Breathable natural clay.', '4f27be08-5544-4860-98db-4e1e3b6fb6e0', 449, 649, 31, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 4/70]: Handwoven Basket Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000004', 'Handwoven Basket Set', 'Traditional handwoven seagrass storage baskets. Functional for organization and beautiful as rustic decor. Set of 3 sizes.', '91a78ee9-8f0a-4286-bfd4-1a3b93ee9ea8', 1299, 1799, 28, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 5/70]: Brass Candle Holders (Pair)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000005', 'Brass Candle Holders (Pair)', 'Elegant brass candle holders with solid traditional bases. Perfect for a warm candlelit dining experience.', '91a78ee9-8f0a-4286-bfd4-1a3b93ee9ea8', 899, 1199, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 6/70]: Pendant Light Fixture
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000006', 'Pendant Light Fixture', 'Beautiful pendant hanging light with colorful glass mosaic pieces. Creates stunning patterns on walls when lit.', '05105e46-17b7-4c74-9f20-c9a3bf16a5b6', 2299, 2999, 23, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 7/70]: Geometric Metal Wall Art
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000007', 'Geometric Metal Wall Art', 'Contemporary gold-finished metal wall sculpture with sleek overlapping triangles. Easy mounting.', '05105e46-17b7-4c74-9f20-c9a3bf16a5b6', 1599, 2199, 27, 18, false, true, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 8/70]: Embroidered Macrame Wall Hanging
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000008', 'Embroidered Macrame Wall Hanging', 'Boho-chic hand-knotted cotton rope wall hanging with colorful geometric embroidery details.', '05105e46-17b7-4c74-9f20-c9a3bf16a5b6', 799, 1099, 27, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 9/70]: Floral Wooden Carved Panel
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000009', 'Floral Wooden Carved Panel', 'Intricately carved mango wood panel with distressed white finish. Vintage rustic wall statement.', '05105e46-17b7-4c74-9f20-c9a3bf16a5b6', 1499, 1999, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 10/70]: Luxury Marble Coasters (Set of 6)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000010', 'Luxury Marble Coasters (Set of 6)', 'Polished white and grey marble coasters with soft padded bottoms. Keeps surfaces water-ring free in style.', '91a78ee9-8f0a-4286-bfd4-1a3b93ee9ea8', 699, 999, 30, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 11/70]: Marble Ganesha Idol
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000011', 'Marble Ganesha Idol', 'Beautifully handcrafted pure white marble Ganesha idol with intricate gold painted detailing. Ideal for home temple.', 'df2ea428-2ce1-46a3-bb24-9b247fdbb621', 1499, 1999, 25, 18, true, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 12/70]: Krishna Flute Statue
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000012', 'Krishna Flute Statue', 'Elegant Krishna playing flute statue made from premium heavy resin. Rich bronze finish.', 'c7d5c7f8-7db1-4e4b-a25e-399a0ff39ef2', 799, 1099, 27, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 13/70]: Deity Figurine Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000013', 'Deity Figurine Set', 'Set of 5 small brass deity figurines including Ganesha, Lakshmi, Saraswati, Shiva, and Durga.', 'df2ea428-2ce1-46a3-bb24-9b247fdbb621', 1799, 2299, 22, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 14/70]: Brass Dancing Ganesha
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000014', 'Brass Dancing Ganesha', 'Heavyweight brass idol of Ganesha dancing in joy. Detailed craftsmanship capturing dynamic motion.', 'df2ea428-2ce1-46a3-bb24-9b247fdbb621', 2499, 3299, 24, 18, false, true, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1608976328321-2f9b8b9a2444?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 15/70]: Radha Krishna Love Statue
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000015', 'Radha Krishna Love Statue', 'Exquisite composite marble statue of Radha and Krishna standing under a tree. Symbol of eternal love.', 'c7d5c7f8-7db1-4e4b-a25e-399a0ff39ef2', 1899, 2499, 24, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1561564730-22c60f785bc0?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 16/70]: Terracotta Sitting Ganesha
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000016', 'Terracotta Sitting Ganesha', 'Rustic natural clay Ganesha figurine. Hand-molded by rural artisans using traditional firing methods.', 'df2ea428-2ce1-46a3-bb24-9b247fdbb621', 599, 799, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1609137144813-2dbe4889bf65?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 17/70]: Sandstone Meditating Buddha
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000017', 'Sandstone Meditating Buddha', 'Serene meditating Buddha statue carved in natural textured sandstone. Weatherproof for indoor and outdoor.', '8d601b0b-6a58-4ad0-b851-46df22ee9b6a', 1099, 1499, 27, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1542156822-6924d1a71aba?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 18/70]: Silver Plated Laxmi Ganesha Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000018', 'Silver Plated Laxmi Ganesha Set', 'Pure silver plated Ganesha and Lakshmi idols in an elegant presentation acrylic frame. Premium spiritual gift.', 'df2ea428-2ce1-46a3-bb24-9b247fdbb621', 1299, 1699, 24, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 19/70]: Makrana Marble Bal Gopal
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000019', 'Makrana Marble Bal Gopal', 'Adorable infant Krishna (Ladoo Gopal) sculpted in high quality Makrana marble and painted with vibrant colors.', 'c7d5c7f8-7db1-4e4b-a25e-399a0ff39ef2', 2999, 3999, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1561564730-22c60f785bc0?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 20/70]: Handcarved Wooden Krishna
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000020', 'Handcarved Wooden Krishna', 'Masterfully carved sandalwood Krishna figurine. Smells divine and showcases spectacular traditional woodwork.', 'c7d5c7f8-7db1-4e4b-a25e-399a0ff39ef2', 3499, 4499, 22, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1608976328321-2f9b8b9a2444?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 21/70]: Diwali Festive Pooja Thali
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000021', 'Diwali Festive Pooja Thali', 'Complete Pooja Thali set gold-plated with beautiful kundan border. Includes containers, a bell, and a diya.', '8e100ee9-43c2-47de-84d4-53907ebf0923', 899, 1299, 31, 18, true, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 22/70]: Brass Diyas Set (5pcs)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000022', 'Brass Diyas Set (5pcs)', 'Traditional heavy-gauge brass diyas with cotton wick holders. Perfect for festive illumination.', '8e100ee9-43c2-47de-84d4-53907ebf0923', 599, 799, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 23/70]: Lantern Decoration
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000023', 'Lantern Decoration', 'Hexagonal metal hanging lantern with red and orange colored glass windows. Beautiful shadow effects.', '8e100ee9-43c2-47de-84d4-53907ebf0923', 1299, 1699, 24, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 24/70]: Festival Fabric Pack
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000024', 'Festival Fabric Pack', 'Assorted pieces of brocade and silk fabrics with gold zari borders. Great for wrapping gifts or crafting decor.', '8e100ee9-43c2-47de-84d4-53907ebf0923', 549, 799, 31, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 25/70]: Organic Gulal Gift Box (Set of 4)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000025', 'Organic Gulal Gift Box (Set of 4)', 'Skin-friendly organic Holi colors made from beetroots, marigold, spinach, and turmeric. Zero chemicals.', 'd2d2a450-466c-48c0-824c-b4db4f2e90c8', 499, 699, 29, 18, false, true, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 26/70]: Herbal Holi Colors in Pouches
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000026', 'Herbal Holi Colors in Pouches', 'Soft non-toxic herbal gulal powders packed in eco-friendly handmade paper pouches. 100g each of 4 colors.', 'd2d2a450-466c-48c0-824c-b4db4f2e90c8', 299, 399, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000026', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 27/70]: Handcrafted Clay Diya Set (12pcs)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000027', 'Handcrafted Clay Diya Set (12pcs)', 'Vibrant handpainted clay diyas with colorful clay paints and glitter highlights. Bio-degradable.', '8e100ee9-43c2-47de-84d4-53907ebf0923', 349, 499, 30, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1510076857177-74700760b497?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 28/70]: Toran Door Hanging
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000028', 'Toran Door Hanging', 'Traditional door banner made of artificial yellow marigolds, green mango leaves, and golden bells.', '8e100ee9-43c2-47de-84d4-53907ebf0923', 699, 899, 22, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000028', 'https://images.unsplash.com/photo-1510076857177-74700760b497?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 29/70]: Pichkari and Gulal Combo Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000029', 'Pichkari and Gulal Combo Set', 'Classic metallic water pump shooter accompanied by 2 packs of organic herbal color. Kids festive fun.', 'd2d2a450-466c-48c0-824c-b4db4f2e90c8', 799, 1099, 27, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000029', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 30/70]: Festive Rangoli Stencils Kit
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000030', 'Festive Rangoli Stencils Kit', 'Set of 6 metal stencils with classic mandala and peacock designs along with 6 color powder squeezy bottles.', '8e100ee9-43c2-47de-84d4-53907ebf0923', 399, 599, 33, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000030', 'https://images.unsplash.com/photo-1510076857177-74700760b497?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 31/70]: Wooden Educational Toy Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000031', 'Wooden Educational Toy Set', 'Eco-friendly wooden balancing blocks and geometry stacking rings. Promotes fine motor skills in toddlers.', 'd19fbda4-8b6d-4720-94e8-8a8b27346892', 599, 899, 33, 18, false, true, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 32/70]: Puzzle Box Toy
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000032', 'Puzzle Box Toy', 'Handcrafted wooden secret locking puzzle box. A fun brain teaser that requires sliding steps to open.', 'd19fbda4-8b6d-4720-94e8-8a8b27346892', 349, 549, 36, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000032', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 33/70]: Building Blocks Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000033', 'Building Blocks Set', 'Colorful wooden building block set. Contains 50 pieces of various shapes with water-based non-toxic paint.', 'df7b9e0a-0be9-4e78-bc4a-9b1d3ef9a823', 749, 999, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000033', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 34/70]: Handpainted Wooden Peg Dolls
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000034', 'Handpainted Wooden Peg Dolls', 'Set of 6 custom painted wooden peg dolls representing a happy diverse family. Encourages open-ended play.', 'df7b9e0a-0be9-4e78-bc4a-9b1d3ef9a823', 499, 699, 29, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000034', 'https://images.unsplash.com/photo-1608460525763-dec1252078b5?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 35/70]: Montessori Shape Sorter
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000035', 'Montessori Shape Sorter', 'Solid wood cube box with multiple cutout shapes and 10 matching wooden geometry blocks. Classic childhood toy.', 'd19fbda4-8b6d-4720-94e8-8a8b27346892', 899, 1199, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000035', 'https://images.unsplash.com/photo-1545558014-8687977e90a1?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 36/70]: Wooden Balancing Cactus Game
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000036', 'Wooden Balancing Cactus Game', 'Family multiplayer game where players take turns adding branches to a wooden base cactus without tipping it over.', 'd19fbda4-8b6d-4720-94e8-8a8b27346892', 649, 849, 24, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000036', 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 37/70]: Forest Animals Wooden Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000037', 'Forest Animals Wooden Set', 'Chunky pine-wood figures of a bear, fox, deer, owl, squirrel, and rabbit. Safe for teething infants.', 'df7b9e0a-0be9-4e78-bc4a-9b1d3ef9a823', 999, 1399, 29, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000037', 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 38/70]: Wooden Alphabets Puzzle
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000038', 'Wooden Alphabets Puzzle', 'A large wooden board with alphabet slots. Lift-out letters reveal colored illustrations underneath.', 'd19fbda4-8b6d-4720-94e8-8a8b27346892', 549, 749, 27, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000038', 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 39/70]: Classic Wooden Toy Train Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000039', 'Classic Wooden Toy Train Set', '4-car wooden train with magnetic couplers. Connects smoothly to run on standard flat wooden tracks.', 'df7b9e0a-0be9-4e78-bc4a-9b1d3ef9a823', 1299, 1799, 28, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000039', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 40/70]: Handcrafted Wooden Rocking Horse
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000040', 'Handcrafted Wooden Rocking Horse', 'Heritage-quality solid teakwood rocking horse. Ergonomic seat handles and smooth curved bottom rails.', 'df7b9e0a-0be9-4e78-bc4a-9b1d3ef9a823', 3999, 4999, 20, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000040', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 41/70]: Premium Occasion Gift Pack
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000041', 'Premium Occasion Gift Pack', 'A luxurious curated paperboard gift pack filled with dark chocolates, organic honey, and a scented jar candle.', 'fae8d89e-4c7b-4d43-98db-1a92e8fa3910', 2499, 2999, 17, 18, false, true, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000041', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 42/70]: Surprise Coffee Mug Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000042', 'Surprise Coffee Mug Set', 'A spontaneous couple set of 2 dual-tone ceramic mugs accompanied by premium instant filter coffee powder sachets.', 'b841a2b2-cc31-4c6e-82df-09fa4f8102a0', 499, 699, 29, 18, false, true, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000042', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 43/70]: Sweets & Almonds Pack
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000043', 'Sweets & Almonds Pack', 'Elegant gift box containing premium kaju katli sweets and crispy roasted salted almonds in gold glass jars.', 'b841a2b2-cc31-4c6e-82df-09fa4f8102a0', 1899, 2399, 21, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000043', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 44/70]: Luxury Dry Fruits & Diya Hamper
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000044', 'Luxury Dry Fruits & Diya Hamper', 'A cane basket tray carrying 250g each of cashew, pistachio, almond, and walnut, and 2 polished brass oil lamps.', 'fae8d89e-4c7b-4d43-98db-1a92e8fa3910', 1599, 1999, 20, 18, true, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000044', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 45/70]: Royal Chocolate & Cookie Gift Box
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000045', 'Royal Chocolate & Cookie Gift Box', 'Handcrafted truffles, almond biscotti, and oatmeal cookies packed in a velvet lined chest box.', 'b841a2b2-cc31-4c6e-82df-09fa4f8102a0', 999, 1299, 23, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000045', 'https://images.unsplash.com/photo-1575549594211-8f328cf00a7b?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 46/70]: Organic Herbal Tea Collection Box
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000046', 'Organic Herbal Tea Collection Box', 'Assorted collection of chamomile, peppermint, jasmine, and tulsi tea bags in a partitioned wooden box.', 'b841a2b2-cc31-4c6e-82df-09fa4f8102a0', 899, 1199, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000046', 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 47/70]: Wellness & Spa Relaxation Hamper
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000047', 'Wellness & Spa Relaxation Hamper', 'Self-care hamper with lavender bath salts, apricot scrub, natural loofah, and a hand-poured soy wax candle.', 'fae8d89e-4c7b-4d43-98db-1a92e8fa3910', 2299, 2999, 23, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000047', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 48/70]: Corporate Desktop Organiser Hamper
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000048', 'Corporate Desktop Organiser Hamper', 'Professional gift set comprising a vegan leather diary, a metal ballpoint pen, and a wooden mobile stand.', 'fae8d89e-4c7b-4d43-98db-1a92e8fa3910', 1799, 2399, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000048', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 49/70]: Gourmet Snack & Dip Celebration Pack
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000049', 'Gourmet Snack & Dip Celebration Pack', 'Hamper with pita chips, nacho crisps, roasted garlic hummus jar, and spicy salsa dip. Ready to party.', 'b841a2b2-cc31-4c6e-82df-09fa4f8102a0', 1299, 1699, 24, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000049', 'https://images.unsplash.com/photo-1575549594211-8f328cf00a7b?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 50/70]: Maharaja Gold Gift Hamper
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000050', 'Maharaja Gold Gift Hamper', 'Ultramodern festive hamper with gold-plated dry fruit bowls, premium saffron pack, and silver coin. Truly royal.', 'fae8d89e-4c7b-4d43-98db-1a92e8fa3910', 4999, 5999, 17, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000050', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 51/70]: Set of 10 Assorted Potlis
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000051', 'Set of 10 Assorted Potlis', 'Elegant silk and organza potli bags with gold drawstring tassels, perfect as wedding and baby shower return gifts.', '278a7f92-56cd-4d8e-94e8-9dfba452eb8c', 999, 1499, 33, 18, false, true, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000051', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 52/70]: Handcrafted Shubh Labh Hangings
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000052', 'Handcrafted Shubh Labh Hangings', 'Traditional door side hangings featuring colorful felt base, beads, pom-poms, and brass-finished Shubh-Labh lettering.', '278a7f92-56cd-4d8e-94e8-9dfba452eb8c', 399, 599, 33, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000052', 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 53/70]: Scented Votive Candles (Set of 6)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000053', 'Scented Votive Candles (Set of 6)', 'Assorted aromatic votive candles in jasmine, rose, lavender, lemongrass, vanilla, and sandalwood scents.', 'ae9bca02-4c28-4442-9988-bb3b3cd8fa01', 599, 799, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000053', 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 54/70]: Silver Plated Coin in Velvet Box
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000054', 'Silver Plated Coin in Velvet Box', '10g silver plated coin depicting Ganesha and Lakshmi, safely housed in a rich royal red velvet flip-top box.', '278a7f92-56cd-4d8e-94e8-9dfba452eb8c', 799, 1099, 27, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000054', 'https://images.unsplash.com/photo-1606744837616-a3c61b6bd51a?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 55/70]: Miniature Meenakari Boxes (Set of 4)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000055', 'Miniature Meenakari Boxes (Set of 4)', 'Beautiful zinc alloy pill or jewelry boxes decorated with colorful traditional Rajasthani Meenakari paint work.', '278a7f92-56cd-4d8e-94e8-9dfba452eb8c', 899, 1199, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000055', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 56/70]: Personalized Leather Keyrings (Pack of 5)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000056', 'Personalized Leather Keyrings (Pack of 5)', 'Grained tan leather loop keyrings with strong stainless steel rings. Sleek corporate return gift.', 'ae9bca02-4c28-4442-9988-bb3b3cd8fa01', 699, 999, 30, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000056', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 57/70]: Assorted Handmade Soap Bars (Set of 4)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000057', 'Assorted Handmade Soap Bars (Set of 4)', 'Cold-pressed organic glycerine soaps infused with essential oils of aloe vera, honey-oatmeal, rose, and charcoal.', 'ae9bca02-4c28-4442-9988-bb3b3cd8fa01', 449, 599, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000057', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 58/70]: Wooden Coasters with Stand (Pack of 4)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000058', 'Wooden Coasters with Stand (Pack of 4)', 'Mango wood coasters with engraved traditional rangoli carvings, complete with a matched holder stand.', 'ae9bca02-4c28-4442-9988-bb3b3cd8fa01', 499, 699, 29, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000058', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 59/70]: Decorative Kankavati (Sindoor Box)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000059', 'Decorative Kankavati (Sindoor Box)', 'Brass shell-shaped container with cover lid used for kumkum or Roli during ceremonies. Elegant return favor.', '278a7f92-56cd-4d8e-94e8-9dfba452eb8c', 299, 399, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000059', 'https://images.unsplash.com/photo-1602665742701-389671bc40c0?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 60/70]: Embroidered Silk Clutches (Pack of 3)
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000060', 'Embroidered Silk Clutches (Pack of 3)', 'Beautiful envelope style clutches in raw silk fabric with traditional floral embroidery. Great for wedding guests.', '278a7f92-56cd-4d8e-94e8-9dfba452eb8c', 1499, 1999, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000060', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 61/70]: Handpainted Ceramic Tea Mug
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000061', 'Handpainted Ceramic Tea Mug', 'Charming ceramic mug painted with cheerful blue pottery daisies. Large comfortable grip handle.', 'ab9102c9-e74b-4882-94a2-cfdf290b200b', 349, 499, 30, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000061', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 62/70]: Pastel Ceramic Coffee Mug
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000062', 'Pastel Ceramic Coffee Mug', 'Elegant matte finish mug in blush pink color. Double-walled insulation keeps your coffee hot longer.', 'ab9102c9-e74b-4882-94a2-cfdf290b200b', 399, 549, 27, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000062', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 63/70]: Motivational Quotes Mug
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000063', 'Motivational Quotes Mug', 'White ceramic mug featuring bold inspire-your-day typographic quotes. Microwave and dishwasher safe.', 'ab9102c9-e74b-4882-94a2-cfdf290b200b', 299, 399, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000063', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 64/70]: Handcrafted Leather Notebook
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000064', 'Handcrafted Leather Notebook', 'Saddle leather cover notebook filled with 120 pages of eco-friendly recycled cotton unruled papers. Vintage look.', 'cd83cde2-5b6d-4340-9a2c-e3eb2a901ff2', 449, 599, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000064', 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 65/70]: Rose Scented Soy Candle in Jar
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000065', 'Rose Scented Soy Candle in Jar', 'Therapeutic soy wax candle infused with natural damask rose petals oil. Burn time approx 30 hours.', 'cd83cde2-5b6d-4340-9a2c-e3eb2a901ff2', 499, 699, 29, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000065', 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 66/70]: Brass Bookmark & Pen Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000066', 'Brass Bookmark & Pen Set', 'Sleek geometric brass bookmark clip accompanied by a fine-tip luxury black ink gel pen. Gift box included.', 'cd83cde2-5b6d-4340-9a2c-e3eb2a901ff2', 799, 999, 20, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000066', 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 67/70]: Pocket Perfume Roll-On Set
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000067', 'Pocket Perfume Roll-On Set', 'Travel-friendly set of 3 roll-on scents: fresh ocean breeze, citrus wood, and floral amber. Alcohol-free.', 'cd83cde2-5b6d-4340-9a2c-e3eb2a901ff2', 599, 799, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000067', 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 68/70]: Minimalist Key Organiser
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000068', 'Minimalist Key Organiser', 'Genuine leather sleeve that holds up to 6 keys in a silent stacked layout. No pocket jingling.', 'cd83cde2-5b6d-4340-9a2c-e3eb2a901ff2', 349, 499, 30, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000068', 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 69/70]: Ceramic Mug with Wooden Lid
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000069', 'Ceramic Mug with Wooden Lid', 'Sleek speckled white mug complete with a dark walnut wooden lid cover that doubles as a coaster.', 'ab9102c9-e74b-4882-94a2-cfdf290b200b', 499, 649, 23, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000069', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', true, 0);

-- [Product 70/70]: Lavender Pillow Mist & Eye Mask
INSERT INTO public.products (id, name, description, category_id, price, original_price, discount_percentage, gst, is_bestseller, is_trending, status) VALUES
  ('e0000000-0000-0000-0000-000000000070', 'Lavender Pillow Mist & Eye Mask', 'Soothing lavender essential oil spray for linens paired with a soft padded satin sleep eye mask.', 'cd83cde2-5b6d-4340-9a2c-e3eb2a901ff2', 899, 1199, 25, 18, false, false, 'active');
INSERT INTO public.product_images (product_id, image_url, is_featured, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000070', 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800', true, 0);

