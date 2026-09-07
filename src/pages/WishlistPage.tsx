import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { Heart, ArrowLeft, Star } from 'lucide-react';
import './Home.css';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    toggleWishlist(item); // Remove from wishlist on move to cart
  };

  return (
    <div className="wishlist-page-wrapper bg-light-sand" style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/" className="link-arrow" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '24px', gap: '6px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>

        <div className="dashboard-section-header" style={{ marginBottom: '32px' }}>
          <div>
            <span className="section-subtitle">Favorites</span>
            <h2 className="luxury-section-title">My Wishlist</h2>
            <div className="title-underline"></div>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="glass text-center" style={{ padding: '60px 40px', borderRadius: 'var(--radius-lg)' }}>
            <Heart size={48} className="text-secondary" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>Your Wishlist is Empty</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '8px auto 24px auto' }}>
              Bookmark your favorite luxury gifts and spiritual essentials to save them for later!
            </p>
            <Link to="/" className="btn btn-primary">Browse Collections</Link>
          </div>
        ) : (
          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {wishlist.map((item) => (
              <div key={item.id} className="premium-product-card">
                <button 
                  className="wishlist-toggle-btn active"
                  onClick={() => toggleWishlist(item)}
                  title="Remove from Wishlist"
                >
                  <Heart size={18} fill="var(--accent-color)" />
                </button>

                <div className="product-image-container">
                  <img 
                    src={getOptimizedImageUrl(item.image, { width: 400, quality: 68 })} 
                    alt={item.name} 
                    className="product-image" 
                    loading="lazy" 
                    decoding="async" 
                  />
                  <div className="product-actions">
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}
                      onClick={() => handleMoveToCart(item)}
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
                          fill="var(--secondary-color)" 
                          color="var(--secondary-color)" 
                        />
                      ))}
                    </div>
                    <span className="rating-text">4.8 (45 reviews)</span>
                  </div>

                  <h3 className="premium-product-title">
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </h3>

                  <div className="premium-product-price-wrapper">
                    <span className="product-price">₹{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
