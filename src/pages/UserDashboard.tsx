import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Package, 
  Clock, 
  Star, 
  Award, 
  Truck, 
  Calendar, 
  MapPin, 
  Gift, 
  ArrowRight, 
  Search, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion'; 
import { useAuth } from '../context/AuthContext';
import './Home.css';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  isBestseller?: boolean;
  isTrending?: boolean;
  rating: number;
  reviewsCount: number;
}

interface UserStats {
  userName: string;
  totalOrders: number;
  wishlistItems: number;
  points: number;
  tier: string;
  nextTierPoints: number;
}

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const formatName = (email?: string) => {
    if (!email) return 'Valued Guest';
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const [stats, setStats] = useState<UserStats>({
    userName: formatName(user?.email),
    totalOrders: 3,
    wishlistItems: 5,
    points: 350,
    tier: 'Gold Tier Member',
    nextTierPoints: 500,
  });

  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const [bestsellers] = useState<Product[]>([
    {
      id: 'p1',
      name: 'Brass Urli with Diyas',
      price: 1299,
      originalPrice: 1599,
      discount: '18% OFF',
      image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800',
      isBestseller: true,
      rating: 4.8,
      reviewsCount: 124,
    },
    {
      id: 'p2',
      name: 'Marble Ganesha Idol',
      price: 1499,
      originalPrice: 1999,
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800',
      isBestseller: true,
      rating: 4.9,
      reviewsCount: 86,
    },
    {
      id: 'p3',
      name: 'Diwali Festive Pooja Thali',
      price: 899,
      originalPrice: 1299,
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1601379326928-10db74191d90?auto=format&fit=crop&q=80&w=800',
      isBestseller: true,
      rating: 4.7,
      reviewsCount: 62,
    },
    {
      id: 'p4',
      name: 'Ceramic Vases Trio',
      price: 1899,
      originalPrice: 2499,
      discount: '24% OFF',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      isBestseller: true,
      rating: 4.6,
      reviewsCount: 95,
    },
  ]);

  const [trending] = useState<Product[]>([
    {
      id: 'p5',
      name: 'Premium Occasion Gift Hamper',
      price: 2499,
      originalPrice: 2999,
      discount: '16% OFF',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
      isTrending: true,
      rating: 4.9,
      reviewsCount: 154,
    },
    {
      id: 'p6',
      name: 'Set of 10 Assorted Festive Potlis',
      price: 999,
      originalPrice: 1499,
      discount: '33% OFF',
      image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800',
      isTrending: true,
      rating: 4.5,
      reviewsCount: 43,
    },
    {
      id: 'p7',
      name: 'Surprise Coffee Ceramic Mug Set',
      price: 499,
      originalPrice: 699,
      discount: '28% OFF',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
      isTrending: true,
      rating: 4.4,
      reviewsCount: 78,
    },
    {
      id: 'p8',
      name: 'Wooden Educational Toy Board Set',
      price: 599,
      originalPrice: 899,
      discount: '33% OFF',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800',
      isTrending: true,
      rating: 4.8,
      reviewsCount: 110,
    },
  ]);

  const [activities] = useState([
    { id: 1, text: 'You earned 50 loyalty points on your recent purchase.', time: '2 hours ago', icon: Award, color: 'var(--secondary-color)' },
    { id: 2, text: 'Order #SG-98421 has been handed over to courier partner.', time: '5 hours ago', icon: Truck, color: '#4caf50' },
    { id: 3, text: 'You added Brass Urli with Diyas to your wishlist.', time: 'Yesterday', icon: Heart, color: 'var(--accent-color)' },
  ]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newState = { ...prev, [productId]: !prev[productId] };
      setStats(s => ({
        ...s,
        wishlistItems: s.wishlistItems + (newState[productId] ? 1 : -1)
      }));
      return newState;
    });
  };

  const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const isWishlisted = !!wishlist[product.id];
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        viewport={{ once: true }}
        className="premium-product-card"
      >
        <div className="product-badge">{product.discount}</div>
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
                  fill={i < Math.floor(product.rating) ? 'var(--secondary-color)' : 'none'} 
                  color="var(--secondary-color)" 
                />
              ))}
            </div>
            <span className="rating-text">{product.rating} ({product.reviewsCount})</span>
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
  };

  return (
    <div className="user-dashboard-wrapper">
      {/* Welcome Hero Section with Loyalty Card */}
      <section className="user-luxury-hero">
        <div className="container user-hero-grid">
          <div className="hero-welcome-text">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="welcome-badge"
            >
              ✨ Welcome back
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="luxury-hero-title"
            >
              Hello, {stats.userName}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="luxury-hero-subtitle"
            >
              Discover and share the art of premium handcrafted gifts today.
            </motion.p>

            {/* Quick search inside dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="dashboard-search-box"
            >
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search for premium hampers, diyas, vases..." />
              <button className="search-submit">Search</button>
            </motion.div>
          </div>

          {/* Loyalty Level Glass Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="loyalty-glass-card"
          >
            <div className="loyalty-card-glow"></div>
            <div className="card-top">
              <div className="card-badge">
                <Award size={16} />
                <span>{stats.tier}</span>
              </div>
              <span className="card-logo">SAUGAAT</span>
            </div>
            <div className="card-middle">
              <span className="points-label">Gifting Balance</span>
              <div className="points-value">
                <span className="number">{stats.points}</span>
                <span className="unit">Points</span>
              </div>
            </div>
            <div className="card-bottom">
              <div className="progress-text">
                <span>Next Tier: Platinum</span>
                <span>{stats.points} / {stats.nextTierPoints} XP</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${(stats.points / stats.nextTierPoints) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="dashboard-stats-grid container">
        <motion.div
          whileHover={{ translateY: -5 }}
          className="dashboard-stat-card bg-navy"
        >
          <div className="icon-wrapper">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Orders</span>
            <span className="stat-number">{stats.totalOrders}</span>
            <span className="stat-helper">All shipments active</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ translateY: -5 }}
          className="dashboard-stat-card bg-gold"
        >
          <div className="icon-wrapper">
            <Heart size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Wishlisted Items</span>
            <span className="stat-number">{stats.wishlistItems}</span>
            <span className="stat-helper">Curated by you</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ translateY: -5 }}
          className="dashboard-stat-card bg-white"
        >
          <div className="icon-wrapper">
            <Gift size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Hampers</span>
            <span className="stat-number">2</span>
            <span className="stat-helper">Coupons ready to claim</span>
          </div>
        </motion.div>
      </section>

      {/* Active Order Tracker & Activity Feed */}
      <section className="tracker-activity-section container">
        {/* Active Order Status Timeline */}
        <div className="tracker-panel glass">
          <div className="panel-header">
            <h3 className="panel-title">
              <Truck size={18} />
              Current Order: #SG-98421
            </h3>
            <span className="delivery-est">Est. Delivery: June 05, 2026</span>
          </div>
          
          <div className="timeline-container">
            <div className="timeline-line">
              <div className="timeline-line-fill" style={{ width: '66%' }}></div>
            </div>
            
            <div className="timeline-step completed">
              <div className="step-dot">
                <CheckCircle2 size={16} />
              </div>
              <span className="step-label">Ordered</span>
              <span className="step-time">May 30, 2026</span>
            </div>

            <div className="timeline-step completed">
              <div className="step-dot">
                <CheckCircle2 size={16} />
              </div>
              <span className="step-label">Processing</span>
              <span className="step-time">May 31, 2026</span>
            </div>

            <div className="timeline-step active">
              <div className="step-dot">
                <div className="pulse-ring"></div>
              </div>
              <span className="step-label">In Transit</span>
              <span className="step-time">On the Way</span>
            </div>

            <div className="timeline-step pending">
              <div className="step-dot"></div>
              <span className="step-label">Delivered</span>
              <span className="step-time">Pending</span>
            </div>
          </div>
          
          <div className="tracker-footer">
            <span className="status-note">Latest update: Package departed Hyderabad Hub.</span>
            <Link to="/my-orders" className="track-details-btn">
              Track Details <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Activities Feed */}
        <div className="activity-panel glass">
          <h3 className="panel-title">
            <Clock size={18} />
            Recent Updates
          </h3>
          <div className="activity-list">
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="activity-item">
                  <div className="activity-icon-wrapper" style={{ backgroundColor: act.color + '20', color: act.color }}>
                    <Icon size={16} />
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">{act.text}</p>
                    <span className="activity-time">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="section-padding bg-luxury-gradient">
        <div className="container">
          <div className="dashboard-section-header">
            <div>
              <span className="section-subtitle">Handpicked Crafts</span>
              <h2 className="luxury-section-title">⭐ Popular Bestsellers</h2>
            </div>
            <Link to="/category/all" className="link-arrow">
              View All Bestsellers <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {bestsellers.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="section-padding container">
        <div className="dashboard-section-header">
          <div>
            <span className="section-subtitle">Must-Haves This Season</span>
            <h2 className="luxury-section-title">🔥 Trending Right Now</h2>
          </div>
          <Link to="/category/all" className="link-arrow">
            Explore Trending Products <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {trending.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      {/* Quick Actions & Navigation Cards */}
      <section className="section-padding bg-light-sand">
        <div className="container">
          <div className="text-center mb-10">
            <span className="section-subtitle">Account Control Center</span>
            <h2 className="luxury-section-title text-center">Quick Management Services</h2>
            <div className="title-underline" style={{ margin: '8px auto' }}></div>
          </div>
          
          <div className="quick-services-grid">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="service-action-card"
            >
              <Clock className="card-icon" />
              <h3>My Orders</h3>
              <p>Check order history, print invoices, and initiate easy returns.</p>
              <Link to="/my-orders" className="service-link">View Orders <ArrowRight size={14} /></Link>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="service-action-card"
            >
              <Heart className="card-icon text-accent" />
              <h3>My Wishlist</h3>
              <p>Revisit, modify, and purchase items you have bookmarked.</p>
              <Link to="/wishlist" className="service-link">View Wishlist <ArrowRight size={14} /></Link>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="service-action-card"
            >
              <Calendar className="card-icon" />
              <h3>Gifting Planner</h3>
              <p>Schedule alerts for birthdays, anniversaries, and corporate events.</p>
              <Link to="/faq" className="service-link">Open Planner <ArrowRight size={14} /></Link>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="service-action-card"
            >
              <MapPin className="card-icon" />
              <h3>Address Book</h3>
              <p>Manage secondary shipping addresses for friends and family.</p>
              <Link to="/contact" className="service-link">Edit Addresses <ArrowRight size={14} /></Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
