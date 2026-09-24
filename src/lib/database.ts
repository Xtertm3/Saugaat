import { supabase } from './supabase';
import { seedCategories, seedProducts, seedProductImages } from '../data/seedData';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  categories?: Category;
  price: number;
  original_price?: number;
  discount_percentage: number;
  gst: number;
  is_bestseller: boolean;
  is_trending: boolean;
  status: string;
  created_by: string;
  product_images?: ProductImage[];
  created_at: string;
  updated_at: string;
}

// Slugify helper for local IDs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w -]+/g, '')
    .trim()
    .replace(/ +/g, '-');
}

// Local storage caching layer
// High-performance In-Memory RAM Caches for 0ms catalog rendering
let _categoriesMemoryCache: Category[] | null = null;
let _productsMemoryCache: Product[] | null = null;

function getLocalCategories(): Category[] {
  if (_categoriesMemoryCache) return _categoriesMemoryCache;
  const now = new Date().toISOString();
  const seedCats: Category[] = seedCategories.map((c) => {
    const parent_id = c.parent_id ? slugify(c.parent_id) : null;
    const id = parent_id ? slugify(c.name) : slugify(c.name);

    return {
      id,
      name: c.name,
      description: `Curated ${c.name} collection for wholesome lifestyle and gifting.`,
      image_url: c.image_url,
      parent_id,
      sort_order: c.sort_order,
      created_at: now,
      updated_at: now
    };
  });

  const stored = localStorage.getItem('saugaat_categories');
  let cats: Category[] = [];
  if (stored) {
    try {
      cats = JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing local categories:', e);
    }
  }

  // Merge seed categories with local categories ensuring Being Well is top priority
  const map = new Map<string, Category>();
  for (const sc of seedCats) {
    map.set(sc.id, sc);
  }
  for (const c of cats) {
    if (!map.has(c.id)) {
      map.set(c.id, c);
    }
  }

  const finalCats = Array.from(map.values()).sort((a, b) => a.sort_order - b.sort_order);
  _categoriesMemoryCache = finalCats;
  localStorage.setItem('saugaat_categories', JSON.stringify(finalCats));
  return finalCats;
}

function getLocalProducts(): Product[] {
  if (_productsMemoryCache) return _productsMemoryCache;
  const now = new Date().toISOString();
  const stored = localStorage.getItem('saugaat_products');
  let prods: Product[] = [];
  
  if (stored) {
    try {
      prods = JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing local products:', e);
    }
  }

  // Generate seed product list for Being Well & Curtains
  const seedProdList: Product[] = seedProducts.map((p, idx) => {
    const id = `p-seed-${idx + 1}`;
    const category_id = slugify(p.category_id);
    const imgMatch = seedProductImages.find(img => img.product_name.toLowerCase() === p.name.toLowerCase());
    const imagesList = imgMatch ? imgMatch.images : ['/being-well/rose-herbal-tea.jpg'];
    
    const product_images = imagesList.map((url, i) => ({
      id: `img-${id}-${i}`,
      product_id: id,
      image_url: url,
      is_featured: i === 0,
      display_order: i,
      created_at: now
    }));

    return {
      id,
      name: p.name,
      description: p.description,
      category_id,
      price: p.price,
      original_price: p.original_price,
      discount_percentage: p.original_price && p.original_price > p.price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0,
      gst: p.gst || 18,
      is_bestseller: p.is_bestseller || false,
      is_trending: p.is_trending || false,
      status: p.status || 'active',
      created_by: 'admin',
      product_images,
      created_at: now,
      updated_at: now
    };
  });

  // Filter out stale demo products
  const filteredLocalProds = prods.filter(p => !isDummyProduct(p));

  // Ensure all seed products (Being Well + Curtains) exist in product list
  for (const sp of seedProdList) {
    const existingIndex = filteredLocalProds.findIndex(p => p.name.toLowerCase() === sp.name.toLowerCase());
    if (existingIndex !== -1) {
      // Update existing seed product details & images
      filteredLocalProds[existingIndex] = {
        ...filteredLocalProds[existingIndex],
        price: sp.price,
        original_price: sp.original_price,
        description: sp.description,
        product_images: sp.product_images
      };
    } else {
      filteredLocalProds.unshift(sp);
    }
  }

  _productsMemoryCache = filteredLocalProds;
  localStorage.setItem('saugaat_products', JSON.stringify(filteredLocalProds));
  return filteredLocalProds;
}

