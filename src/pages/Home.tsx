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
  CheckCircle2,
  ShoppingCart,
  MessageSquare
} from 'lucide-react';
import { 
  getParentCategories, 
  getTrendingProducts, 
  getFeaturedHeroProducts,
  getSyncCategories, 
  getSyncTrendingProducts, 
  getSyncFeaturedHeroProducts,
  type Category, 
  type Product 
} from '../lib/database';
import { HeroCarousel } from '../components/HeroCarousel';
import { useCart } from '../context/CartContext';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { preloadCatalogImages } from '../utils/imagePreloader';
import './Home.css';

export const Home: React.FC = () => {
  const { user, points } = useAuth();
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const [categories, setCategories] = useState<Category[]>(() => 
    getSyncCategories().filter(c => c.parent_id === null)
  );
  const [trendingProducts, setTrendingProducts] = useState<Product[]>(() => 
    getSyncTrendingProducts(4)
  );
  const [heroProducts, setHeroProducts] = useState<Product[]>(() => 
    getSyncFeaturedHeroProducts(5)
  );
  const [loading, _setLoading] = useState(false);
  const navigate = useNavigate();

  // Custom Hamper Builder Preview state
  const [hamperStep, setHamperStep] = useState<1 | 2 | 3>(1);
  const [selectedBoxStyle, setSelectedBoxStyle] = useState<'velvet' | 'wooden' | 'gold'>('velvet');
  const [hamperItemsCount, setHamperItemsCount] = useState<number>(3);

  // Preload catalog images in background
  useEffect(() => {
    preloadCatalogImages(trendingProducts, categories);
  }, [categories, trendingProducts]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [parentCats, trendingProds, heroProds] = await Promise.all([
          getParentCategories(),
          getTrendingProducts(4),
          getFeaturedHeroProducts(5)
        ]);
        setCategories(parentCats);
        setTrendingProducts(trendingProds);
        setHeroProducts(heroProds);
      } catch (err) {
        console.error('Error loading home page catalog data:', err);
      }
    };

    loadHomeData();
    window.addEventListener('storage', loadHomeData);
    window.addEventListener('saugaat_catalog_updated', loadHomeData);
    return () => {
      window.removeEventListener('storage', loadHomeData);
      window.removeEventListener('saugaat_catalog_updated', loadHomeData);
    };
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

  const handleQuickBuyDiwaliHamper = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart(item);
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

      {/* Luxury Hero Carousel Section */}
      {heroProducts && heroProducts.length > 0 ? (
        <HeroCarousel products={heroProducts} />
      ) : (
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
      )}

      {/* 🪔 Exclusive Diwali Gift Hampers Festive Spotlight */}
      <section style={{
        background: 'linear-gradient(135deg, #180816 0%, #2e0d1f 50%, #150613 100%)',
        color: 'white',
        padding: '50px 20px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '2px solid #d4af37',
        borderBottom: '2px solid #d4af37',
        boxShadow: '0 12px 35px rgba(0,0,0,0.35)'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '140%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #b8860b 0%, #c41e3a 100%)',
              color: 'white',
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(184, 134, 11, 0.35)',
              marginBottom: '12px'
            }}>
              🪔 FESTIVE CELEBRATION EDITION • SPECIAL OFFER ₹750 EACH
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.9rem)',
              fontWeight: 800,
              color: '#ffffff',
              margin: '8px 0 10px 0',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.2
            }}>
              Exquisite Diwali Gift Hampers
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '1.05rem',
              maxWidth: '750px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Thoughtfully curated for festive blessings, health, and prosperity. Each hamper unites artisanal Indian packaging with our signature 100% natural herbal teas.
            </p>
            <div style={{
              width: '80px',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
              margin: '14px auto 0 auto'
            }}></div>
          </div>

          {/* 2 Hampers Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '30px',
            alignItems: 'stretch'
          }}>
            {/* Hamper 1: Jute Bag 3 Teas */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(212, 175, 55, 0.4)',
                borderRadius: 'var(--radius-lg, 16px)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Product Image */}
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md, 10px)',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                marginBottom: '18px',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px'
              }}>
                <img
                  src="/products/diwali-herbal-tea-jute-hamper.jpg"
                  alt="Diwali Herbal Tea Trio Jute Gift Hamper"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-sm)'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'linear-gradient(135deg, #c41e3a 0%, #b8860b 100%)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '11px',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 10px rgba(196, 30, 58, 0.4)'
                }}>
                  🪔 3 HERBAL TEAS + JUTE TOTE
                </span>
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(11, 34, 57, 0.9)',
                  color: '#d4af37',
                  fontWeight: 700,
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid #d4af37'
                }}>
                  Net Wt: 3 x 50g
                </span>
              </div>

              {/* Title & Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                <h3 style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  Diwali Herbal Tea Trio Jute Hamper
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#d4af37' }}>
                  ₹750
                </span>
                <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>
                  ₹999
                </span>
                <span style={{
                  backgroundColor: '#e63946',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  25% OFF
                </span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginLeft: 'auto' }}>
                  (₹750 each)
                </span>
              </div>

              {/* Description */}
              <p style={{
                color: 'rgba(255, 255, 255, 0.82)',
                fontSize: '0.9rem',
                lineHeight: 1.55,
                marginBottom: '16px',
                flexGrow: 1
              }}>
                Handcrafted natural jute tote bag with delicate white lace embroidery. Contains 3 signature 100% natural, caffeine-free herbal teas: <strong>Damask Rose</strong> (radiant skin & detox), <strong>Blue Pea</strong> (brain vitality & antioxidants), and <strong>Chamomile</strong> (calm & restful sleep).
              </p>

              {/* Inclusions pill */}
              <div style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.82rem',
                color: '#f6d365',
                marginBottom: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div>🌿 <strong>Tea Trio:</strong> Rose Tea (50g) + Blue Pea (50g) + Chamomile (50g)</div>
                <div>🎁 <strong>Packaging:</strong> Premium Embroidered Lace Jute Tote Carry Bag</div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => handleQuickBuyDiwaliHamper({
                    id: '098a7cc7-986e-412d-8e7e-d5530689924b',
                    name: 'Diwali Herbal Tea Trio Jute Gift Hamper',
                    price: 750,
                    image: '/products/diwali-herbal-tea-jute-hamper.jpg'
                  })}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#d4af37',
                    borderColor: '#d4af37',
                    color: '#0b2239',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)'
                  }}
                >
                  <ShoppingCart size={18} /> BUY NOW (₹750 EACH)
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`https://wa.me/918368229705?text=${encodeURIComponent('*DIWALI FESTIVE HAMPER ORDER - SAUGAAT*\n----------------------------------------\n🪔 *Hamper:* Diwali Herbal Tea Trio Jute Gift Hamper\n💰 *Festive Price:* ₹750 each (Net Wt: 3 x 50g)\n🎁 *Packaging:* Handcrafted Lace Jute Tote Bag\n----------------------------------------\nHi Saugaat Team, I want to order this Diwali Herbal Tea Trio Jute Hamper for ₹750! Please guide me with delivery details.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      flex: 1,
                      backgroundColor: '#25D366',
                      borderColor: '#25D366',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MessageSquare size={16} /> WhatsApp Order
                  </a>

                  <Link
                    to="/product/098a7cc7-986e-412d-8e7e-d5530689924b"
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      borderColor: 'rgba(255,255,255,0.4)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Hamper 2: Royal Palace Arch Box + Silver Idol + 2 Teas */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(212, 175, 55, 0.4)',
                borderRadius: 'var(--radius-lg, 16px)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Product Image */}
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md, 10px)',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                marginBottom: '18px',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px'
              }}>
                <img
                  src="/products/diwali-shubh-labh-tea-hamper.jpg"
                  alt="Diwali Shubh Labh Festive Tea & Idol Gift Hamper"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-sm)'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'linear-gradient(135deg, #b8860b 0%, #c41e3a 100%)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '11px',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 10px rgba(184, 134, 11, 0.4)'
                }}>
                  🪔 SILVER IDOL + 2 HERBAL TEAS
                </span>
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(11, 34, 57, 0.9)',
                  color: '#d4af37',
                  fontWeight: 700,
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid #d4af37'
                }}>
                  Net Wt: 2 x 50g + Idol
                </span>
              </div>

              {/* Title & Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                <h3 style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  Diwali Shubh Labh Festive Tea & Idol Hamper
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#d4af37' }}>
                  ₹750
                </span>
                <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>
                  ₹1,050
                </span>
                <span style={{
                  backgroundColor: '#e63946',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  29% OFF
                </span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginLeft: 'auto' }}>
                  (₹750 each)
                </span>
              </div>

              {/* Description */}
              <p style={{
                color: 'rgba(255, 255, 255, 0.82)',
                fontSize: '0.9rem',
                lineHeight: 1.55,
                marginBottom: '16px',
                flexGrow: 1
              }}>
                Auspicious Diwali celebration hamper in a royal palace motif carrying box. Features a sacred Silver-finish Shubh Labh idol in a royal red velvet jewelry box, paired with revitalizing <strong>Tulsi Green Tea</strong> for antioxidant defense and potent <strong>Immunity Herbal Tea</strong>.
              </p>

              {/* Inclusions pill */}
              <div style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.82rem',
                color: '#f6d365',
                marginBottom: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div>🪔 <strong>Divine Blessing:</strong> Sacred Silver Shubh Labh Idol in Red Velvet Box</div>
                <div>🌿 <strong>Wellness Teas:</strong> Tulsi Green Tea (50g) + Immunity Herbal Tea (50g)</div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => handleQuickBuyDiwaliHamper({
                    id: '8dc46d83-0f12-44c5-a492-59fc5e88491c',
                    name: 'Diwali Shubh Labh Festive Tea & Idol Gift Hamper',
                    price: 750,
                    image: '/products/diwali-shubh-labh-tea-hamper.jpg'
                  })}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#d4af37',
                    borderColor: '#d4af37',
                    color: '#0b2239',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)'
                  }}
                >
                  <ShoppingCart size={18} /> BUY NOW (₹750 EACH)
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`https://wa.me/918368229705?text=${encodeURIComponent('*DIWALI FESTIVE HAMPER ORDER - SAUGAAT*\n----------------------------------------\n🪔 *Hamper:* Diwali Shubh Labh Festive Tea & Idol Gift Hamper\n💰 *Festive Price:* ₹750 each (Net Wt: 2 x 50g + Silver Idol)\n🎁 *Inclusions:* Silver Shubh Labh Idol + Palace Motif Box\n----------------------------------------\nHi Saugaat Team, I want to order this Diwali Shubh Labh Festive Hamper for ₹750! Please guide me with delivery details.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      flex: 1,
                      backgroundColor: '#25D366',
                      borderColor: '#25D366',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MessageSquare size={16} /> WhatsApp Order
                  </a>

                  <Link
                    to="/product/8dc46d83-0f12-44c5-a492-59fc5e88491c"
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      borderColor: 'rgba(255,255,255,0.4)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ⚡ Special Flash Sale Spotlight Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0b2239 0%, #1f4d3a 100%)',
        color: 'white',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '2px solid var(--secondary-color)',
        borderBottom: '2px solid var(--secondary-color)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '35px',
            alignItems: 'center'
          }}>
            {/* Poster / Product image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                backgroundColor: '#fff',
                border: '2px solid var(--secondary-color)',
                textAlign: 'center',
                padding: '8px'
              }}
            >
              <img
                src="/products/rassrang-bedsheet-combo-4pack.jpg"
                alt="Rassrang Bedsheet Flash Sale Get 4 at Price of 2"
                style={{
                  width: '100%',
                  maxHeight: '440px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                color: 'white',
                fontWeight: 900,
                fontSize: '13px',
                padding: '6px 14px',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(230, 57, 70, 0.5)',
                letterSpacing: '0.5px'
              }}>
                ⚡ 50% OFF FLASH SALE
              </div>
            </motion.div>

            {/* Content & Offer Box */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              <div>
                <span style={{
                  color: 'var(--secondary-color)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  display: 'inline-block',
                  marginBottom: '6px'
                }}>
                  👑 RASSRANG HOME DECOR EXCLUSIVE
                </span>
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  GET 4 AT THE PRICE OF TWO!
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', marginTop: '8px', lineHeight: 1.5 }}>
                  Rassrang Luxury Double Bedsheet Set — Pack of 4 featuring vibrant assorted colours & intricate floral & geometric prints.
                </p>
              </div>

              {/* Offer Pricing Highlight Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(200, 169, 107, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>MRP of Single Bed Sheet:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>₹1,499</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>4 Bed Sheets Standard Price:</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', fontWeight: 600 }}>₹5,996</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <div>
                    <span style={{ color: 'var(--secondary-color)', fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>FLASH SALE OFFER PRICE:</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#25D366' }}>GET 4 FOR ₹2,998</span>
                  </div>
                  <span style={{
                    backgroundColor: '#e63946',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}>
                    SAVE ₹2,998
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} style={{ color: 'var(--secondary-color)' }} />
                  <span><strong>Vibrant Prints:</strong> Showcasing intricate floral and geometric designs.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--secondary-color)' }} />
                  <span><strong>Double Bed Sheet:</strong> Perfect fit for larger double & king beds.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={16} style={{ color: 'var(--secondary-color)' }} />
                  <span><strong>Cotton Feel Fabric:</strong> Soft, breathable, and comfortable against the skin.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
                <a
                  href="https://wa.me/918368229705?text=Hi%20Rassrang%20Support%2C%20I%20want%20to%20order%20the%204%20Bedsheets%20for%20%E2%82%B92998%20Flash%20Sale%20Offer!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    backgroundColor: '#25D366',
                    borderColor: '#25D366',
                    color: 'white',
                    fontWeight: 800,
                    padding: '14px 24px',
                    fontSize: '0.95rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)'
                  }}
                >
                  <Gift size={20} /> ORDER NOW: 8368229705
                </a>
                <Link
                  to="/category/bed-sheets"
                  className="btn btn-secondary"
                  style={{
                    padding: '14px 24px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Explore Bed Sheets Category <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
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
              {categories.filter(c => c.id !== 'idols' && c.id !== 'toys').map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/category/${category.id}`} className="luxury-category-card">
                    <div className="category-image-circle">
                      <img 
                        src={getOptimizedImageUrl(category.image_url, { width: 300, quality: 75 })} 
                        alt={category.name} 
                        className="category-image" 
                        loading="eager" 
                        decoding="async" 
                      />
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
              <img src={getOptimizedImageUrl("https://images.unsplash.com/photo-1605806616949-1e87b487cb2a", { width: 500, quality: 68 })} alt="Brass Artisan Craft" loading="lazy" decoding="async" />
              <div className="visual-card-glow"></div>
            </div>
            <div className="visual-card-small shadow-lg">
              <img src={getOptimizedImageUrl("https://images.unsplash.com/photo-1513201099705-a9746e1e201f", { width: 400, quality: 68 })} alt="Ribbon Packing" loading="lazy" decoding="async" />
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
                  : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format,compress&fit=crop&q=68&w=400&fm=webp';

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="product-card"
                  >
                    <button 
                      className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
                      onClick={() => handleToggleWishlist(product)}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart size={18} fill={isWishlisted ? 'var(--accent-color)' : 'none'} />
                    </button>
                    <div className="product-image-container">
                      <img 
                        src={getOptimizedImageUrl(featuredImg, { width: 400, quality: 68 })} 
                        alt={product.name} 
                        className="product-image" 
                        loading="lazy" 
                        decoding="async" 
                      />
                      <div className="product-actions" style={{ gap: '6px', padding: '8px' }}>
                        <Link 
                          to={`/product/${product.id}`} 
                          className="btn btn-primary" 
                          style={{ 
                            flex: 1, 
                            textTransform: 'uppercase', 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            padding: '8px 4px', 
                            lineHeight: '1.2', 
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.5px', 
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          Details
                        </Link>
                        {(product.price === 0 || product.category_id === 'curtains') && (
                          <Link 
                            to={`/product/${product.id}`}
                            className="btn btn-secondary" 
                            style={{ 
                              flex: 1.3, 
                              textTransform: 'uppercase', 
                              fontSize: '0.72rem', 
                              fontWeight: 700, 
                              padding: '8px 4px', 
                              lineHeight: '1.2', 
                              whiteSpace: 'nowrap',
                              letterSpacing: '0.5px', 
                              backgroundColor: '#25D366', 
                              color: 'white', 
                              borderColor: '#25D366',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            Get Quote
                          </Link>
                        )}
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
                        {product.price === 0 || product.category_id === 'curtains' ? (
                          <span className="product-price" style={{ fontSize: '0.95rem', color: 'var(--primary-color)', fontWeight: 700 }}>Price on Request</span>
                        ) : (
                          <>
                            <span className="product-price">₹{product.price}</span>
                            {product.original_price && product.original_price > product.price && (
                              <span className="product-original-price">₹{product.original_price}</span>
                            )}
                          </>
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
