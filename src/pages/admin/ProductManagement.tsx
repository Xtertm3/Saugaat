import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { ProductForm } from '../../components/admin/ProductForm';
import { Edit, Trash2, Plus } from 'lucide-react';
import '../Admin.css';


interface ProductData {
  id?: string;
  name: string;
  description: string;
  parentCategoryId: string;
  categoryId: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  gst: number;
  isBestseller: boolean;
  isTrending: boolean;
  status: 'active' | 'draft' | 'hidden';
}

// Mock categories - TODO: fetch from Supabase
const MOCK_CATEGORIES = [
  { id: 'parent-1', name: 'Home Decor', parentId: null },
  { id: 'parent-2', name: 'Idols', parentId: null },
  { id: 'parent-3', name: 'Festivals', parentId: null },
  { id: 'parent-4', name: 'Toys', parentId: null },
  { id: 'parent-5', name: 'Gift Packs', parentId: null },
  { id: 'parent-6', name: 'Return Gifts', parentId: null },
  { id: 'cat-1', name: 'Vases', parentId: 'parent-1' },
  { id: 'cat-2', name: 'Urlis', parentId: 'parent-1' },
  { id: 'cat-3', name: 'Ganesha', parentId: 'parent-2' },
  { id: 'cat-4', name: 'Lord Krishna', parentId: 'parent-2' },
];

export const ProductManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFormSubmit = async (formData: any) => {
    // TODO: Upload to Supabase
    const newProduct: ProductData = {
      id: editingId || `product-${Date.now()}`,
      ...formData,
    };

    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? newProduct : p)));
      setEditingId(null);
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }

    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setEditingId(id);
      setShowForm(true);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (id: string) => {
    const category = MOCK_CATEGORIES.find((c) => c.id === id);
    return category?.name || 'Unknown';
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
            }}
          >
            ← Back to Products
          </button>

          <h2 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-main)' }}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          <ProductForm
            categories={MOCK_CATEGORIES}
            onSubmit={handleFormSubmit}
            loading={false}
            initialData={editingId ? products.find((p) => p.id === editingId) : undefined}
          />
        </div>
      ) : (
        <>
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2 className="admin-table-title">Product Inventory</h2>
              <div className="admin-table-actions">
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

            {filteredProducts.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>Bestseller</th>
                    <th>Trending</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td style={{ fontWeight: 500 }}>{product.name}</td>
                      <td>{getCategoryName(product.categoryId)}</td>
                      <td>₹{product.price}</td>
                      <td>
                        {product.originalPrice > 0
                          ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`
                          : '-'}
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: product.status === 'active' ? '#e8f5e9' : '#fff3e0',
                          color: product.status === 'active' ? '#2e7d32' : '#f57c00',
                        }}>
                          {product.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {product.isBestseller ? '✓' : '-'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {product.isTrending ? '✓' : '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon"
                            onClick={() => handleEdit(product.id!)}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDelete(product.id!)}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                    onClick={() => setShowForm(true)}
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
    </AdminLayout>
  );
};