function mergeCategories(remoteCats: Category[], localCats: Category[]): Category[] {
  const map = new Map<string, Category>();
  for (const c of localCats) {
    const key = slugify(c.name) || c.id;
    map.set(key, c);
  }
  for (const c of remoteCats) {
    const key = slugify(c.name) || c.id;
    if (!map.has(key)) {
      map.set(key, c);
    }
  }
  return Array.from(map.values());
}

const KNOWN_DUMMY_NAMES = new Set([
  'brass urli with diyas', 'ceramic vases trio', 'terracotta planters (3pcs)',
  'handwoven basket set', 'brass candle holders (pair)', 'pendant light fixture',
  'geometric metal wall art', 'embroidered macrame wall hanging', 'floral wooden carved panel',
  'luxury marble coasters (set of 6)', 'marble ganesha idol', 'krishna flute statue',
  'deity figurine set', 'brass dancing ganesha', 'radha krishna love statue',
  'terracotta sitting ganesha', 'sandstone meditating buddha', 'silver plated laxmi ganesha set',
  'makrana marble bal gopal', 'handcarved wooden krishna', 'diwali festive pooja thali',
  'brass diyas set (5pcs)', 'lantern decoration', 'festival fabric pack',
  'organic gulal gift box (set of 4)', 'herbal holi colors in pouches',
  'handcrafted clay diya set (12pcs)', 'toran door hanging', 'pichkari and gulal combo set',
  'festive rangoli stencils kit', 'wooden educational toy set', 'puzzle box toy',
  'building blocks set', 'handpainted wooden peg dolls', 'montessori shape sorter',
  'wooden balancing cactus game', 'forest animals wooden set', 'wooden alphabets puzzle',
  'classic wooden toy train set', 'handcrafted wooden rocking horse',
  'premium occasion gift pack', 'surprise coffee mug set', 'sweets & almonds pack',
  'luxury dry fruits & diya hamper', 'royal chocolate & cookie gift box',
  'organic herbal tea collection box', 'wellness & spa relaxation hamper',
  'corporate desktop organiser hamper', 'gourmet snack & dip celebration pack',
  'maharaja gold gift hamper', 'set of 10 assorted potlis', 'handcrafted shubh labh hangings',
  'scented votive candles (set of 6)', 'silver plated coin in velvet box',
  'miniature meenakari boxes (set of 4)', 'personalized leather keyrings (pack of 5)',
  'assorted handmade soap bars (set of 4)', 'wooden coasters with stand (pack of 4)',
  'decorative kankavati (sindoor box)', 'embroidered silk clutches (pack of 3)',
  'handpainted ceramic tea mug', 'pastel ceramic coffee mug', 'motivational quotes mug',
  'handcrafted leather notebook', 'rose scented soy candle in jar', 'brass bookmark & pen set',
  'pocket perfume roll-on set', 'minimalist key organiser', 'ceramic mug with wooden lid',
  'lavender pillow mist & eye mask', 'brass peacock diya stand', 'saraswati marble idol',
  'handmade rakhi hamper set', 'handcrafted wooden train', 'royal saffron gifting tray',
  'silver plated shanti bowls', 'handpainted ceramic coffee mug', 'terracotta hanging lamps set',
  'radha krishna marble murti', 'luxury incense sticks pack', 'wooden animal stacker toy',
  'luxury assorted dry fruits box'
]);

function isDummyProduct(p: { name: string; id: string }): boolean {
  if (!p || !p.id) return false;
  const lowerName = p.name ? p.name.toLowerCase() : '';
  const validSeedNames = new Set(seedProducts.map(sp => sp.name.toLowerCase()));
  if (validSeedNames.has(lowerName)) return false;
  if (KNOWN_DUMMY_NAMES.has(lowerName)) return true;
  // Always preserve products created dynamically by admin
  if (p.id.startsWith('prod-admin-') || p.id.startsWith('custom-') || p.id.startsWith('prod-')) return false;
  // Only match legacy demo IDs (p-1 to p-70)
  if (/^p-(?:[1-9]|[1-6][0-9]|70)$/.test(p.id)) return true;
  return false;
}

function mergeProducts(remoteProds: Product[], localProds: Product[]): Product[] {
  const map = new Map<string, Product>();
  for (const p of localProds) {
    if (!isDummyProduct(p)) {
      map.set(p.id, p);
    }
  }
  for (const p of remoteProds) {
    if (!isDummyProduct(p)) {
      if (!map.has(p.id)) {
        const existingByName = Array.from(map.values()).find(lp => lp.name.toLowerCase() === p.name.toLowerCase());
        if (!existingByName) {
          map.set(p.id, p);
        }
      }
    }
  }
  return Array.from(map.values());
}

