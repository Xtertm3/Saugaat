import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { products, categories } from '../data/mockData';
import { useCart } from '../context/CartContext';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  
  const category = categories.find(c => c.id === categoryId);
  const categoryName = category ? category.name : (categoryId === 'all' ? 'All Products' : 'Category');
  
  const displayProducts = categoryId === 'all' 
    ? products 
    : products.filter(p => p.category === categoryId);

  return (
    <div className="category-page section-padding container" style={{ minHeight: '60vh' }}>
      <div className="mb-10 text-center">
        <h1 className="section-title">{categoryName}</h1>
        <div className="title-underline"></div>
        <p className="text-muted mt-4">Showing {displayProducts.length} products</p>
      </div>

      {displayProducts.length === 0 ? (
        <div className="text-center" style={{ padding: '40px 0' }}>
          <h3>No products found in this category.</h3>
          <Link to="/category/all" className="btn btn-primary mt-4" style={{ marginTop: '20px' }}>View All Products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {displayProducts.map((product, index) => {
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
