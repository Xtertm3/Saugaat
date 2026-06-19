import { supabase } from './supabase';
import { seedCategories, seedProducts, seedProductImages } from '../data/seedData';

// Slugify helper to match slugs used in seed categories/products
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w -]+/g, '')
    .trim()
    .replace(/ +/g, '-');
}

// Sets up the database schema (if RPC execute_sql is available) and seeds categories, products, and images.
export async function setupDatabase(options: { purgeFirst?: boolean } = {}) {
  if (!supabase) {
    console.error('Supabase not initialized');
    return { success: false, message: 'Supabase client is not configured' };
  }

  const { purgeFirst = false } = options;
  console.log(`Starting database setup (Purge: ${purgeFirst})...`);

  try {
    // 1. Create tables if execute_sql RPC is available
    const tableQueries = [
      {
        name: 'categories',
        sql: `
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
        `
      },
      {
        name: 'products',
        sql: `
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
        `
      },
      {
        name: 'product_images',
        sql: `
          CREATE TABLE IF NOT EXISTS public.product_images (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            is_featured BOOLEAN DEFAULT FALSE,
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
        `
      },
      {
        name: 'profiles',
        sql: `
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email VARCHAR(255) NOT NULL,
            points INT DEFAULT 0,
            tier VARCHAR(50) DEFAULT 'Bronze Tier Member',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `
      }
    ];

    for (const q of tableQueries) {
      try {
        await supabase.rpc('execute_sql', { sql: q.sql });
        console.log(`Table '${q.name}' schema verified/created via RPC`);
      } catch (e) {
        console.warn(`Could not verify/create table '${q.name}' via RPC (this is normal if RPC is not configured):`, e);
      }
    }

    // 2. Clean/purge old database tables if requested
    if (purgeFirst) {
      console.log('Purging existing product_images, products, and categories tables...');
      // product_images CASCADE deletes when products are deleted, but let's clear it explicitly
      await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      console.log('Database purge complete.');
    }

    // 3. Seed Categories with correct parent-child UUID mapping
    const categoryMap: { [slug: string]: string } = {};

    // A. Seed parents first (parent_id is null)
    const parents = seedCategories.filter(c => c.parent_id === null);
    for (const cat of parents) {
      const slug = slugify(cat.name);
      
      // Check if category already exists
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('name', cat.name)
        .maybeSingle();

      if (existing) {
        categoryMap[slug] = existing.id;
      } else {
        const { data: inserted, error } = await supabase
          .from('categories')
          .insert([{
            name: cat.name,
            image_url: cat.image_url,
            parent_id: null,
            sort_order: cat.sort_order
          }])
          .select('id')
          .single();

        if (error) {
          console.error(`Error inserting parent category ${cat.name}:`, error);
        } else if (inserted) {
          categoryMap[slug] = inserted.id;
        }
      }
    }

    // B. Seed children (parent_id is not null)
    const children = seedCategories.filter(c => c.parent_id !== null);
    for (const cat of children) {
      const slug = slugify(cat.name);
      const parentSlug = slugify(cat.parent_id as string);
      const parentUuid = categoryMap[parentSlug] || null;

      if (!parentUuid) {
        console.warn(`Skipping category ${cat.name}: parent slug '${parentSlug}' not found in inserted map.`);
        continue;
      }

      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('name', cat.name)
        .maybeSingle();

      if (existing) {
        categoryMap[slug] = existing.id;
      } else {
        const { data: inserted, error } = await supabase
          .from('categories')
          .insert([{
            name: cat.name,
            image_url: cat.image_url,
            parent_id: parentUuid,
            sort_order: cat.sort_order
          }])
          .select('id')
          .single();

        if (error) {
          console.error(`Error inserting child category ${cat.name}:`, error);
        } else if (inserted) {
          categoryMap[slug] = inserted.id;
        }
      }
    }

    console.log('Categories seeded and mapped:', Object.keys(categoryMap).length);

    // 4. Seed Products and their corresponding images
    let productSeedCount = 0;
    let imageSeedCount = 0;

    for (const prod of seedProducts) {
      const catSlug = slugify(prod.category_id);
      const categoryUuid = categoryMap[catSlug];

      if (!categoryUuid) {
        console.warn(`Skipping product ${prod.name}: Category slug '${catSlug}' not found in category map.`);
        continue;
      }

      // Check if product already exists
      let productUuid = '';
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('name', prod.name)
        .maybeSingle();

      if (existing) {
        productUuid = existing.id;
      } else {
        const discount = prod.original_price
          ? Math.round(((prod.original_price - prod.price) / prod.original_price) * 100)
          : 0;

        const { data: inserted, error } = await supabase
          .from('products')
          .insert([{
            name: prod.name,
            description: prod.description,
            category_id: categoryUuid,
            price: prod.price,
            original_price: prod.original_price,
            discount_percentage: discount,
            gst: prod.gst || 18,
            is_bestseller: prod.is_bestseller || false,
            is_trending: prod.is_trending || false,
            status: prod.status || 'active'
          }])
          .select('id')
          .single();

        if (error) {
          console.error(`Error inserting product ${prod.name}:`, error);
          continue;
        } else if (inserted) {
          productUuid = inserted.id;
          productSeedCount++;
        }
      }

      if (productUuid) {
        // Seed images for this product if not already seeded
        const imgMatch = seedProductImages.find(img => img.product_name === prod.name);
        const imagesList = imgMatch ? imgMatch.images : ['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800'];

        for (let i = 0; i < imagesList.length; i++) {
          const imgUrl = imagesList[i];
          
          // Check if image already exists for this product
          const { data: existingImg } = await supabase
            .from('product_images')
            .select('id')
            .eq('product_id', productUuid)
            .eq('image_url', imgUrl)
            .maybeSingle();

          if (!existingImg) {
            const { error: imgErr } = await supabase
              .from('product_images')
              .insert([{
                product_id: productUuid,
                image_url: imgUrl,
                is_featured: i === 0,
                display_order: i
              }]);
            
            if (imgErr) {
              console.error(`Error seeding image for product ${prod.name}:`, imgErr);
            } else {
              imageSeedCount++;
            }
          }
        }
      }
    }

    console.log(`Products seeded: ${productSeedCount}. Images seeded: ${imageSeedCount}.`);
    return {
      success: true,
      message: `Database seeded successfully! Created ${productSeedCount} new products and ${imageSeedCount} images.`
    };
  } catch (error: any) {
    console.error('Error setting up/seeding database:', error);
    return {
      success: false,
      message: error.message || 'Unknown database setup error'
    };
  }
}