function getMatchingCategoryKeys(resolvedCat: Category, allCats: Category[]): Set<string> {
  const keys = new Set<string>();
  const addKeys = (c: Category) => {
    if (c.id) {
      keys.add(c.id);
      keys.add(slugify(c.id));
    }
    if (c.name) {
      keys.add(c.name);
      keys.add(slugify(c.name));
    }
  };

  addKeys(resolvedCat);

  if (!resolvedCat.parent_id) {
    const parentKeys = new Set([resolvedCat.id, slugify(resolvedCat.id), slugify(resolvedCat.name)]);
    const subCats = allCats.filter(c => c.parent_id && (parentKeys.has(c.parent_id) || parentKeys.has(slugify(c.parent_id))));
    for (const sub of subCats) {
      addKeys(sub);
    }
  }

  return keys;
}

function saveLocalCategories(cats: Category[]) {
  const map = new Map<string, Category>();
  for (const c of cats) {
    const key = slugify(c.name) || c.id;
    map.set(key, c);
  }
  const deduped = Array.from(map.values());
  _categoriesMemoryCache = deduped;
  try {
    localStorage.setItem('saugaat_categories', JSON.stringify(deduped));
  } catch (e) {
    console.error('Failed to save categories to localStorage:', e);
  }
  window.dispatchEvent(new CustomEvent('saugaat_catalog_updated'));
}

function saveLocalProducts(prods: Product[]) {
  _productsMemoryCache = prods;
  try {
    localStorage.setItem('saugaat_products', JSON.stringify(prods));
  } catch (e) {
    console.error('Failed to save products to localStorage:', e);
  }
  window.dispatchEvent(new CustomEvent('saugaat_catalog_updated'));
}

// Category queries
export async function getCategories() {
  const localCats = getLocalCategories();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return mergeCategories(data as Category[], localCats);
      }
    } catch (e) {
      console.error('Supabase query failed, falling back to LocalStorage', e);
    }
  }
  return localCats;
}

export async function getParentCategories() {
  const all = await getCategories();
  return all.filter(c => c.parent_id === null);
}

export async function getSubCategories(parentId: string) {
  const all = await getCategories();
  return all.filter(c => c.parent_id === parentId);
}

export async function createCategory(name: string, image_url: string, parent_id: string | null = null, description?: string) {
  const id = slugify(name);
  const now = new Date().toISOString();
  const finalId = id || `cat-${Date.now()}`;

  // Resolve parent to local slug id for consistent local cache / nav
  let localParentId = parent_id;
  if (parent_id) {
    const all = getLocalCategories();
    const parent = all.find(
      c => c.id === parent_id || slugify(c.name) === slugify(parent_id) || slugify(c.id) === slugify(parent_id)
    );
    if (parent) localParentId = parent.id;
  }

  const newCat: Category = {
    id: finalId,
    name,
    image_url,
    parent_id: localParentId,
    description,
    sort_order: 0,
    created_at: now,
    updated_at: now
  };

  const localCats = getLocalCategories();
  if (!localCats.some(c => c.id === finalId || slugify(c.name) === finalId)) {
    localCats.push(newCat);
    saveLocalCategories(localCats);
  }

  if (supabase) {
    try {
      // Resolve parent slug -> Supabase UUID (FK requires UUID)
      let dbParentUuid: string | null = null;
      if (parent_id) {
        const { data: dbCategories } = await supabase.from('categories').select('id, name');
        if (dbCategories) {
          const matched = dbCategories.find(c =>
            c.id === parent_id ||
            slugify(c.name) === slugify(parent_id) ||
            slugify(c.id) === slugify(parent_id)
          );
          if (matched) dbParentUuid = matched.id;
        }
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, image_url, parent_id: dbParentUuid, description }])
        .select()
        .single();
      if (error) console.error('Supabase createCategory error:', error);
      // Prefer local slug id for app routing consistency
      if (!error && data) {
        window.dispatchEvent(new Event('saugaat_catalog_updated'));
        return newCat;
      }
    } catch (e) {
      console.error('Error creating category in Supabase:', e);
    }
  }

  window.dispatchEvent(new Event('saugaat_catalog_updated'));
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<Category>) {
  const localCats = getLocalCategories();
  const index = localCats.findIndex(c => c.id === id);
  if (index !== -1) {
    localCats[index] = { ...localCats[index], ...updates, updated_at: new Date().toISOString() };
    saveLocalCategories(localCats);
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Category;
    } catch (e) {
      console.error('Error updating category in Supabase:', e);
    }
  }

  return index !== -1 ? localCats[index] : null;
}

