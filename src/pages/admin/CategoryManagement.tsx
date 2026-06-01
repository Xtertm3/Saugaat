import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Edit, Trash2, Plus } from 'lucide-react';
import '../Admin.css';

interface Category {
  id: string;
  name: string;
  image: string;
  parentId: string | null;
}

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'parent-1', name: 'Home Decor', image: '', parentId: null },
    { id: 'parent-2', name: 'Idols', image: '', parentId: null },
    { id: 'parent-3', name: 'Festivals', image: '', parentId: null },
    { id: 'parent-4', name: 'Toys', image: '', parentId: null },
    { id: 'parent-5', name: 'Gift Packs', image: '', parentId: null },
    { id: 'parent-6', name: 'Return Gifts', image: '', parentId: null },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', image: '', parentId: '' });
  const [expandedParent, setExpandedParent] = useState<string | null>(null);

  const parentCategories = categories.filter((c) => c.parentId === null);
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  const handleAddCategory = () => {
    setFormData({ name: '', image: '', parentId: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setFormData({ name: category.name, image: category.image, parentId: category.parentId || '' });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Category name is required.');
      return;
    }

    if (editingId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, name: formData.name, image: formData.image, parentId: formData.parentId || null }
            : c
        )
      );
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        image: formData.image,
        parentId: formData.parentId || null,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setShowForm(false);
    setFormData({ name: '', image: '', parentId: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category? All products in this category will be unaffected.')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
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

          <h2 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-main)' }}>
            {editingId ? 'Edit Category' : 'Add New Category'}
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
                value={formData.parentId}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
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
              <label>Category Image (Optional)</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="Image URL or file path"
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
            {parentCategories.map((parent) => {
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
                          setFormData({ name: '', image: '', parentId: parent.id });
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
    </AdminLayout>
  );
};
