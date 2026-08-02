import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, RefreshCw, ArrowUpDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getCategories, getProductsByCategory, getProducts, slugify, type Category, type Product } from '../lib/database';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get('search') || '';

  const { toggleWishlist, isInWishlist } = useCart();
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'discount'>('featured');
  const [searchFilter, setSearchFilter] = useState(initialSearchQuery);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('search') || '';
    setSearchFilter(q);
  }, [location.search]);

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        const allCats = await getCategories();
        setCategories(allCats);

        if (categoryId === 'all' || !categoryId) {
          const prods = await getProducts();
          setProductsList(prods);
        } else {
          const prods = await getProductsByCategory(categoryId);
          setProductsList(prods);
        }
      } catch (err) {
        console.error('Error loading category page data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
    setSelectedSubcategory('all');
  }, [categoryId]);

  const currentCategory = categories.find(c => c.id === categoryId || slugify(c.name) === categoryId);
  const categoryName = currentCategory ? currentCategory.name : (categoryId === 'all' ? 'All Products' : 'Curated Collection');

  const subcategoriesList = currentCategory
    ? categories.filter(c => c.parent_id === currentCategory.id)
    : [];

  // Filter & Sort Products
  let processedProducts = productsList.filter(p => {
    const matchesSub = selectedSubcategory === 'all' || p.category_id === selectedSubcategory;
    const matchesSearch = !searchFilter.trim() || 
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesSub && matchesSearch;
  });

  if (sortBy === 'price-low') {
    processedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    processedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    processedProducts.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0));
  }

  return (
    <div className="category-page section-padding container" style={{ minHeight: '60vh' }}>
      <div className="mb-8 text-center" style={{ marginBottom: '30px' }}>
        <span className="section-subtitle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
          <Sparkles size={14} /> Saugaat Signature Curation
        </span>
        <h1 className="section-title" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', fontSize: '2.5rem', marginTop: '8px', marginBottom: '12px' }}>
          {searchFilter ? `Search Results for "${searchFilter}"` : categoryName}
        </h1>
        <div className="title-underline" style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary-color)', margin: '0 auto' }}></div>
        <p className="text-muted mt-4" style={{ marginTop: '12px' }}>
          {loading ? 'Fetching luxury items...' : `Displaying ${processedProducts.length} exquisite creations`}
        </p>
      </div>

      {/* Filter & Sorting Toolbar */}
      <div className="glass" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 24px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px',
        border: '1px solid rgba(200, 169, 107, 0.25)'
      }}>
        {/* Subcategories buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {subcategoriesList.length > 0 && (
            <>
              <button 
                onClick={() => setSelectedSubcategory('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: selectedSubcategory === 'all' ? 'var(--primary-color)' : 'transparent',
                  color: selectedSubcategory === 'all' ? 'white' : 'var(--primary-color)',
                  border: `1px solid ${selectedSubcategory === 'all' ? 'var(--primary-color)' : 'rgba(31, 77, 58, 0.2)'}`,
                  cursor: 'pointer'
                }}
              >
                All {categoryName}
              </button>
              {subcategoriesList.map(sub => (
                <button 
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: selectedSubcategory === sub.id ? 'var(--primary-color)' : 'transparent',
                    color: selectedSubcategory === sub.id ? 'white' : 'var(--primary-color)',
                    border: `1px solid ${selectedSubcategory === sub.id ? 'var(--primary-color)' : 'rgba(31, 77, 58, 0.2)'}`,
                    cursor: 'pointer'
                  }}
                >
                  {sub.name}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <ArrowUpDown size={16} style={{ color: 'var(--secondary-color)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>Sort By:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              fontWeight: 500,
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="featured">Featured Curations</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
          <RefreshCw size={36} className="spin-anim" style={{ color: 'var(--secondary-color)' }} />
        </div>
      ) : processedProducts.length === 0 ? (
        <div className="glass text-center" style={{ padding: '60px 20px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>No matching gifts found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Try clearing filters or search terms.</p>
          <button 
            onClick={() => {
              setSelectedSubcategory('all');
              setSearchFilter('');
            }} 
            className="btn btn-primary" 
            style={{ marginTop: '20px' }}
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
          {processedProducts.map((product, index) => {
            const isWishlisted = isInWishlist(product.id);
            const featuredImg = product.product_images && product.product_images.length > 0
              ? product.product_images.find(img => img.is_featured)?.image_url || product.product_images[0].image_url
              : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800';

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="premium-product-card"
              >
                {product.discount_percentage > 0 ? (
                  <div className="product-badge">{product.discount_percentage}% OFF</div>
                ) : (
                  <div className="product-badge">CURATED</div>
                )}
                <button 
                  className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: featuredImg,
                    description: product.description || ''
                  })}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={18} fill={isWishlisted ? 'var(--accent-color)' : 'none'} color={isWishlisted ? 'var(--accent-color)' : 'currentColor'} />
                </button>
                <div className="product-image-container">
                  <img src={featuredImg} alt={product.name} className="product-image" />
                  <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn btn-primary" style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.8rem', textAlign: 'center', lineHeight: '2.5' }}>
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="premium-product-info">
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < 4 ? 'var(--secondary-color)' : 'none'} color="var(--secondary-color)" />
                      ))}
                    </div>
                    <span className="rating-text">4.8 (32)</span>
                  </div>
                  <h3 className="premium-product-title">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="premium-product-price-wrapper">
                    <span className="product-price">₹{product.price}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="product-original-price">₹{product.original_price}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
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
    </div>
  );
};