export async function deleteCategory(id: string) {
  const localCats = getLocalCategories();
  // Cascade remove category + children
  const filtered = localCats.filter(c => c.id !== id && c.parent_id !== id);
  saveLocalCategories(filtered);

  if (supabase) {
    try {
      const { data: dbCategories } = await supabase.from('categories').select('id, name');
      let remoteId = id;
      if (dbCategories) {
        const matched = dbCategories.find(c =>
          c.id === id || slugify(c.name) === slugify(id) || slugify(c.id) === slugify(id)
        );
        if (matched) remoteId = matched.id;
      }
      await supabase.from('categories').delete().eq('parent_id', remoteId);
      const { error } = await supabase.from('categories').delete().eq('id', remoteId);
      if (error) {
        console.error('Supabase deleteCategory error:', error);
        return false;
      }
    } catch (e) {
      console.error('Error deleting category in Supabase:', e);
      return false;
    }
  }

  window.dispatchEvent(new Event('saugaat_catalog_updated'));
  return true;
}

// Product queries
export async function getProducts(limit?: number) {
  const localCats = await getCategories();
  const localProds = getLocalProducts().filter(p => p.status === 'active');
  let merged: Product[] = localProds;

  if (supabase) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (id, name, parent_id),
          product_images (*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        merged = mergeProducts(data as Product[], localProds);
      }
    } catch (e) {
      console.error('Supabase query failed, falling back to LocalStorage', e);
    }
  }

  const mapped = merged.map(p => {
    const cat = localCats.find(c => c.id === p.category_id);
    return {
      ...p,
      categories: cat || p.categories
    };
  });
  
  const sorted = mapped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getProductsByCategory(categoryId: string) {
  const allCats = await getCategories();
  const allProds = await getProducts();
  const targetCatSlug = slugify(categoryId);
  
  const resolvedCategory = allCats.find(
    c => c.id === categoryId || slugify(c.id) === targetCatSlug || slugify(c.name) === targetCatSlug
  );
  
  if (!resolvedCategory) {
    return allProds.filter(p => {
      const pCatSlug = slugify(p.category_id);
      return p.category_id === categoryId || pCatSlug === targetCatSlug || (p.categories && (p.categories.id === categoryId || slugify(p.categories.name) === targetCatSlug));
    });
  }

  const matchKeys = getMatchingCategoryKeys(resolvedCategory, allCats);
  matchKeys.add(categoryId);
  matchKeys.add(targetCatSlug);

  return allProds.filter(p => {
    if (matchKeys.has(p.category_id) || matchKeys.has(slugify(p.category_id))) return true;
    if (p.categories) {
      if (matchKeys.has(p.categories.id) || matchKeys.has(slugify(p.categories.name))) return true;
    }
    return false;
  });
}

export async function searchProducts(query: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          product_images (*)
        `)
        .ilike('name', `%${query}%`)
        .eq('status', 'active')
        .limit(20);
      if (!error && data && data.length > 0) return data as Product[];
    } catch (e) {
      console.error(e);
    }
  }

  const localCats = getLocalCategories();
  const q = query.toLowerCase();
  return getLocalProducts()
    .filter(p => p.status === 'active' && p.name.toLowerCase().includes(q))
    .map(p => ({
      ...p,
      categories: localCats.find(c => c.id === p.category_id)
    }))
    .slice(0, 20);
}

export async function getBestsellers(limit = 10) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          product_images (*)
        `)
        .eq('is_bestseller', true)
        .eq('status', 'active')
        .limit(limit);
      if (!error && data && data.length > 0) {
        return (data as Product[]).filter(p => !isDummyProduct(p));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const localCats = getLocalCategories();
  return getLocalProducts()
    .filter(p => p.is_bestseller && p.status === 'active' && !isDummyProduct(p))
    .map(p => ({
      ...p,
      categories: localCats.find(c => c.id === p.category_id)
    }))
    .slice(0, limit);
}

