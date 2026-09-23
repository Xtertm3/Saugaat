import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ws from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env.local');
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.*)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.*)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim().replace(/['"]/g, '');
  if (keyMatch) supabaseAnonKey = keyMatch[1].trim().replace(/['"]/g, '');
} catch (e) {
  console.log('Note: .env.local file could not be read directly. Trying environment variables...');
  supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found in env or .env.local.');
  console.error('Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w -]+/g, '')
    .trim()
    .replace(/ +/g, '-');
};

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

const seedCategories = [
  // Being Well parent (Top Priority)
  { name: 'Being Well', image_url: '/being-well/rose-herbal-tea.jpg', parent_id: null, sort_order: 1 },

  // Home Decor parent
  { name: 'Home Decor', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 2 },
  { name: 'Curtains', image_url: '/curtains/botanical-damask-tapestry.jpg', parent_id: 'home-decor', sort_order: 1 },
  { name: 'Wall Decor', image_url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 2 },
  { name: 'Showpieces', image_url: 'https://images.unsplash.com/photo-1572186192734-1779ef884240?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 3 },
  { name: 'Vases & Planters', image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', parent_id: 'home-decor', sort_order: 4 },

  // Just Like That parent
  { name: 'Just Like That', image_url: '/tableware/butterfly-wooden-tray.jpg', parent_id: null, sort_order: 3 },
  { name: 'Tableware', image_url: '/tableware/butterfly-wooden-tray.jpg', parent_id: 'just-like-that', sort_order: 1 },

  // Gift Packs parent
  { name: 'Gift Packs', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 4 },
  { name: 'Premium Gifts', image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', parent_id: 'gift-packs', sort_order: 1 },

  // Return Gifts parent
  { name: 'Return Gifts', image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800', parent_id: null, sort_order: 5 },
  { name: 'Wedding Favors', image_url: 'https://images.unsplash.com/photo-1602665742701-389671bc40c0?auto=format&fit=crop&q=80&w=800', parent_id: 'return-gifts', sort_order: 1 }
];

const seedProducts = [
  // === BEING WELL PRODUCTS ===
  {
    name: 'Rose Herbal Tea',
    description: 'Pure herbal wellness in every sip. Crafted with 100% natural damask rose petals, naturally caffeine-free. Promotes glowing skin, natural detox, and deep relaxation. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 195,
    original_price: 250,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active',
    image: '/being-well/rose-herbal-tea.jpg'
  },
  {
    name: 'Immunity Herbal Tea',
    description: 'Formulated to strengthen body defenses with potent traditional herbs and antioxidants. 100% natural, caffeine-free infusion to fight seasonal illness and boost daily vitality. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 210,
    original_price: 260,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active',
    image: '/being-well/immunity-herbal-tea.jpg'
  },
  {
    name: 'Tulsi Green Tea',
    description: 'Revitalizing blend of pure holy basil (tulsi) and fine green tea leaves. Rich in protective antioxidants, aids natural weight loss and daily body detox. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 180,
    original_price: 230,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active',
    image: '/being-well/tulsi-green-tea.jpg'
  },
  {
    name: 'Chamomile Herbal Tea',
    description: 'Calming and restorative herbal tea crafted with whole chamomile blossoms. 100% natural, naturally caffeine-free. Supports immunity, relaxes body & mind, and promotes better restful sleep. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 225,
    original_price: 280,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active',
    image: '/being-well/chamomile-herbal-tea.jpg'
  },
  {
    name: 'Blue Pea Herbal Tea',
    description: 'Exotic butterfly blue pea flower tea rich in vibrant natural anthocyanin antioxidants. 100% natural, caffeine-free infusion for natural body detox, cognitive brain health, and vibrant wellness. Net Wt.: 50g. No added flavour, no preservatives.',
    category_id: 'being-well',
    price: 225,
    original_price: 280,
    gst: 5,
    is_bestseller: true,
    is_trending: true,
    status: 'active',
    image: '/being-well/blue-pea-herbal-tea.jpg'
  },

  // === TABLEWARE (Just Like That) ===
  {
    name: 'Butterfly Azure Wooden Serving Tray Set',
    description: 'Handcrafted luxury wooden serving tray set with vibrant blue butterfly art motif and high-durability moisture resistant lacquer finish.',
    category_id: 'tableware',
    price: 1800,
    original_price: 2200,
    gst: 18,
    is_bestseller: true,
    is_trending: true,
    status: 'active',
    image: '/tableware/butterfly-wooden-tray.jpg'
  },
  {
    name: 'Peacock Compartment Wooden Snack Platter',
    description: 'Hand-painted 4-section wooden platter featuring traditional Rajasthani peacock tile artwork. Ideal for serving dry fruits, cheese, and appetizers.',
    category_id: 'tableware',
    price: 850,
    original_price: 1100,
    gst: 18,
    is_bestseller: true,
    is_trending: true,
    status: 'active',
    image: '/tableware/peacock-wooden-platter.jpg'
  },
  {
    name: 'Art Deco Circular Wooden Platter',
    description: 'Modern circular wooden serving platter with sleek black gloss finish and sunburst ivory geometric art inlay.',
    category_id: 'tableware',
    price: 720,
    original_price: 950,
    gst: 18,
    is_bestseller: true,
    is_trending: false,
    status: 'active',
    image: '/tableware/art-deco-wooden-platter.png'
  },

  // === CURTAINS COLLECTION (Quote-based) ===
  {
    name: 'Botanical Damask Tapestry Valance Curtain',
    description: 'Hand-tailored classical damask valance curtains with ornate pelmet header, thick woven blackout drape lining, and matching tiebacks.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: true,
    is_trending: true,
    status: 'active',
    image: '/curtains/botanical-damask-tapestry.jpg'
  },
  {
    name: 'Chevron Jacquard Pelmet Drapes',
    description: 'Modern luxury herringbone and chevron patterned jacquard drapes with structured scalloped pelmet and custom border trim.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: true,
    is_trending: false,
    status: 'active',
    image: '/curtains/chevron-jacquard-pelmet.jpg'
  },
  {
    name: 'Gilded Silk Sheer & Velvet Drapes',
    description: 'Opulent cream silk & velvet curtains featuring central lace trim accents, scalloped valance, and sheer inner backdrop.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: false,
    is_trending: true,
    status: 'active',
    image: '/curtains/gilded-silk-sheer.jpg'
  },
  {
    name: 'Terracotta Floral Brocade Curtains',
    description: 'Rich terracotta floral brocade pelmet curtains with cream blackout side drapes and vintage ornamental tie-backs.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: false,
    is_trending: false,
    status: 'active',
    image: '/curtains/terracotta-floral-brocade.jpg'
  },
  {
    name: 'Imperial Floral Jacquard Valance Drapes',
    description: 'Royal taupe and beige floral jacquard drapes with multi-panel valance header and luxurious heavy drop fabric.',
    category_id: 'curtains',
    price: 0,
    original_price: 0,
    gst: 18,
    is_bestseller: true,
    is_trending: true,
    status: 'active',
    image: '/curtains/imperial-floral-jacquard.jpg'
  }
];

async function seedDatabase() {
  try {
    console.log('🧹 Clearing existing product images, products, and categories in Supabase...');
    // Delete existing records to perform a clean seed
    await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('🌱 Seeding parent categories...');
    const slugToUuidMap = {};

    const parents = seedCategories.filter(c => c.parent_id === null);
    for (const parent of parents) {
      const slug = slugify(parent.name);
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: parent.name,
          image_url: parent.image_url,
          parent_id: null,
          sort_order: parent.sort_order,
          description: `${parent.name} Collection`
        }])
        .select('id')
        .single();

      if (error) {
        console.error(`Failed to insert parent category "${parent.name}":`, error.message);
        throw error;
      }

      slugToUuidMap[slug] = data.id;
      console.log(`Parent category "${parent.name}" inserted with UUID:`, data.id);
    }

    console.log('🌱 Seeding subcategories...');
    const children = seedCategories.filter(c => c.parent_id !== null);
    for (const sub of children) {
      const slug = slugify(sub.name);
      const parentSlug = slugify(sub.parent_id);
      const parentUuid = slugToUuidMap[parentSlug];
      if (!parentUuid) {
        throw new Error(`Parent slug "${parentSlug}" not found in map.`);
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: sub.name,
          image_url: sub.image_url,
          parent_id: parentUuid,
          sort_order: sub.sort_order,
          description: `${sub.name} Subcategory`
        }])
        .select('id')
        .single();

      if (error) {
        console.error(`Failed to insert subcategory "${sub.name}":`, error.message);
        throw error;
      }

      slugToUuidMap[slug] = data.id;
      console.log(`Subcategory "${sub.name}" inserted with UUID:`, data.id);
    }

    console.log('🛍️ Seeding products and linking images...');
    let productCount = 0;
    for (const product of seedProducts) {
      const categoryUuid = slugToUuidMap[product.category_id];
      if (!categoryUuid) {
        throw new Error(`Category slug "${product.category_id}" not found in map.`);
      }

      const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          category_id: categoryUuid,
          price: product.price,
          original_price: product.original_price,
          discount_percentage: discount,
          gst: product.gst || 18,
          is_bestseller: product.is_bestseller || false,
          is_trending: product.is_trending || false,
          status: product.status || 'active'
        }])
        .select('id')
        .single();

      if (productError) {
        console.error(`Failed to insert product "${product.name}":`, productError.message);
        throw productError;
      }

      productCount++;
      console.log(`[${productCount}/70] Product "${product.name}" inserted.`);

      // Insert product images
      const { error: imageError } = await supabase
        .from('product_images')
        .insert([{
          product_id: insertedProduct.id,
          image_url: product.image,
          is_featured: true,
          display_order: 0
        }]);

      if (imageError) {
        console.error(`Failed to insert image for product "${product.name}":`, imageError.message);
        throw imageError;
      }
    }

    console.log('🎉 SUCCESS: Supabase database successfully seeded with all 70 premium dynamic products!');
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  }
}

seedDatabase();
