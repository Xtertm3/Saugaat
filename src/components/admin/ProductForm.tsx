import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isFeatured: boolean;
}

interface ProductFormData {
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

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface ProductFormProps {
  categories: Category[];
  onSubmit: (data: ProductFormData, images: ImageFile[]) => Promise<void>;
  initialData?: ProductFormData;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: '',
      description: '',
      parentCategoryId: '',
      categoryId: '',
      price: 0,
      originalPrice: 0,
      discountPercentage: 0,
      gst: 18,
      isBestseller: false,
      isTrending: false,
      status: 'active',
    }
  );

  const [images, setImages] = useState<ImageFile[]>([]);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Get parent categories
  const parentCategories = categories.filter((cat) => cat.parentId === null);

  // Get subcategories based on selected parent
  const subCategories = formData.parentCategoryId
    ? categories.filter((cat) => cat.parentId === formData.parentCategoryId)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculateDiscount = () => {
    if (formData.originalPrice > 0) {
      const discount = ((formData.originalPrice - formData.price) / formData.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Product name is required.' });
      return;
    }

    if (!formData.parentCategoryId) {
      setMessage({ type: 'error', text: 'Please select a parent category.' });
      return;
    }

    if (!formData.categoryId) {
      setMessage({ type: 'error', text: 'Please select a sub-category.' });
      return;
    }

    if (formData.price <= 0) {
      setMessage({ type: 'error', text: 'Price must be greater than 0.' });
      return;
    }

    if (images.length === 0) {
      setMessage({ type: 'error', text: 'Please upload at least one product image.' });
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(formData, images);
      setMessage({ type: 'success', text: 'Product created successfully!' });

      // Reset form
      setFormData({
        name: '',
        description: '',
        parentCategoryId: '',
        categoryId: '',
        price: 0,
        originalPrice: 0,
        discountPercentage: 0,
        gst: 18,
        isBestseller: false,
        isTrending: false,
        status: 'active',
      });
      setImages([]);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred while creating the product.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {message && (
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: message.type === 'success' ? '#2e7d32' : '#c62828',
          fontSize: '14px',
          border: `1px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`,
        }}>
          {message.text}
        </div>
      )}

      {/* Basic Information Section */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
          Basic Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Premium Brass Urli"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product in detail..."
            rows={6}
            className="form-input"
            required
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      {/* Category Section */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
          Categories
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Parent Category *</label>
            <select
              name="parentCategoryId"
              value={formData.parentCategoryId}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select a parent category</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sub-Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="form-input"
              required
              disabled={!formData.parentCategoryId}
            >
              <option value="">
                {!formData.parentCategoryId ? 'Select parent category first' : 'Select a sub-category'}
              </option>
              {subCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
          Pricing & Tax
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label>Sale Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              className="form-input"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Original Price (₹)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="0"
              className="form-input"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Discount %</label>
            <input
              type="number"
              value={calculateDiscount()}
              readOnly
              placeholder="Auto-calculated"
              className="form-input"
              disabled
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
            <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Auto-calculated from prices
            </small>
          </div>

          <div className="form-group">
            <label>GST Rate (%)</label>
            <input
              type="number"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              placeholder="18"
              className="form-input"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
          Product Images *
        </h3>
        <ImageUpload onImagesChange={setImages} maxFiles={10} />
      </div>

      {/* Flags Section */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
          Visibility & Highlights
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 500 }}>
            <input
              type="checkbox"
              name="isBestseller"
              checked={formData.isBestseller}
              onChange={handleChange}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span>Mark as Bestseller</span>
            <small style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(Show in bestsellers section)</small>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 500 }}>
            <input
              type="checkbox"
              name="isTrending"
              checked={formData.isTrending}
              onChange={handleChange}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span>Mark as Trending</span>
            <small style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(Show in trending section)</small>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button
          type="reset"
          className="btn btn-secondary"
          style={{ padding: '12px 32px' }}
          disabled={submitting || loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '12px 32px' }}
          disabled={submitting || loading}
        >
          {submitting ? 'Creating Product...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};