export async function getTrendingProducts(limit = 10) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          product_images (*)
        `)
        .eq('is_trending', true)
        .eq('status', 'active')
        .limit(limit);
      if (!error && data && data.length > 0) {
        return (data as Product[]).filter(p => !isDummyProduct(p));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const localCats = getLocalCategories();
  return getLocalProducts()
    .filter(p => p.is_trending && p.status === 'active' && !isDummyProduct(p))
    .map(p => ({
      ...p,
      categories: localCats.find(c => c.id === p.category_id)
    }))
    .slice(0, limit);
}

export async function getFeaturedHeroProducts(limit = 6): Promise<Product[]> {
  const trending = await getTrendingProducts(limit);
  const validTrending = trending.filter(p => !isDummyProduct(p));
  if (validTrending && validTrending.length > 0) return validTrending;
  const bestsellers = await getBestsellers(limit);
  const validBestsellers = bestsellers.filter(p => !isDummyProduct(p));
  if (validBestsellers && validBestsellers.length > 0) return validBestsellers;
  const featured = await getFeaturedProducts(limit);
  return featured.filter(p => !isDummyProduct(p));
}

export function getSyncFeaturedHeroProducts(limit = 6): Product[] {
  const allProds = getSyncProducts();
  const heroItems = allProds.filter(p => p.is_trending && p.status === 'active' && !isDummyProduct(p));
  if (heroItems.length > 0) return heroItems.slice(0, limit);
  const bestsellers = allProds.filter(p => p.is_bestseller && p.status === 'active' && !isDummyProduct(p));
  if (bestsellers.length > 0) return bestsellers.slice(0, limit);
  return allProds.filter(p => !isDummyProduct(p)).slice(0, limit);
}

export async function getFeaturedProducts(limit = 5) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          product_images (*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (!error && data && data.length > 0) {
        return (data as Product[]).filter(p => !isDummyProduct(p));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const localCats = getLocalCategories();
  return getLocalProducts()
    .filter(p => p.status === 'active' && !isDummyProduct(p))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(p => ({
      ...p,
      categories: localCats.find(c => c.id === p.category_id)
    }))
    .slice(0, limit);
}

export async function getProductById(id: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          product_images (*)
        `)
        .eq('id', id)
        .single();
      if (!error && data) return data as Product;
    } catch (e) {
      console.error(e);
    }
  }

  const localCats = getLocalCategories();
  const prod = getLocalProducts().find(p => p.id === id);
  if (!prod) return null;

  return {
    ...prod,
    categories: localCats.find(c => c.id === prod.category_id)
  };
}

// Synchronous 0ms RAM catalog getters for initial state rendering
export function getSyncCategories(): Category[] {
  return getLocalCategories();
}

