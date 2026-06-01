import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories, products } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { UserDashboard } from './UserDashboard';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Heart,
  Gift,
  Star
} from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // If user is logged in, show the dashboard
  if (user) {
    return <UserDashboard />;
  }

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Otherwise, show the regular home page
  return (
    <div className="home-page-wrapper">
      {/* Luxury Hero Section */}
      <section className="luxury-hero">
        <div className="hero-texture-overlay"></div>
        <div className="hero-radial-glow"></div>
        <div className="container relative z-10 hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-main-content"
          >
            <span className="hero-gold-badge">
              <Sparkles size={14} style={{ color: 'var(--secondary-color)' }} />
              Handcrafted Gifting Curation
            </span>
            <h1 className="luxury-hero-main-title">
              The Art of <br />
              <span className="gold-text">Thoughtful Gifting</span>
            </h1>
            <p className="luxury-hero-main-subtitle">
              Discover and share exquisite home decor, divine spiritual essentials, <br />
              and premium handcrafted gift hampers curated for lifetime memories.
            </p>
            <div className="hero-button-group">
              <Link to="/category/all" className="btn btn-primary luxury-hero-btn">
                Explore Curation
              </Link>
              <Link to="/about" className="btn btn-secondary luxury-hero-btn-sec">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shop By Category Section with textures */}
      <section className="section-padding bg-linen-texture">
        <div className="container">
          <div className="text-center mb-10">
            <span className="section-subtitle">Exquisite Collections</span>
            <h2 className="luxury-section-title text-center">Shop by Category</h2>
            <div className="title-underline" style={{ margin: '8px auto' }}></div>
          </div>
          
          <div className="category-grid">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link to={`/category/${category.id}`} className="luxury-category-card">
                  <div className="category-image-circle">
                    <img src={category.image} alt={category.name} className="category-image" />
                    <div className="category-image-overlay"></div>
                  </div>
                  <span className="category-name-premium">{category.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage / Curation Story Panel */}
      <section className="heritage-story-section container">
        <div className="heritage-grid">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="heritage-text-block"
          >
            <span className="section-subtitle">Saugaat Heritage</span>
            <h2 className="heritage-title">Where Tradition Meets Contemporary Luxury</h2>
            <p className="heritage-desc">
              Every single product in our catalog tells a unique story of Indian craftsmanship. 
              We work directly with traditional artisans across Jaipur, Moradabad, and Mysore to bring 
              you authentic creations, packed with premium organic materials and finished with luxury casing.
            </p>
            <div className="heritage-features">
              <div className="h-feature">
                <ShieldCheck className="h-icon" />
                <div>
                  <strong>Authentic Craftsmanship</strong>
                  <span>100% hand-carved and hand-painted by local artisans.</span>
                </div>
              </div>
              <div className="h-feature">
                <Gift className="h-icon" />
                <div>
                  <strong>Signature Packaging</strong>
                  <span>Gifts are wrapped in reusable velvet potlis and gold-gilded boxes.</span>
                </div>
              </div>
            </div>
            <Link to="/about" className="link-arrow" style={{ marginTop: '20px' }}>
              Learn More About Our Craft <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="heritage-visual-block"
          >
            <div className="visual-card-large shadow-lg">
              <img src="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800" alt="Brass Artisan Craft" />
              <div className="visual-card-glow"></div>
            </div>
            <div className="visual-card-small shadow-lg">
              <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800" alt="Ribbon Packing" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Products with Premium Design Grid */}
      <section className="section-padding bg-luxury-gradient">
        <div className="container">
          <div className="dashboard-section-header">
            <div>
              <span className="section-subtitle">Seasonal Favorites</span>
              <h2 className="luxury-section-title">🔥 Trending Curated Gifts</h2>
            </div>
            <Link to="/category/all" className="link-arrow">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {products.slice(0, 4).map((product, index) => {
              const isWishlisted = !!wishlist[product.id];
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="premium-product-card"
                >
                  <div className="product-badge">NEW IN</div>
                  <button 
                    className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart size={18} fill={isWishlisted ? 'var(--accent-color)' : 'none'} />
                  </button>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="product-actions">
                      <button className="btn btn-primary" style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
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
                      <span className="product-original-price">₹{product.originalPrice}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges section */}
      <section className="section-padding container">
        <div className="trust-grid">
          <div className="trust-badge-card">
            <Truck size={32} className="trust-icon" />
            <h3>Secure Express Delivery</h3>
            <p>Free pan-India shipping on orders above ₹1,999 with wooden crate padding.</p>
          </div>
          <div className="trust-badge-card">
            <Gift size={32} className="trust-icon text-accent" />
            <h3>Personalized Greetings</h3>
            <p>Include customized hand-written calligraphy greeting cards with your hampers.</p>
          </div>
          <div className="trust-badge-card">
            <Sparkles size={32} className="trust-icon" />
            <h3>Luxury Customization</h3>
            <p>Need custom corporate bulk gifting designs? Connect with our dedicated curators.</p>
          </div>
        </div>
      </section>

      {/* Feature Banner with Textured Backdrop */}
      <section className="feature-banner text-center">
        <div className="hero-texture-overlay" style={{ background: 'rgba(11, 34, 57, 0.65)' }}></div>
        <div className="container relative z-10">
          <span className="section-subtitle" style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>Spontaneous Love</span>
          <h2 className="feature-title mb-4">Gifts for Every Occasion</h2>
          <p className="feature-desc mb-8">
            Make every single moment memorable and celebrate ties with our handcrafted collections.
          </p>
          <Link to="/category/gift-packs" className="btn btn-accent">Explore Hampers</Link>
        </div>
      </section>
    </div>
  );
};
