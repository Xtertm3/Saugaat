import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Sparkles } from 'lucide-react';
import { products, categories } from '../data/mockData';
import { useCart } from '../context/CartContext';

const SUBCATEGORIES: Record<string, string[]> = {
  'home-decor': ['Wall Decor', 'Showpieces', 'Vases & Planters'],
  'idols': ['Ganesha Idols', 'Krishna Idols'],
  'festivals': ['Diwali', 'Holi'],
  'toys': ['Wooden Toys', 'Educational Toys'],
  'gift-packs': ['Premium Gifts', 'Combo Packs'],
  'return-gifts': ['Wedding Favors', 'Party Favors'],
  'just-like-that': ['Mugs', 'Spontaneous Gifts']
};

const getProductSubcategory = (productName: string): string => {
  const name = productName.toLowerCase();
  if (name.includes('urli') || name.includes('peacock') || name.includes('candle holder') || name.includes('candle holders')) return 'Showpieces';
  if (name.includes('vase') || name.includes('planter') || name.includes('planters') || name.includes('vases')) return 'Vases & Planters';
  if (name.includes('hanging') || name.includes('light') || name.includes('fixture') || name.includes('decor')) return 'Wall Decor';
  
  if (name.includes('ganesha') || name.includes('saraswati') || name.includes('idol') || name.includes('figurine') || name.includes('deity')) return 'Ganesha Idols';
  if (name.includes('krishna') || name.includes('murti') || name.includes('flute')) return 'Krishna Idols';
  
  if (name.includes('rakhi') || name.includes('diwali') || name.includes('pooja') || name.includes('incense') || name.includes('diyas') || name.includes('diya') || name.includes('lantern')) return 'Diwali';
  if (name.includes('holi') || name.includes('color')) return 'Holi';
  
  if (name.includes('educational') || name.includes('puzzle')) return 'Educational Toys';
  if (name.includes('train') || name.includes('wooden') || name.includes('stacker') || name.includes('block') || name.includes('blocks')) return 'Wooden Toys';
  
  if (name.includes('saffron') || name.includes('fruits') || name.includes('almonds') || name.includes('sweets') || name.includes('nuts')) return 'Combo Packs';
  if (name.includes('premium occasion') || name.includes('luxury') || name.includes('gift pack') || name.includes('gift tray')) return 'Premium Gifts';
  
  if (name.includes('potli') || name.includes('potlis') || name.includes('favor') || name.includes('favors')) return 'Party Favors';
  if (name.includes('bowl') || name.includes('bowls') || name.includes('plate') || name.includes('wedding')) return 'Wedding Favors';
  
  if (name.includes('mug') || name.includes('coffee') || name.includes('cup')) return 'Mugs';
  return 'Spontaneous Gifts';
};

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  // Reset filter when category changes
  useEffect(() => {
    setSelectedSubcategory('all');
  }, [categoryId]);
  
  const category = categories.find(c => c.id === categoryId);
  const categoryName = category ? category.name : (categoryId === 'all' ? 'All Products' : 'Category');
  
  const displayProducts = categoryId === 'all' 
    ? products 
    : products.filter(p => p.category === categoryId);

  const subcategoriesList = categoryId && SUBCATEGORIES[categoryId] ? SUBCATEGORIES[categoryId] : [];

  const filteredProducts = selectedSubcategory === 'all'
    ? displayProducts
    : displayProducts.filter(p => getProductSubcategory(p.name) === selectedSubcategory);

  return (
    <div className="category-page section-padding container" style={{ minHeight: '60vh' }}>
      <div className="mb-10 text-center" style={{ marginBottom: '40px' }}>
        <span className="section-subtitle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
          <Sparkles size={14} /> Curated Collections
        </span>
        <h1 className="section-title" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', fontSize: '2.5rem', marginTop: '10px', marginBottom: '15px' }}>{categoryName}</h1>
        <div className="title-underline" style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary-color)', margin: '0 auto' }}></div>
        <p className="text-muted mt-4" style={{ marginTop: '15px' }}>Showing {filteredProducts.length} premium designs</p>
      </div>

      {/* Subcategory Menu */}
      {subcategoriesList.length > 0 && (
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
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                backgroundColor: selectedSubcategory === sub ? 'var(--primary-color)' : 'transparent',
                color: selectedSubcategory === sub ? 'white' : 'var(--primary-color)',
                border: `1px solid ${selectedSubcategory === sub ? 'var(--primary-color)' : 'rgba(31, 77, 58, 0.15)'}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 ? (
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
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="premium-product-card"
              >
                {product.discount && <div className="product-badge">{product.discount}</div>}
                
                <button 
                  className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    description: product.description || ''
                  })}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={18} fill={isWishlisted ? 'var(--accent-color)' : 'none'} />
                </button>

                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-actions">
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image
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
                    {product.originalPrice && (
                      <span className="product-original-price">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
