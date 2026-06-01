import { supabase } from './supabase';
import { seedCategories, seedProducts } from '../data/seedData';

// This function sets up the database schema and seed data
// Run this ONCE to initialize your database
export async function setupDatabase() {
  if (!supabase) {
    console.error('Supabase not initialized');
    return;
  }

  try {
    // Create categories table
    try {
      await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS categories (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            image_url TEXT,
            parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
        `
      });
    } catch (e) {
      console.warn('Could not execute categories SQL directly via RPC:', e);
    }

    // Create products table
    try {
      await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            category_id UUID NOT NULL REFERENCES categories(id),
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
          CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
          CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller);
          CREATE INDEX IF NOT EXISTS idx_products_trending ON products(is_trending);
        `
      });
    } catch (e) {
      console.warn('Could not execute products SQL directly via RPC:', e);
    }

    // Create product_images table
    try {
      await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS product_images (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            is_featured BOOLEAN DEFAULT FALSE,
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
        `
      });
    } catch (e) {
      console.warn('Could not execute images SQL directly via RPC:', e);
    }

    console.log('Database tables created successfully');

    // Seed categories
    for (const category of seedCategories) {
      try {
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('name', category.name)
          .single();

        if (!existing) {
          const { error } = await supabase
            .from('categories')
            .insert([category]);
          if (error) {
            console.error(`Error seeding category ${category.name}:`, error);
          }
        }
      } catch (err) {
        console.error(`Error seeding category ${category.name}:`, err);
      }
    }

    console.log('Categories seeded successfully');

    // Seed products
    for (const product of seedProducts) {
      try {
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('name', product.name)
          .single();

        if (!existing) {
          const discount = product.original_price
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : 0;

          const { error } = await supabase
            .from('products')
            .insert([{
              ...product,
              discount_percentage: discount
            }]);
          if (error) {
            console.error(`Error seeding product ${product.name}:`, error);
          }
        }
      } catch (err) {
        console.error(`Error seeding product ${product.name}:`, err);
      }
    }

    console.log('Products seeded successfully');
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Alternative: Use this if your Supabase plan allows direct SQL execution
// For most users, you'll need to use the Supabase dashboard to run these SQL queries
export const setupSql = `
-- Run these SQL queries in your Supabase dashboard (SQL Editor)

-- Create categories table
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

CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);

-- Create products table
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

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON public.products(is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_trending ON public.products(is_trending);

-- Create product_images table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Allow public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated admin insert" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated admin update" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated admin delete" ON public.categories FOR DELETE USING (true);

-- RLS Policies for products
CREATE POLICY "Allow public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated admin insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated admin update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated admin delete" ON public.products FOR DELETE USING (true);

-- RLS Policies for product_images
CREATE POLICY "Allow public read" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Allow authenticated admin insert" ON public.product_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated admin delete" ON public.product_images FOR DELETE USING (true);
`;