export function getSyncProducts(limit?: number): Product[] {
  const localCats = getLocalCategories();
  const prods = getLocalProducts()
    .filter(p => p.status === 'active')
    .map(p => ({
      ...p,
      categories: localCats.find(c => c.id === p.category_id)
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return limit ? prods.slice(0, limit) : prods;
}

export function getSyncProductsByCategory(categoryId: string): Product[] {
  const allCats = getLocalCategories();
  const allProds = getSyncProducts();
  const targetCatSlug = slugify(categoryId);
  const resolved = allCats.find(c => c.id === categoryId || slugify(c.id) === targetCatSlug || slugify(c.name) === targetCatSlug);
  if (!resolved) {
    return allProds.filter(p => {
      const pCatSlug = slugify(p.category_id);
      return p.category_id === categoryId || pCatSlug === targetCatSlug || (p.categories && (p.categories.id === categoryId || slugify(p.categories.name) === targetCatSlug));
    });
  }
  const matchKeys = getMatchingCategoryKeys(resolved, allCats);
  matchKeys.add(categoryId);
  matchKeys.add(targetCatSlug);

  return allProds.filter(p => {
    if (matchKeys.has(p.category_id) || matchKeys.has(slugify(p.category_id))) return true;
    if (p.categories) {
      if (matchKeys.has(p.categories.id) || matchKeys.has(slugify(p.categories.name))) return true;
    }
    return false;
  });
}

export function getSyncBestsellers(limit = 10): Product[] {
  const localCats = getLocalCategories();
  return getLocalProducts()
    .filter(p => p.is_bestseller && p.status === 'active')
    .map(p => ({
      ...p,
      categories: localCats.find(c => c.id === p.category_id)
    }))
    .slice(0, limit);
}

export function getSyncTrendingProducts(limit = 10): Product[] {
  const localCats = getLocalCategories();
  return getLocalProducts()
    .filter(p => p.is_trending && p.status === 'active')
    .map(p => ({
      ...p,
      categories: localCats.find(c => c.id === p.category_id)
    }))
    .slice(0, limit);
}

export function getSyncProductById(id: string): Product | null {
  const localCats = getLocalCategories();
  const prod = getLocalProducts().find(p => p.id === id);
  if (!prod) return null;
  return {
    ...prod,
    categories: localCats.find(c => c.id === prod.category_id)
  };
}


export async function createProduct(product: {
  name: string;
  description: string;
  category_id: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  gst?: number;
  is_bestseller?: boolean;
  is_trending?: boolean;
  status?: string;
  created_by: string;
  images?: string[];
}) {
  const id = `prod-admin-${Date.now()}`;
  const now = new Date().toISOString();
  
  const discount = product.original_price && product.original_price > 0
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const product_images = (product.images || ['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800']).map((url, i) => ({
    id: `img-${id}-${i}`,
    product_id: id,
    image_url: url,
    is_featured: i === 0,
    display_order: i,
    created_at: now
  }));

  const newProduct: Product = {
    id,
    name: product.name,
    description: product.description,
    category_id: product.category_id,
    price: product.price,
    original_price: product.original_price,
    discount_percentage: discount,
    gst: product.gst || 18,
    is_bestseller: product.is_bestseller || false,
    is_trending: product.is_trending || false,
    status: product.status || 'active',
    created_by: product.created_by || 'admin',
    product_images,
    created_at: now,
    updated_at: now
  };

  const localProds = getLocalProducts();
  localProds.unshift(newProduct);
  saveLocalProducts(localProds);

  if (supabase) {
    try {
      // Resolve category_id slug to Supabase Category UUID
      let dbCategoryUuid: string | null = null;
      const targetSlug = slugify(product.category_id);
      
      const { data: dbCategories } = await supabase
        .from('categories')
        .select('id, name');
        
      if (dbCategories && dbCategories.length > 0) {
        const matchedCat = dbCategories.find(c => 
          c.id === product.category_id || 
          slugify(c.name) === targetSlug || 
          slugify(c.id) === targetSlug
        );
        if (matchedCat) dbCategoryUuid = matchedCat.id;
      }

      if (!dbCategoryUuid) {
        const { data: createdCat } = await supabase
          .from('categories')
          .insert([{
            name: product.category_id.charAt(0).toUpperCase() + product.category_id.slice(1),
            image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800'
          }])
          .select('id')
          .single();
        if (createdCat) dbCategoryUuid = createdCat.id;
      }

      const { images, created_by, ...dbProductData } = product;
      const payload = {
        ...dbProductData,
        category_id: dbCategoryUuid || product.category_id,
        discount_percentage: discount
      };

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        const prod = data as Product;
        if (product.images && product.images.length > 0) {
          await addProductImages(prod.id, product.images.map((url, i) => ({
            image_url: url,
            is_featured: i === 0,
            display_order: i
          })));
        }
        const fullProd = await getProductById(prod.id);
        if (fullProd) {
          const updatedLocal = getLocalProducts().map(lp => lp.name === product.name ? fullProd : lp);
          saveLocalProducts(updatedLocal);
          return fullProd;
        }
      } else if (error) {
        console.error('Error inserting product into Supabase:', error);
      }
    } catch (e) {
      console.error('Error creating product in Supabase:', e);
    }
  }

  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product> & { images?: string[] }) {
  const localProds = getLocalProducts();
  const index = localProds.findIndex(p => p.id === id);
  if (index !== -1) {
    const originalPrice = updates.original_price !== undefined ? updates.original_price : localProds[index].original_price;
    const price = updates.price !== undefined ? updates.price : localProds[index].price;
    const discount = originalPrice && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    let product_images = localProds[index].product_images;
    if (updates.images) {
      product_images = updates.images.map((url, i) => ({
        id: `img-${id}-${i}`,
        product_id: id,
        image_url: url,
        is_featured: i === 0,
        display_order: i,
        created_at: new Date().toISOString()
      }));
    }

    const { images, ...prodUpdates } = updates;
    localProds[index] = {
      ...localProds[index],
      ...prodUpdates,
      discount_percentage: discount,
      product_images,
      updated_at: new Date().toISOString()
    };
    saveLocalProducts(localProds);
  }

  if (supabase) {
    try {
      const { images, categories, product_images, ...dbUpdates } = updates;
      if (dbUpdates.price !== undefined || dbUpdates.original_price !== undefined) {
        const currentProd = await getProductById(id);
        if (currentProd) {
          const originalPrice = dbUpdates.original_price !== undefined ? dbUpdates.original_price : currentProd.original_price;
          const price = dbUpdates.price !== undefined ? dbUpdates.price : currentProd.price;
          dbUpdates.discount_percentage = originalPrice && originalPrice > 0
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0;
        }
      }

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        if (updates.images) {
          await supabase.from('product_images').delete().eq('product_id', id);
          await addProductImages(id, updates.images.map((url, i) => ({
            image_url: url,
            is_featured: i === 0,
            display_order: i
          })));
        }
        const fullProd = await getProductById(id);
        return fullProd;
      }
    } catch (e) {
      console.error('Error updating product in Supabase:', e);
    }
  }

  return index !== -1 ? localProds[index] : null;
}

export async function getAllProducts() {
  const localCats = await getCategories();
  const localProds = getLocalProducts();
  let merged: Product[] = localProds;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          product_images (*)
        `)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        merged = mergeProducts(data as Product[], localProds);
      }
    } catch (e) {
      console.error('Error fetching all products from Supabase:', e);
    }
  }

  const mapped = merged.map(p => {
    const cat = localCats.find(c => c.id === p.category_id || slugify(c.name) === slugify(p.category_id) || slugify(c.id) === slugify(p.category_id));
    return {
      ...p,
      categories: cat || p.categories
    };
  });

  return mapped.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}

export async function deleteProduct(id: string) {
  const localProds = getLocalProducts();
  const filtered = localProds.filter(p => p.id !== id);
  saveLocalProducts(filtered);

  if (supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      return !error;
    } catch (e) {
      console.error('Error deleting product in Supabase:', e);
    }
  }

  return true;
}

// Product image queries
export async function addProductImages(productId: string, images: Array<{ image_url: string; is_featured: boolean; display_order: number }>) {
  if (!supabase) return [];
  const imageRecords = images.map(img => ({
    product_id: productId,
    ...img
  }));
  const { data, error } = await supabase
    .from('product_images')
    .insert(imageRecords)
    .select();
  if (error) console.error('Error adding product images:', error);
  return (data as ProductImage[]) || [];
}

export async function deleteProductImage(id: string) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting product image:', error);
  return !error;
}

export async function updateProductImage(id: string, updates: Partial<ProductImage>) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('product_images')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) console.error('Error updating product image:', error);
  return (data as ProductImage) || null;
}

export async function uploadProductImage(file: File, productId: string) {
  if (!supabase) return null;
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`${productId}/${fileName}`, file);
  if (error) console.error('Error uploading image:', error);
  return data;
}

export function getPublicImageUrl(path: string) {
  if (!supabase) return '';
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(path);
  return data?.publicUrl || '';
}

export interface Profile {
  id: string;
  email: string;
  points: number;
  tier: string;
  created_at: string;
  updated_at: string;
}

export function calculateTier(points: number): string {
  if (points < 100) return 'Bronze Tier Member';
  if (points < 300) return 'Silver Tier Member';
  if (points < 500) return 'Gold Tier Member';
  return 'Platinum Tier Member';
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data as Profile;
}

export async function updateProfilePoints(userId: string, points: number): Promise<Profile | null> {
  if (!supabase) return null;
  const tier = calculateTier(points);
  const { data, error } = await supabase
    .from('profiles')
    .update({ points, tier, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) {
    console.error('Error updating profile points:', error);
    return null;
  }
  return data as Profile;
}

export interface OrderTrackingLog {
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  timestamp: string;
  description: string;
}

export interface CalligraphyCard {
  message: string;
  font: 'vedic' | 'royal' | 'minimal';
  ink: 'gold' | 'crimson' | 'navy' | 'fuchsia' | 'cyan';
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  items: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  expectedDelivery: string;
  logs: OrderTrackingLog[];
  created_at: string;
  card?: CalligraphyCard;
}

// Initial mock orders seed
export const MOCK_ORDERS: Order[] = [
  {
    id: 'SG-2026-081',
    customerEmail: 'customer@saugaat.com',
    customerName: 'Customer',
    items: 'Brass Urli + Pooja Thali',
    total: 2198,
    status: 'processing',
    expectedDelivery: 'June 15, 2026',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    logs: [
      { status: 'pending', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), description: 'Order successfully placed. Gifting curator is reviewing.' },
      { status: 'processing', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), description: 'Hamper box curated and customized branding verified.' }
    ]
  },
  {
    id: 'SG-2026-080',
    customerEmail: 'customer@saugaat.com',
    customerName: 'Customer',
    items: 'Ceramic Vases Trio',
    total: 1899,
    status: 'shipped',
    expectedDelivery: 'June 10, 2026',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    logs: [
      { status: 'pending', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: 'Order successfully placed.' },
      { status: 'processing', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), description: 'Item packed and quality check passed.' },
      { status: 'shipped', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), description: 'Dispatched from Jaipur Gifting Studio and handed to courier partner.' }
    ]
  }
];

export function getMockOrders(): Order[] {
  const stored = localStorage.getItem('saugaat_mock_orders');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing mock orders from storage:', e);
    }
  }
  
  localStorage.setItem('saugaat_mock_orders', JSON.stringify(MOCK_ORDERS));
  return MOCK_ORDERS;
}

export function saveMockOrders(orders: Order[]): void {
  localStorage.setItem('saugaat_mock_orders', JSON.stringify(orders));
}

export async function getCustomerOrders(email: string): Promise<Order[]> {
  const allOrders = getMockOrders();
  return allOrders.filter(o => o.customerEmail === email);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const allOrders = getMockOrders();
  return allOrders.find(o => o.id === orderId) || null;
}

export async function updateOrderStatus(
  orderId: string, 
  status: Order['status'], 
  logDescription: string
): Promise<Order | null> {
  const allOrders = getMockOrders();
  const index = allOrders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const updatedOrder = {
    ...allOrders[index],
    status,
    logs: [
      ...allOrders[index].logs,
      {
        status,
        timestamp: new Date().toISOString(),
        description: logDescription
      }
    ]
  };

  allOrders[index] = updatedOrder;
  saveMockOrders(allOrders);
  
  window.dispatchEvent(new Event('storage'));
  
  return updatedOrder;
}

export async function createOrder(orderData: {
  customerEmail: string;
  customerName: string;
  items: string;
  total: number;
  expectedDelivery: string;
  card?: CalligraphyCard;
}): Promise<Order | null> {
  const allOrders = getMockOrders();
  
  // Generate order ID like SG-2026-082
  const prefix = 'SG-2026-';
  let nextSuffix = 82;
  const suffixes = allOrders.map(o => {
    const match = o.id.match(/SG-2026-(\d+)/);
    return match ? parseInt(match[1]) : 80;
  });
  if (suffixes.length > 0) {
    nextSuffix = Math.max(...suffixes) + 1;
  }
  const orderId = `${prefix}${String(nextSuffix).padStart(3, '0')}`;

  const newOrder: Order = {
    id: orderId,
    customerEmail: orderData.customerEmail,
    customerName: orderData.customerName,
    items: orderData.items,
    total: orderData.total,
    status: 'pending',
    expectedDelivery: orderData.expectedDelivery,
    created_at: new Date().toISOString(),
    logs: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        description: 'Order successfully placed. Gifting curator is reviewing.'
      }
    ]
  };
  
  if (orderData.card) {
    newOrder.card = orderData.card;
    newOrder.logs.push({
      status: 'pending',
      timestamp: new Date().toISOString(),
      description: `Handwritten calligraphy greeting card attached: "${orderData.card.message.substring(0, 30)}${orderData.card.message.length > 30 ? '...' : ''}"`
    });
  }

  allOrders.unshift(newOrder); // Add to beginning of the list
  saveMockOrders(allOrders);
  window.dispatchEvent(new Event('storage'));
  return newOrder;
}


export async function attachCardToOrder(orderId: string, card: CalligraphyCard): Promise<Order | null> {
  const allOrders = getMockOrders();
  const index = allOrders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const updatedOrder: Order = {
    ...allOrders[index],
    card,
    logs: [
      ...allOrders[index].logs,
      {
        status: allOrders[index].status,
        timestamp: new Date().toISOString(),
        description: `Handwritten calligraphy greeting card attached: "${card.message.substring(0, 30)}${card.message.length > 30 ? '...' : ''}"`
      }
    ]
  };

  allOrders[index] = updatedOrder;
  saveMockOrders(allOrders);
  
  window.dispatchEvent(new Event('storage'));
  
  return updatedOrder;
}

export function getActiveCampaigns(): Array<{ id: number; name: string; code: string; value: string; target: string }> {
  const saved = localStorage.getItem('saugaat_campaigns');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing campaigns:', e);
    }
  }
  return [
    { id: 1, name: "Spontaneous Gifting Special", code: "JUSTFORYOU", value: "₹250 Off", target: "All Customers" },
    { id: 2, name: "Curator Wedding Collection", code: "WEDDING15", value: "15% Off", target: "Gold Members" }
  ];
}


