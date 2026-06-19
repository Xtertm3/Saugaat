import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, type Category } from '../../lib/database';
import '../Admin.css';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', image_url: '', parent_id: '' });
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    window.addEventListener('storage', fetchCategories);
    return () => window.removeEventListener('storage', fetchCategories);
  }, []);

  const parentCategories = categories.filter((c) => c.parent_id === null);
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parent_id === parentId);

  const handleAddCategory = () => {
    setFormData({ name: '', image_url: '', parent_id: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setFormData({ 
      name: category.name, 
      image_url: category.image_url || '', 
      parent_id: category.parent_id || '' 
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Category name is required.');
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: formData.name,
          image_url: formData.image_url,
          parent_id: formData.parent_id || null,
        });
      } else {
        await createCategory(
          formData.name,
          formData.image_url || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
          formData.parent_id || null,
          `${formData.name} Collection`
        );
      }
      await fetchCategories();
      setShowForm(false);
      setFormData({ name: '', image_url: '', parent_id: '' });
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? All subcategories will also be deleted, but products will be unaffected.')) {
      try {
        const success = await deleteCategory(id);
        if (success) {
          await fetchCategories();
        } else {
          alert('Failed to delete category.');
        }
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  return (
    <AdminLayout title="Categories">
      {showForm ? (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: '600px',
        }}>
          <button
            onClick={() => setShowForm(false)}
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
            ← Back to Categories
          </button>

          <h2 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
            {editingId ? 'Edit Category Settings' : 'Add New Category'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Vases"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Parent Category (leave empty for main category)</label>
              <select
                value={formData.parent_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value }))}
                className="form-input"
              >
                <option value="">-- Main Category --</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category Image URL (Optional)</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="Image URL"
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-table-container">
          <div className="admin-table-header">
            <h2 className="admin-table-title">Product Categories</h2>
            <div className="admin-table-actions">
              <button 
                onClick={fetchCategories} 
                className="btn-icon" 
                title="Reload Categories"
                disabled={loading}
                style={{ marginRight: '8px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <RefreshCw size={18} className={loading ? 'spin-anim' : ''} />
              </button>
              <button
                onClick={handleAddCategory}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} />
                Add Category
              </button>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {loading && categories.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading categories...
              </div>
            ) : parentCategories.map((parent) => {
              const subcats = getSubcategories(parent.id);
              const isExpanded = expandedParent === parent.id;

              return (
                <div
                  key={parent.id}
                  style={{
                    marginBottom: '16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Parent Category Row */}
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-main)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                    }}
                    onClick={() => setExpandedParent(isExpanded ? null : parent.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {parent.name}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        ({subcats.length} subcategories)
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(parent);
                        }}
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(parent.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>
                        {isExpanded ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {isExpanded && subcats.length > 0 && (
                    <div style={{ backgroundColor: 'white' }}>
                      {subcats.map((subcat) => (
                        <div
                          key={subcat.id}
                          style={{
                            padding: '12px 16px 12px 40px',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ color: 'var(--text-main)' }}>{subcat.name}</span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn-icon"
                              onClick={() => handleEditCategory(subcat)}
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => handleDelete(subcat.id)}
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Subcategory */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '12px 16px 12px 40px',
                        borderTop: '1px solid var(--border-color)',
                        backgroundColor: 'white',
                      }}
                    >
                      <button
                        onClick={() => {
                          setFormData({ name: '', image_url: '', parent_id: parent.id });
                          setEditingId(null);
                          setShowForm(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--secondary-color)',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        + Add Subcategory
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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
