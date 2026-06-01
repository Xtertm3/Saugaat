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
