import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { ProductForm } from '../../components/admin/ProductForm';
import { Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { getAllProducts, getCategories, createProduct, updateProduct, deleteProduct, type Product, type Category } from '../../lib/database';
import '../Admin.css';

export const ProductManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getAllProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching products or categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('storage', fetchData);
    return () => window.removeEventListener('storage', fetchData);
  }, []);

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }
      await fetchData();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + (error as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const success = await deleteProduct(id);
        if (success) {
          await fetchData();
        } else {
          alert('Failed to delete product.');
        }
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return 'Uncategorized';
    
    if (category.parent_id) {
      const parent = categories.find((c) => c.id === category.parent_id);
      return parent ? `${parent.name} > ${category.name}` : category.name;
    }
    return category.name;
  };

  return (
    <AdminLayout title="Products">
      {showForm ? (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
            }}
            style={{
              marginBottom: '20px',
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Back to Products
          </button>

          <h2 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
            {editingId ? 'Edit Product Settings' : 'Add New Curated Product'}
          </h2>

          <ProductForm
            categories={categories}
            onSubmit={handleFormSubmit}
            loading={loading}
            initialData={editingId ? products.find((p) => p.id === editingId) : undefined}
          />
        </div>
      ) : (
        <>
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2 className="admin-table-title">Product Inventory</h2>
              <div className="admin-table-actions">
                <button 
                  onClick={fetchData} 
                  className="btn-icon" 
                  title="Reload Inventory"
                  disabled={loading}
                  style={{ marginRight: '8px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <RefreshCw size={18} className={loading ? 'spin-anim' : ''} />
                </button>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button
                  onClick={() => {
                    setEditingId(null);
                    setShowForm(true);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={18} />
                  Add Product
                </button>
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>Loading curated catalog...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Product Name</th>
                    <th>Category Classification</th>
                    <th>Price (INR)</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Hero Carousel</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const featuredImg = product.product_images && product.product_images.length > 0
                      ? product.product_images.find(img => img.is_featured)?.image_url || product.product_images[0].image_url
                      : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=80';
                      
                    return (
                      <tr key={product.id}>
                        <td>
                          <img 
                            src={featuredImg} 
                            alt={product.name} 
                            style={{ 
                              width: '44px', 
                              height: '44px', 
                              objectFit: 'cover', 
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)'
                            }} 
                          />
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{product.name}</td>
                        <td style={{ fontSize: '0.85rem' }}>{getCategoryName(product.category_id)}</td>
                        <td><strong>₹{product.price}</strong></td>
                        <td>
                          {product.original_price && product.original_price > product.price ? (
                            <span style={{ 
                              padding: '2px 6px', 
                              backgroundColor: 'rgba(212, 163, 89, 0.15)', 
                              color: 'var(--secondary-color)', 
                              borderRadius: '4px', 
                              fontSize: '11px',
                              fontWeight: 'bold' 
                            }}>
                              {product.discount_percentage}% OFF
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>
                          )}
                        </td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            backgroundColor: product.status === 'active' ? '#e8f5e9' : (product.status === 'draft' ? '#fff3e0' : '#efebe9'),
                            color: product.status === 'active' ? '#2e7d32' : (product.status === 'draft' ? '#f57c00' : '#5d4037'),
                          }}>
                            {product.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {product.is_bestseller ? (
                            <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--secondary-color)', color: 'white', fontSize: '11px', fontWeight: 600 }}>🔥 BESTSELLER</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {product.is_trending ? (
                            <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '11px', fontWeight: 600 }}>⭐ HERO</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => handleEdit(product.id)}
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => handleDelete(product.id)}
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}>
                <p style={{ margin: 0, marginBottom: '20px' }}>
                  {searchTerm ? 'No products found matching your search.' : 'No products yet. Click "Add Product" to create one.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setShowForm(true);
                    }}
                    className="btn btn-primary"
                  >
                    Add Your First Product
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
      
      <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AdminLayout>
  );
};
