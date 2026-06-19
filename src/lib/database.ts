import { supabase } from './supabase';

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

// Category queries
export async function getCategories() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) console.error('Error fetching categories:', error);
  return data || [];
}

export async function getParentCategories() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('sort_order', { ascending: true });
  if (error) console.error('Error fetching parent categories:', error);
  return data || [];
}

export async function getSubCategories(parentId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('sort_order', { ascending: true });
  if (error) console.error('Error fetching subcategories:', error);
  return data || [];
}

export async function createCategory(name: string, image_url: string, parent_id: string | null = null, description?: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, image_url, parent_id, description }])
    .select()
    .single();
  if (error) console.error('Error creating category:', error);
  return data as Category | null;
}

export async function updateCategory(id: string, updates: Partial<Category>) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) console.error('Error updating category:', error);
  return data as Category | null;
}

export async function deleteCategory(id: string) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting category:', error);
  return !error;
}

// Product queries
export async function getProducts(limit?: number) {
  if (!supabase) return [];
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
  if (error) console.error('Error fetching products:', error);
  return (data as Product[]) || [];
}

export async function getProductsByCategory(categoryId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name),
      product_images (*)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'active');
  if (error) console.error('Error fetching products by category:', error);
  return (data as Product[]) || [];
}

export async function searchProducts(query: string) {
  if (!supabase) return [];
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
  if (error) console.error('Error searching products:', error);
  return (data as Product[]) || [];
}

export async function getBestsellers(limit = 10) {
  if (!supabase) return [];
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
  if (error) console.error('Error fetching bestsellers:', error);
  return (data as Product[]) || [];
}

export async function getTrendingProducts(limit = 10) {
  if (!supabase) return [];
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
  if (error) console.error('Error fetching trending products:', error);
  return (data as Product[]) || [];
}

export async function getFeaturedProducts(limit = 5) {
  if (!supabase) return [];
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
  if (error) console.error('Error fetching featured products:', error);
  return (data as Product[]) || [];
}

export async function getProductById(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name),
      product_images (*)
    `)
    .eq('id', id)
    .single();
  if (error) console.error('Error fetching product:', error);
  return (data as Product) || null;
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
}) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  if (error) console.error('Error creating product:', error);
  return (data as Product) || null;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) console.error('Error updating product:', error);
  return (data as Product) || null;
}

export async function getAllProducts() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name),
      product_images (*)
    `)
    .order('created_at', { ascending: false });
  if (error) console.error('Error fetching all products:', error);
  return (data as Product[]) || [];
}

export async function deleteProduct(id: string) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting product:', error);
  return !error;
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
  ink: 'gold' | 'crimson' | 'navy';
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


