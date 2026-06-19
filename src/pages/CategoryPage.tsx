import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getCategories, getProductsByCategory, getProducts, type Category, type Product } from '../lib/database';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Reset filter and load data when category changes
  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        const allCats = await getCategories();
        setCategories(allCats);

        if (categoryId === 'all') {
          const prods = await getProducts();
          setProductsList(prods);
        } else if (categoryId) {
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

  const currentCategory = categories.find(c => c.id === categoryId);
  const categoryName = currentCategory ? currentCategory.name : (categoryId === 'all' ? 'All Products' : 'Category');

  // Dynamically find subcategories for this category in the database
  const subcategoriesList = categoryId && categoryId !== 'all'
    ? categories.filter(c => c.parent_id === categoryId)
    : [];

  const filteredProducts = selectedSubcategory === 'all'
    ? productsList
    : productsList.filter(p => p.category_id === selectedSubcategory);

  return (
    <div className="category-page section-padding container" style={{ minHeight: '60vh' }}>
      <div className="mb-10 text-center" style={{ marginBottom: '40px' }}>
        <span className="section-subtitle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
          <Sparkles size={14} /> Curated Collections
        </span>
        <h1 className="section-title" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', fontSize: '2.5rem', marginTop: '10px', marginBottom: '15px' }}>{categoryName}</h1>
        <div className="title-underline" style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary-color)', margin: '0 auto' }}></div>
        <p className="text-muted mt-4" style={{ marginTop: '15px' }}>
          {loading ? 'Refreshing collection...' : `Showing ${filteredProducts.length} premium designs`}
        </p>
      </div>

      {/* Subcategory Menu */}
      {!loading && subcategoriesList.length > 0 && (
        <div className="subcategory-nav glass" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '12px', 
          padding: '12px 20px', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '40px',
          flexWrap: 'wrap',
          border: '1px solid rgba(200, 169, 107, 0.15)'
        }}>
          <button 
            onClick={() => setSelectedSubcategory('all')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              backgroundColor: selectedSubcategory === 'all' ? 'var(--primary-color)' : 'transparent',
              color: selectedSubcategory === 'all' ? 'white' : 'var(--primary-color)',
              border: `1px solid ${selectedSubcategory === 'all' ? 'var(--primary-color)' : 'rgba(31, 77, 58, 0.15)'}`,
              transition: 'all 0.2s ease',
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
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                backgroundColor: selectedSubcategory === sub.id ? 'var(--primary-color)' : 'transparent',
                color: selectedSubcategory === sub.id ? 'white' : 'var(--primary-color)',
                border: `1px solid ${selectedSubcategory === sub.id ? 'var(--primary-color)' : 'rgba(31, 77, 58, 0.15)'}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
          <RefreshCw size={36} className="spin-anim" style={{ color: 'var(--secondary-color)' }} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center" style={{ padding: '60px 0' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>No products found in this subcategory.</h3>
          <button 
            onClick={() => setSelectedSubcategory('all')} 
            className="btn btn-primary" 
            style={{ marginTop: '20px' }}
          >
            View All {categoryName}
          </button>
        </div>
      ) : (
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
          {filteredProducts.map((product, index) => {
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
                {product.discount_percentage > 0 && (
                  <div className="product-badge">{product.discount_percentage}% OFF</div>
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
                  <Heart size={18} fill={isWishlisted ? 'var(--accent-color)' : 'none'} />
                </button>

                <div className="product-image-container">
                  <img src={featuredImg} alt={product.name} className="product-image" />
                  <div className="product-actions">
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: featuredImg
                      })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="premium-product-info">
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < 4 ? 'var(--secondary-color)' : 'none'} 
                          color="var(--secondary-color)" 
                        />
                      ))}
                    </div>
                    <span className="rating-text">4.8 (45 reviews)</span>
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
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
