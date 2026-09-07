import React, { useState, useEffect } from 'react';
import { ImageUpload } from './ImageUpload';
import { createCategory, type Category, type Product } from '../../lib/database';

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
  manualDiscountOverride: boolean;
  manualDiscount: number;
  basePrice: number;
  gst: number;
  manualGstAmount: number;
  isBestseller: boolean;
  isTrending: boolean;
  status: 'active' | 'draft' | 'hidden';
}

interface ProductFormProps {
  categories: Category[];
  onSubmit: (data: any, images: ImageFile[]) => Promise<void>;
  initialData?: Product;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories: initialCategories,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [localCategories, setLocalCategories] = useState<Category[]>(initialCategories);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    parentCategoryId: '',
    categoryId: '',
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    manualDiscountOverride: false,
    manualDiscount: 0,
    basePrice: 0,
    gst: 18,
    manualGstAmount: 0,
    isBestseller: false,
    isTrending: false,
    status: 'active',
  });

  const [images, setImages] = useState<ImageFile[]>([]);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // States for inline category creation
  const [newParentName, setNewParentName] = useState('');
  const [newSubName, setNewSubName] = useState('');

  // Update categories list on prop changes
  useEffect(() => {
    setLocalCategories(initialCategories);
  }, [initialCategories]);

  // Set initial form data if editing
  useEffect(() => {
    if (initialData) {
      // Find category in localCategories
      const currentCat = localCategories.find(c => c.id === initialData.category_id);
      let parentId = '';
      let subCatId = '';

      if (currentCat) {
        if (currentCat.parent_id) {
          parentId = currentCat.parent_id;
          subCatId = currentCat.id;
        } else {
          parentId = currentCat.id;
          subCatId = '';
        }
      }

      const initPrice = initialData.price || 0;
      const initGst = initialData.gst || 18;
      const initBase = initPrice > 0 ? Math.round((initPrice / (1 + initGst / 100)) * 100) / 100 : 0;
      const initGstAmt = Math.round((initPrice - initBase) * 100) / 100;

      setFormData({
        name: initialData.name,
        description: initialData.description,
        parentCategoryId: parentId,
        categoryId: subCatId,
        price: initPrice,
        originalPrice: initialData.original_price || 0,
        discountPercentage: initialData.discount_percentage || 0,
        manualDiscountOverride: false,
        manualDiscount: initialData.discount_percentage || 0,
        basePrice: initBase,
        gst: initGst,
        manualGstAmount: initGstAmt,
        isBestseller: initialData.is_bestseller || false,
        isTrending: initialData.is_trending || false,
        status: (initialData.status as any) || 'active',
      });

      // Populate existing images if available
      if (initialData.product_images && initialData.product_images.length > 0) {
        setImages(
          initialData.product_images.map(img => ({
            id: img.id,
            file: null as any,
            preview: img.image_url,
            isFeatured: img.is_featured,
          }))
        );
      }
    }
  }, [initialData, localCategories]);

  const parentCategories = localCategories.filter(c => c.parent_id === null);

  const subCategories = formData.parentCategoryId && formData.parentCategoryId !== 'new-parent'
    ? localCategories.filter(c => c.parent_id === formData.parentCategoryId)
    : [];

  const showNewParentInput = formData.parentCategoryId === 'new-parent';
  const showNewSubInput = formData.categoryId === 'new-sub' || showNewParentInput;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData(prev => {
        const nextData = {
          ...prev,
          [name]: value,
        };

        // Reset subcategory selection if parent category changes
        if (name === 'parentCategoryId') {
          nextData.categoryId = value === 'new-parent' ? 'new-sub' : '';
          setNewParentName('');
          setNewSubName('');
        }

        if (name === 'categoryId') {
          setNewSubName('');
        }

        return nextData;
      });
    }
  };

  const calculateDiscount = () => {
    if (formData.originalPrice > 0 && formData.originalPrice > formData.price) {
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

    if (showNewParentInput && !newParentName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a name for the new parent category.' });
      return;
    }

    if (showNewSubInput && !newSubName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a name for the subcategory.' });
      return;
    }

    const targetCategoryId = formData.categoryId || formData.parentCategoryId;
    if (!showNewSubInput && !targetCategoryId) {
      setMessage({ type: 'error', text: 'Please select a category.' });
      return;
    }

    if (formData.price <= 0) {
      setMessage({ type: 'error', text: 'Price must be greater than 0.' });
      return;
    }

    if (images.length === 0) {
      setMessage({ type: 'error', text: 'Please upload or provide at least one product image.' });
      return;
    }

    setSubmitting(true);

    try {
      let resolvedCategoryId = formData.categoryId || formData.parentCategoryId;

      // Handle inline parent category creation
      if (showNewParentInput) {
        const parentCat = await createCategory(newParentName, 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', null, `${newParentName} Collection`);
        if (!parentCat) {
          throw new Error('Failed to create new parent category.');
        }
        
        // Add to local categories to avoid reload issues
        setLocalCategories(prev => [...prev, parentCat]);
        
        // Handle inline subcategory creation under the newly created parent category
        const subCat = await createCategory(newSubName, 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', parentCat.id, `${newSubName} subcategory`);
        if (!subCat) {
          throw new Error('Failed to create new subcategory.');
        }

        setLocalCategories(prev => [...prev, subCat]);
        resolvedCategoryId = subCat.id;
      } 
      // Handle inline subcategory creation under an existing parent category
      else if (formData.categoryId === 'new-sub') {
        const subCat = await createCategory(newSubName, 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', formData.parentCategoryId, `${newSubName} subcategory`);
        if (!subCat) {
          throw new Error('Failed to create new subcategory.');
        }

        setLocalCategories(prev => [...prev, subCat]);
        resolvedCategoryId = subCat.id;
      }

      // Structure data to match database.ts
      const finalProductData = {
        name: formData.name,
        description: formData.description,
        category_id: resolvedCategoryId,
        price: formData.price,
        original_price: formData.originalPrice > 0 ? formData.originalPrice : undefined,
        discount_percentage: calculateDiscount(),
        gst: formData.gst,
        is_bestseller: formData.isBestseller,
        is_trending: formData.isTrending,
        status: formData.status,
        created_by: 'admin',
        // Extract preview URLs as image strings for the creation process
        images: images.map(img => img.preview)
      };

      await onSubmit(finalProductData, images);
      setMessage({ type: 'success', text: initialData ? 'Product updated successfully!' : 'Product created successfully!' });

      if (!initialData) {
        // Reset form on addition
        setFormData({
          name: '',
          description: '',
          parentCategoryId: '',
          categoryId: '',
          price: 0,
          originalPrice: 0,
          discountPercentage: 0,
          manualDiscountOverride: false,
          manualDiscount: 0,
          basePrice: 0,
          gst: 18,
          manualGstAmount: 0,
          isBestseller: false,
          isTrending: false,
          status: 'active',
        });
        setImages([]);
        setNewParentName('');
        setNewSubName('');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred while saving the product.' });
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
          Categories & Classification
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
              <option value="new-parent">+ -- Create New Parent Category --</option>
            </select>

            {showNewParentInput && (
              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 600 }}>New Parent Category Name *</label>
                <input
                  type="text"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  placeholder="e.g. Spiritual Casket"
                  className="form-input"
                  required
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Sub-Category (Optional)</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="form-input"
              disabled={!formData.parentCategoryId}
            >
              <option value="">
                {!formData.parentCategoryId ? 'Select parent category first' : 'None (Use Parent Category)'}
              </option>
              {subCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              {formData.parentCategoryId && (
                <option value="new-sub">+ -- Create New Subcategory --</option>
              )}
            </select>

            {showNewSubInput && (
              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 600 }}>New Subcategory Name *</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Gold Caskets"
                  className="form-input"
                  required
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Tax Section */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
            💰 Pricing & Tax (GST) Configuration
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Set selling prices, manual discounts, and GST rates</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {/* Sale Price */}
          <div className="form-group">
            <label style={{ fontWeight: 600 }}>Final Sale Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => {
                const newPrice = parseFloat(e.target.value) || 0;
                const newBase = newPrice > 0 ? Math.round((newPrice / (1 + formData.gst / 100)) * 100) / 100 : 0;
                const newGstAmt = Math.round((newPrice - newBase) * 100) / 100;
                setFormData(prev => ({
                  ...prev,
                  price: newPrice,
                  basePrice: newBase,
                  manualGstAmount: newGstAmt,
                }));
              }}
              placeholder="e.g. 1499"
              className="form-input"
              step="0.01"
              min="0"
              required
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Price customer pays at checkout</small>
          </div>

          {/* Original MRP */}
          <div className="form-group">
            <label style={{ fontWeight: 600 }}>Original MRP Price (₹)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="e.g. 2199"
              className="form-input"
              step="0.01"
              min="0"
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Original price for discount comparison</small>
          </div>

          {/* Discount % */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>Discount %</label>
              <label style={{ fontSize: '0.75rem', color: 'var(--primary-color)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.manualDiscountOverride}
                  onChange={(e) => setFormData(prev => ({ ...prev, manualDiscountOverride: e.target.checked }))}
                  style={{ marginRight: '4px' }}
                />
                Manual Override
              </label>
            </div>
            
            {formData.manualDiscountOverride ? (
              <input
                type="number"
                name="manualDiscount"
                value={formData.manualDiscount}
                onChange={(e) => setFormData(prev => ({ ...prev, manualDiscount: parseFloat(e.target.value) || 0 }))}
                placeholder="Enter discount %"
                className="form-input"
                min="0"
                max="100"
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={calculateDiscount()}
                  readOnly
                  className="form-input"
                  disabled
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed', flex: 1 }}
                />
                {calculateDiscount() > 0 && (
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--accent-color)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    whiteSpace: 'nowrap'
                  }}>
                    {calculateDiscount()}% OFF
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* GST Section */}
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--primary-color)' }}>🏷️ GST & Base Price Breakdown</h4>
          
          {/* Quick GST Presets */}
          <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Quick GST Rates:</span>
            {[0, 5, 12, 18, 28].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => {
                  const newBase = formData.price > 0 ? Math.round((formData.price / (1 + rate / 100)) * 100) / 100 : 0;
                  const newGstAmt = Math.round((formData.price - newBase) * 100) / 100;
                  setFormData(prev => ({
                    ...prev,
                    gst: rate,
                    basePrice: newBase,
                    manualGstAmount: newGstAmt,
                  }));
                }}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: formData.gst === rate ? 'var(--secondary-color)' : 'white',
                  color: formData.gst === rate ? 'white' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {rate}% GST
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem' }}>GST Rate (%)</label>
              <input
                type="number"
                name="gst"
                value={formData.gst}
                onChange={(e) => {
                  const newRate = parseFloat(e.target.value) || 0;
                  const newBase = formData.price > 0 ? Math.round((formData.price / (1 + newRate / 100)) * 100) / 100 : 0;
                  const newGstAmt = Math.round((formData.price - newBase) * 100) / 100;
                  setFormData(prev => ({
                    ...prev,
                    gst: newRate,
                    basePrice: newBase,
                    manualGstAmount: newGstAmt,
                  }));
                }}
                placeholder="18"
                className="form-input"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem' }}>Manual Net Base Price (Excl. Tax) ₹</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={(e) => {
                  const newBase = parseFloat(e.target.value) || 0;
                  const newGstAmt = Math.round((newBase * (formData.gst / 100)) * 100) / 100;
                  const newSale = Math.round((newBase + newGstAmt) * 100) / 100;
                  setFormData(prev => ({
                    ...prev,
                    basePrice: newBase,
                    manualGstAmount: newGstAmt,
                    price: newSale,
                  }));
                }}
                placeholder="0"
                className="form-input"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem' }}>Manual GST Tax Amount ₹</label>
              <input
                type="number"
                name="manualGstAmount"
                value={formData.manualGstAmount}
                onChange={(e) => {
                  const newGstAmt = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({
                    ...prev,
                    manualGstAmount: newGstAmt,
                    price: Math.round((prev.basePrice + newGstAmt) * 100) / 100,
                  }));
                }}
                placeholder="0"
                className="form-input"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Financial Summary Badge */}
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: '#f8faf9',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Financial Summary: </span>
            <strong style={{ color: 'var(--primary-color)', fontSize: '0.95rem' }}>
              Base: ₹{formData.basePrice.toFixed(2)} + GST ({formData.gst}%): ₹{formData.manualGstAmount.toFixed(2)} = Total Price: ₹{formData.price.toFixed(2)}
            </strong>
          </div>
          {formData.originalPrice > formData.price && (
            <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: 600 }}>
              Discount: {formData.manualDiscountOverride ? formData.manualDiscount : calculateDiscount()}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Images Section */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
          Product Images *
        </h3>
        {/* Pass our custom callback to sync uploaded images to parent state */}
        <ImageUpload onImagesChange={setImages} maxFiles={10} initialImages={images} />
        {images.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {images.map((img) => (
              <div key={img.id} style={{ position: 'relative' }}>
                <img src={img.preview} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                {img.isFeatured && (
                  <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '9px', textAlign: 'center' }}>Featured</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visibility & Placements Section */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
          ⭐ Page Placements & Featured Promotions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 500 }}>
            <input
              type="checkbox"
              name="isTrending"
              checked={formData.isTrending}
              onChange={handleChange}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-color)' }}>
              👑 Feature in Home Page Hero Slider / Carousel
            </span>
            <small style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(Display in the main Hero Slider at the top of the home page)</small>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 500 }}>
            <input
              type="checkbox"
              name="isBestseller"
              checked={formData.isBestseller}
              onChange={handleChange}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              🔥 Feature as Bestseller / Seasonal Favorite
            </span>
            <small style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(Display in the "Trending & Bestsellers" product grid on home page)</small>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => window.history.back()}
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
          {submitting ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
};
