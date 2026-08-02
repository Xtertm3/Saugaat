import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Heart,
  Gift,
  Star,
  RefreshCw,
  LayoutDashboard,
  Box,
  CheckCircle2
} from 'lucide-react';
import { getParentCategories, getTrendingProducts, type Category, type Product } from '../lib/database';
import { useCart } from '../context/CartContext';
import './Home.css';

export const Home: React.FC = () => {
  const { user, points } = useAuth();
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Custom Hamper Builder Preview state
  const [hamperStep, setHamperStep] = useState<1 | 2 | 3>(1);
  const [selectedBoxStyle, setSelectedBoxStyle] = useState<'velvet' | 'wooden' | 'gold'>('velvet');
  const [hamperItemsCount, setHamperItemsCount] = useState<number>(3);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [parentCats, trendingProds] = await Promise.all([
          getParentCategories(),
          getTrendingProducts(4)
        ]);
        setCategories(parentCats);
        setTrendingProducts(trendingProds);
      } catch (err) {
        console.error('Error loading home page catalog data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleToggleWishlist = (product: Product) => {
    const featuredImg = product.product_images && product.product_images.length > 0
      ? product.product_images.find(img => img.is_featured)?.image_url || product.product_images[0].image_url
      : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800';
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: featuredImg,
      description: product.description || ''
    });
  };

  const handleQuickAddHamper = () => {
    addToCart({
      id: `custom-hamper-${Date.now()}`,
      name: `Custom ${selectedBoxStyle.toUpperCase()} Luxury Gift Hamper Box (${hamperItemsCount} items)`,
      price: selectedBoxStyle === 'wooden' ? 2499 : selectedBoxStyle === 'gold' ? 3499 : 1999,
      image: selectedBoxStyle === 'wooden' 
        ? 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800'
    });
    navigate('/cart');
  };

  return (
    <div className="home-page-wrapper">
      {/* Logged in User Dashboard Banner */}
      {user && (
        <div style={{
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: 'inset 0 -2px 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <Sparkles size={16} style={{ color: 'var(--secondary-color)' }} />
            <span>Welcome back, <strong>{user.email?.split('@')[0]}</strong>! You have <strong>{points} Rewards Points</strong>.</span>
          </div>
          <Link to="/dashboard" className="btn btn-accent" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
            <LayoutDashboard size={14} style={{ marginRight: '6px' }} /> Go to My Dashboard
          </Link>
        </div>
      )}

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
          
          {loading && categories.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <RefreshCw size={28} className="spin-anim" style={{ color: 'var(--secondary-color)' }} />
            </div>
          ) : (
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
                      <img src={category.image_url} alt={category.name} className="category-image" />
                      <div className="category-image-overlay"></div>
                    </div>
                    <span className="category-name-premium">{category.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Custom Hamper Box Builder Showcase */}
      <section className="section-padding" style={{ backgroundColor: 'rgba(31, 77, 58, 0.03)', borderTop: '1px solid rgba(200, 169, 107, 0.2)', borderBottom: '1px solid rgba(200, 169, 107, 0.2)' }}>
        <div className="container">
          <div className="text-center mb-10">
            <span className="section-subtitle"><Box size={14} style={{ display: 'inline', marginRight: '4px' }} /> Signature Interactive Experience</span>
            <h2 className="luxury-section-title">Build Your Custom Gift Box</h2>
            <p className="text-muted" style={{ marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Curate a bespoke gift box with hand-picked items, custom velvet linings, and personalized calligraphy cards.
            </p>
            <div className="title-underline" style={{ margin: '12px auto 30px auto' }}></div>
          </div>

          <div className="glass shadow-lg" style={{ borderRadius: 'var(--radius-lg)', padding: '30px', maxWidth: '900px', margin: '0 auto', border: '1px solid rgba(200, 169, 107, 0.3)' }}>
            {/* Steps indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '20px' }}>
              <div 
                onClick={() => setHamperStep(1)} 
                style={{ cursor: 'pointer', textAlign: 'center', opacity: hamperStep === 1 ? 1 : 0.6, fontWeight: hamperStep === 1 ? 700 : 500, color: hamperStep === 1 ? 'var(--primary-color)' : 'var(--text-muted)' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: hamperStep === 1 ? 'var(--primary-color)' : '#eee', color: hamperStep === 1 ? 'white' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>1</div>
                1. Box Style
              </div>
              <div 
                onClick={() => setHamperStep(2)} 
                style={{ cursor: 'pointer', textAlign: 'center', opacity: hamperStep === 2 ? 1 : 0.6, fontWeight: hamperStep === 2 ? 700 : 500, color: hamperStep === 2 ? 'var(--primary-color)' : 'var(--text-muted)' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: hamperStep === 2 ? 'var(--primary-color)' : '#eee', color: hamperStep === 2 ? 'white' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>2</div>
                2. Items Selection
              </div>
              <div 
                onClick={() => setHamperStep(3)} 
                style={{ cursor: 'pointer', textAlign: 'center', opacity: hamperStep === 3 ? 1 : 0.6, fontWeight: hamperStep === 3 ? 700 : 500, color: hamperStep === 3 ? 'var(--primary-color)' : 'var(--text-muted)' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: hamperStep === 3 ? 'var(--primary-color)' : '#eee', color: hamperStep === 3 ? 'white' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>3</div>
                3. Final Review
              </div>
            </div>

            {/* Step 1: Box Style */}
            {hamperStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div 
                  onClick={() => setSelectedBoxStyle('velvet')}
                  style={{
                    border: selectedBoxStyle === 'velvet' ? '2px solid var(--secondary-color)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: selectedBoxStyle === 'velvet' ? 'rgba(200, 169, 107, 0.08)' : 'white'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '8px' }}>Royal Velvet Casket</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Deep emerald plush padding with gold accent clasp</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>₹1,999 Base</div>
                </div>

                <div 
                  onClick={() => setSelectedBoxStyle('wooden')}
                  style={{
                    border: selectedBoxStyle === 'wooden' ? '2px solid var(--secondary-color)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: selectedBoxStyle === 'wooden' ? 'rgba(200, 169, 107, 0.08)' : 'white'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '8px' }}>Hand-Carved Teak Chest</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Solid wooden brass inlaid keepsake box</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>₹2,499 Base</div>
                </div>

                <div 
                  onClick={() => setSelectedBoxStyle('gold')}
                  style={{
                    border: selectedBoxStyle === 'gold' ? '2px solid var(--secondary-color)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: selectedBoxStyle === 'gold' ? 'rgba(200, 169, 107, 0.08)' : 'white'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '8px' }}>Gold-Gilded Trunk</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Festive hamper box with silk ribbon ties</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>₹3,499 Base</div>
                </div>
              </div>
            )}

            {/* Step 2: Items count */}
            {hamperStep === 2 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '16px' }}>Select Number of Curation Items</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                  {[3, 4, 5].map(cnt => (
                    <button
                      key={cnt}
                      onClick={() => setHamperItemsCount(cnt)}
                      style={{
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-md)',
                        border: hamperItemsCount === cnt ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                        backgroundColor: hamperItemsCount === cnt ? 'var(--primary-color)' : 'white',
                        color: hamperItemsCount === cnt ? 'white' : 'var(--primary-color)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      {cnt} Items Pack
                    </button>
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Includes brass diya, scented soy wax candle, organic dry fruits, and handpainted coasters.</p>
              </div>
            )}

            {/* Step 3: Final Review & CTA */}
            {hamperStep === 3 && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <CheckCircle2 size={40} style={{ color: 'var(--secondary-color)', margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>Your Customized Gift Hamper</h3>
                <p style={{ color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>
                  Style: <strong style={{ textTransform: 'capitalize' }}>{selectedBoxStyle} Box</strong> | Items: <strong>{hamperItemsCount} Premium Items</strong>
                </p>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '20px' }}>
                  Total: ₹{selectedBoxStyle === 'wooden' ? 2499 : selectedBoxStyle === 'gold' ? 3499 : 1999}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              {hamperStep > 1 ? (
                <button onClick={() => setHamperStep((hamperStep - 1) as any)} className="btn btn-secondary">Previous Step</button>
              ) : <div></div>}

              {hamperStep < 3 ? (
                <button onClick={() => setHamperStep((hamperStep + 1) as any)} className="btn btn-primary">Next Step <ArrowRight size={16} style={{ marginLeft: '6px' }} /></button>
              ) : (
                <button onClick={handleQuickAddHamper} className="btn btn-primary" style={{ backgroundColor: 'var(--secondary-color)' }}>
                  Add Custom Hamper to Cart <Gift size={16} style={{ marginLeft: '6px' }} />
                </button>
              )}
            </div>
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

          {loading && trendingProducts.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <RefreshCw size={32} className="spin-anim" style={{ color: 'var(--secondary-color)' }} />
            </div>
          ) : (
            <div className="product-grid">
              {trendingProducts.map((product, index) => {
                const isWishlisted = isInWishlist(product.id);
                const featuredImg = product.product_images && product.product_images.length > 0
                  ? product.product_images.find(img => img.is_featured)?.image_url || product.product_images[0].image_url
                  : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800';

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="premium-product-card"
                  >
                    {product.discount_percentage > 0 ? (
                      <div className="product-badge">{product.discount_percentage}% OFF</div>
                    ) : (
                      <div className="product-badge">TRENDING</div>
                    )}
                    <button 
                      className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
                      onClick={() => handleToggleWishlist(product)}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart size={18} fill={isWishlisted ? 'var(--accent-color)' : 'none'} />
                    </button>
                    <div className="product-image-container">
                      <img src={featuredImg} alt={product.name} className="product-image" />
                      <div className="product-actions">
                        <Link to={`/product/${product.id}`} className="btn btn-primary" style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', textAlign: 'center', lineHeight: '2.5' }}>
                          View Details
                        </Link>
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
