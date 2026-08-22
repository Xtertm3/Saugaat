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
  CheckCircle2,
  PenTool,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getCustomerOrders, attachCardToOrder, createOrder, getProducts } from '../lib/database';
import type { Order } from '../lib/database';
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
  category?: string;
}


export const UserDashboard: React.FC = () => {
  const { user, points, tier, updatePoints } = useAuth();
  const { addToCart, toggleWishlist: globalToggleWishlist, isInWishlist, wishlist: globalWishlist } = useCart();
  
  const formatName = (email?: string) => {
    if (!email) return 'Valued Guest';
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const [stats, setStats] = useState({
    userName: formatName(user?.email),
    totalOrders: 3,
    wishlistItems: 5,
  });

  React.useEffect(() => {
    if (user?.email) {
      setStats(prev => ({
        ...prev,
        userName: formatName(user.email)
      }));
    }
  }, [user]);

  const getNextTierDetails = (pts: number) => {
    if (pts < 100) return { next: 'Silver', target: 100 };
    if (pts < 300) return { next: 'Gold', target: 300 };
    if (pts < 500) return { next: 'Platinum', target: 500 };
    return { next: 'Max Tier', target: pts || 500 };
  };

  const { next: nextTier, target: nextTierPoints } = getNextTierDetails(points);

  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchOrders = async () => {
    if (user?.email) {
      const orders = await getCustomerOrders(user.email);
      setCustomerOrders(orders);
      setStats(prev => ({
        ...prev,
        totalOrders: orders.length
      }));
    }
  };

  const fetchProducts = async () => {
    try {
      const dbProds = await getProducts();
      const mapped = dbProds.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.original_price || p.price,
        discount: p.discount_percentage > 0 ? `${p.discount_percentage}% OFF` : '',
        image: p.product_images && p.product_images.length > 0 ? p.product_images[0].image_url : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
        category: p.category_id,
        rating: 4.8,
        reviewsCount: 45
      }));
      setProducts(mapped);
    } catch (err) {
      console.error('Error fetching hamper products:', err);
    }
  };

  React.useEffect(() => {
    fetchOrders();
    fetchProducts();

    const handleStorageChange = () => {
      fetchOrders();
      fetchProducts();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const activeOrder = customerOrders.find(o => o.status !== 'delivered') || customerOrders[0];

  // Gifting Studio State
  const [activeStudioTab, setActiveStudioTab] = useState<'hamper' | 'calligraphy' | 'registry'>('hamper');
  const [selectedBox, setSelectedBox] = useState<'velvet' | 'wooden' | 'linen'>('velvet');
  const [hamperItems, setHamperItems] = useState<string[]>([]);
  const [studioSuccess, setStudioSuccess] = useState<string | null>(null);

  // Calligraphy Greeting Card state
  const [cardMessage, setCardMessage] = useState('Wishing you health, wealth, and prosperity on this auspicious occasion!');
  const [cardFont, setCardFont] = useState<'vedic' | 'royal' | 'minimal'>('royal');
  const [cardInk, setCardInk] = useState<'gold' | 'crimson' | 'navy' | 'fuchsia'>('gold');

  // Registry state
  const [registries, setRegistries] = useState([
    { id: 1, name: "Sister's Housewarming Party", target: 15000, current: 11250, date: "June 25, 2026", contributors: "Priya, Amit, Raj, Suresh" },
    { id: 2, name: "Siddharth & Riya's Wedding", target: 50000, current: 30000, date: "October 18, 2026", contributors: "Aunt Nisha, Rohan, Uncle Verma + 9 others" }
  ]);
  const [showCreateRegistry, setShowCreateRegistry] = useState(false);
  const [newRegistryName, setNewRegistryName] = useState('');
  const [newRegistryTarget, setNewRegistryTarget] = useState(25000);
  const [newRegistryDate, setNewRegistryDate] = useState('');

  const boxTypes = [
    { id: 'velvet', name: 'Royal Velvet Potli Box', price: 499, image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=150' },
    { id: 'wooden', name: 'Gilded Wooden Casket', price: 899, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=150' },
    { id: 'linen', name: 'Minimalist Linen Box', price: 299, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=150' }
  ] as const;

  const showNotification = (msg: string) => {
    setStudioSuccess(msg);
    setTimeout(() => setStudioSuccess(null), 5000);
  };

  const handleAddHamperItem = (id: string) => {
    if (hamperItems.length >= 5) {
      alert('You can add up to 5 items to a custom hamper box.');
      return;
    }
    setHamperItems(prev => [...prev, id]);
  };

  const handleRemoveHamperItem = (indexToRemove: number) => {
    setHamperItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleOrderCustomHamper = async () => {
    if (!user?.email) {
      alert('Please log in to place an order.');
      return;
    }
    
    const boxName = boxTypes.find(b => b.id === selectedBox)?.name || 'Custom Hamper';
    const hamperTotal = (boxTypes.find(b => b.id === selectedBox)?.price || 0) + 
      hamperItems.reduce((acc, itemId) => {
        const p = products.find((prod: Product) => prod.id === itemId);
        return acc + (p?.price || 0);
      }, 0);
    
    const itemsDescription = `${boxName} containing: ` + hamperItems.map(itemId => {
      const p = products.find((prod: Product) => prod.id === itemId);
      return p?.name || itemId;
    }).join(', ');
    
    // Check if there is a pending card
    let attachedCard = undefined;
    const pendingCardJson = localStorage.getItem('saugaat_pending_card');
    if (pendingCardJson) {
      try {
        attachedCard = JSON.parse(pendingCardJson);
        localStorage.removeItem('saugaat_pending_card');
      } catch (e) {
        console.error('Error parsing pending card:', e);
      }
    }

    const newOrder = await createOrder({
      customerEmail: user.email,
      customerName: user.email.split('@')[0].toUpperCase(),
      items: itemsDescription,
      total: hamperTotal,
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      card: attachedCard
    });

    if (newOrder) {
      await fetchOrders(); // refresh order list
      await updatePoints(150);
      setHamperItems([]);
      showNotification(`✨ Custom Hamper order #${newOrder.id} placed successfully! 150 Gifting Points have been credited.${attachedCard ? ' Calligraphy card attached!' : ''}`);
    }
  };

  const handleAddCardToOrder = async () => {
    if (!user?.email) {
      alert('Please log in to customize a card.');
      return;
    }

    const cardDetails = {
      message: cardMessage,
      font: cardFont,
      ink: cardInk
    };

    if (activeOrder) {
      await attachCardToOrder(activeOrder.id, cardDetails);
      await fetchOrders(); // refresh orders list
      await updatePoints(50);
      showNotification(`🎨 Handwritten calligraphy greeting card has been attached to order #${activeOrder.id}! 50 Gifting Points credited.`);
    } else {
      localStorage.setItem('saugaat_pending_card', JSON.stringify(cardDetails));
      await updatePoints(50);
      showNotification('🎨 Calligraphy card saved! It will be attached automatically when you place your next custom hamper or order. 50 Gifting Points credited.');
    }
  };

  const handleCreateRegistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegistryName.trim() || !newRegistryDate) return;
    
    setRegistries(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newRegistryName,
        target: newRegistryTarget,
        current: 0,
        date: newRegistryDate,
        contributors: 'No contributors yet'
      }
    ]);
    
    setNewRegistryName('');
    setNewRegistryTarget(25000);
    setNewRegistryDate('');
    setShowCreateRegistry(false);
    showNotification('📅 New Gift Registry has been successfully published to your circle!');
  };

  const [bestsellers] = useState<Product[]>([
    {
      id: 'cushion-1',
      name: 'Willow Leaf Jacquard Tapestry',
      price: 1499,
      originalPrice: 1899,
      discount: '21% OFF',
      image: '/cushions/paisley-jacquard-cushion.jpg',
      isBestseller: true,
      rating: 5.0,
      reviewsCount: 142,
    },
    {
      id: 'cushion-2',
      name: 'Mandala Floral Twin Cushions',
      price: 1999,
      originalPrice: 2499,
      discount: '20% OFF',
      image: '/cushions/mandala-pair-cushions.jpg',
      isBestseller: true,
      rating: 4.9,
      reviewsCount: 198,
    },
    {
      id: 'cushion-3',
      name: 'Metallic Vine Brocade Cushion',
      price: 1699,
      originalPrice: 2199,
      discount: '22% OFF',
      image: '/cushions/metallic-vine-brocade.jpg',
      isBestseller: true,
      rating: 4.9,
      reviewsCount: 115,
    },
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
  ]);

  const [trending] = useState<Product[]>([
    {
      id: 'cushion-4',
      name: 'Botanical Damask Brocade',
      price: 1599,
      originalPrice: 1999,
      discount: '20% OFF',
      image: '/cushions/botanical-damask-tapestry.jpg',
      isTrending: true,
      rating: 4.9,
      reviewsCount: 167,
    },
    {
      id: 'cushion-5',
      name: 'Ginkgo & Peacock Silk Jacquard',
      price: 2199,
      originalPrice: 2799,
      discount: '21% OFF',
      image: '/cushions/ginkgo-silk-cushion.jpg',
      isTrending: true,
      rating: 5.0,
      reviewsCount: 210,
    },
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

  const handleToggleWishlist = (product: Product) => {
    globalToggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.category || ''
    });
  };

  const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const isWishlisted = isInWishlist(product.id);
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
          onClick={() => handleToggleWishlist(product)}
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
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image
                });
                showNotification(`🛒 Added ${product.name} to cart!`);
              }}
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
                <span>{tier}</span>
              </div>
              <span className="card-logo">SAUGAAT</span>
            </div>
            <div className="card-middle">
              <span className="points-label">Gifting Balance</span>
              <div className="points-value">
                <span className="number">{points}</span>
                <span className="unit">Points</span>
              </div>
            </div>
            <div className="card-bottom">
              <div className="progress-text">
                <span>Next Tier: {nextTier}</span>
                <span>{points} / {nextTierPoints} XP</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.min(100, (points / nextTierPoints) * 100)}%` }}
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
            <span className="stat-number">{customerOrders.length}</span>
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
            <span className="stat-number">{globalWishlist.length}</span>
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
        {activeOrder ? (
          <div className="tracker-panel glass">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', margin: 0 }}>
                  <Truck size={18} />
                  Current Order: #{activeOrder.id}
                  {activeOrder.card && (
                    <span className="status-pill processing" style={{ fontSize: '0.72rem', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'none', marginLeft: '6px', fontWeight: 600 }}>
                      🎨 Calligraphy Card Attached
                    </span>
                  )}
                </h3>
              </div>
              <span className="delivery-est">Est. Delivery: {activeOrder.expectedDelivery}</span>
            </div>
            
            {(() => {
              const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
              const currentIndex = statusOrder.indexOf(activeOrder.status);
              const percent = currentIndex === 0 ? 0 : currentIndex === 1 ? 33 : currentIndex === 2 ? 66 : 100;

              const getLogTime = (s: string) => {
                const log = activeOrder.logs.find(l => l.status === s);
                if (!log) return s === 'delivered' ? 'Pending' : s === 'shipped' ? 'On the Way' : '';
                return new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              };

              const latestLog = activeOrder.logs[activeOrder.logs.length - 1]?.description || 'Order placed successfully.';

              return (
                <>
                  <div className="timeline-container">
                    <div className="timeline-line">
                      <div className="timeline-line-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    
                    <div className={`timeline-step ${currentIndex >= 0 ? (currentIndex === 0 ? 'active' : 'completed') : 'pending'}`}>
                      <div className="step-dot">
                        {currentIndex > 0 ? <CheckCircle2 size={16} /> : currentIndex === 0 ? <div className="pulse-ring"></div> : null}
                      </div>
                      <span className="step-label">Ordered</span>
                      <span className="step-time">{getLogTime('pending')}</span>
                    </div>

                    <div className={`timeline-step ${currentIndex >= 1 ? (currentIndex === 1 ? 'active' : 'completed') : 'pending'}`}>
                      <div className="step-dot">
                        {currentIndex > 1 ? <CheckCircle2 size={16} /> : currentIndex === 1 ? <div className="pulse-ring"></div> : null}
                      </div>
                      <span className="step-label">Processing</span>
                      <span className="step-time">{getLogTime('processing')}</span>
                    </div>

                    <div className={`timeline-step ${currentIndex >= 2 ? (currentIndex === 2 ? 'active' : 'completed') : 'pending'}`}>
                      <div className="step-dot">
                        {currentIndex > 2 ? <CheckCircle2 size={16} /> : currentIndex === 2 ? <div className="pulse-ring"></div> : null}
                      </div>
                      <span className="step-label">In Transit</span>
                      <span className="step-time">{getLogTime('shipped')}</span>
                    </div>

                    <div className={`timeline-step ${currentIndex >= 3 ? (currentIndex === 3 ? 'active' : 'completed') : 'pending'}`}>
                      <div className="step-dot">
                        {currentIndex === 3 ? <CheckCircle2 size={16} /> : null}
                      </div>
                      <span className="step-label">Delivered</span>
                      <span className="step-time">{getLogTime('delivered')}</span>
                    </div>
                  </div>
                  
                  <div className="tracker-footer">
                    <span className="status-note">Latest update: {latestLog}</span>
                    <Link to="/my-orders" className="track-details-btn">
                      Track Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="tracker-panel glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '30px', textAlign: 'center' }}>
            <ShoppingBag size={36} className="text-secondary" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>No Active Shipments</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', marginTop: '6px', marginBottom: 0 }}>
              Select one of our luxury hampers or design your own bespoke gift box to start tracking.
            </p>
          </div>
        )}

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

      {/* Studio Success Notification */}
      <AnimatePresence>
        {studioSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container"
            style={{ marginTop: '20px', zIndex: 100, position: 'relative' }}
          >
            <div className="glass" style={{
              background: 'rgba(205, 168, 115, 0.15)',
              border: '1px solid var(--secondary-color)',
              color: 'var(--primary-color)',
              padding: '16px 24px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <Sparkles size={20} className="text-secondary" style={{ flexShrink: 0 }} />
              <span>{studioSuccess}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gifting Studio Section (Features 2, 3, 4) */}
      <section id="hamper-builder" className="gifting-studio-section container" style={{ marginTop: '40px' }}>
        <div className="gifting-studio-card">
          <div className="gifting-studio-header">
            <h2>✨ Premium Gifting Concierge Studio</h2>
            <p>Design custom experiences, compose calligraphy, and sync gift registries in real time.</p>
          </div>

          {/* Tab Selector */}
          <div className="gifting-studio-tabs">
            <button 
              className={`studio-tab-btn ${activeStudioTab === 'hamper' ? 'active' : ''}`}
              onClick={() => setActiveStudioTab('hamper')}
            >
              <Gift size={16} />
              <span>Hamper Builder (Feature 2)</span>
            </button>
            <button 
              className={`studio-tab-btn ${activeStudioTab === 'calligraphy' ? 'active' : ''}`}
              onClick={() => setActiveStudioTab('calligraphy')}
            >
              <PenTool size={16} />
              <span>Greeting Card Calligraphy (Feature 3)</span>
            </button>
            <button 
              className={`studio-tab-btn ${activeStudioTab === 'registry' ? 'active' : ''}`}
              onClick={() => setActiveStudioTab('registry')}
            >
              <Calendar size={16} />
              <span>Occasion Registry (Feature 4)</span>
            </button>
          </div>

          <div className="studio-tab-content">
            {/* Tab 1: Hamper Builder */}
            {activeStudioTab === 'hamper' && (
              <div className="hamper-builder-grid">
                <div className="hamper-options-panel">
                  {/* Select Gifting Casing */}
                  <div>
                    <h3 className="hamper-section-title">
                      <ShoppingBag size={16} className="text-secondary" />
                      1. Choose Luxury Box / Casing
                    </h3>
                    <div className="box-options-grid">
                      {boxTypes.map(box => (
                        <div 
                          key={box.id}
                          className={`box-option-card ${selectedBox === box.id ? 'active' : ''}`}
                          onClick={() => setSelectedBox(box.id)}
                        >
                          <img src={box.image} alt={box.name} />
                          <h4>{box.name}</h4>
                          <span>+₹{box.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select Products */}
                  <div>
                    <h3 className="hamper-section-title">
                      <Sparkles size={16} className="text-secondary" />
                      2. Add Handcrafted Items (Max 5)
                    </h3>
                    <div className="hamper-items-selection">
                      {products.slice(0, 10).map(product => {
                        const countInHamper = hamperItems.filter(id => id === product.id).length;
                        return (
                          <div 
                            key={product.id} 
                            className={`hamper-item-row ${countInHamper > 0 ? 'selected' : ''}`}
                          >
                            <img src={product.image} alt={product.name} className="hamper-item-thumb" />
                            <div className="hamper-item-details">
                              <h4>{product.name}</h4>
                              <span>₹{product.price} | {(product.category || '').replace('-', ' ')}</span>
                            </div>
                            <div className="hamper-item-price">₹{product.price}</div>
                            {countInHamper > 0 ? (
                              <button 
                                className="hamper-item-action-btn remove"
                                onClick={() => {
                                  const idx = hamperItems.indexOf(product.id);
                                  if (idx > -1) handleRemoveHamperItem(idx);
                                }}
                              >
                                Remove ({countInHamper})
                              </button>
                            ) : (
                              <button 
                                className="hamper-item-action-btn add"
                                onClick={() => handleAddHamperItem(product.id)}
                                disabled={hamperItems.length >= 5}
                              >
                                Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Real-time Hamper Basket Preview Panel */}
                <div className="hamper-preview-panel">
                  <div>
                    <h3 className="hamper-section-title">
                      <Gift size={16} className="text-secondary" />
                      Live Hamper Curation
                    </h3>
                    
                    <div className="hamper-visual-preview">
                      {/* Box Base Rendering */}
                      <img 
                        src={boxTypes.find(b => b.id === selectedBox)?.image} 
                        alt="Box Base" 
                        className="box-base"
                      />
                      
                      {/* Floating Items Rendering */}
                      {hamperItems.map((itemId, idx) => {
                        const product = products.find(p => p.id === itemId);
                        if (!product) return null;
                        return (
                          <motion.img 
                            key={`${itemId}-${idx}`}
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: idx * 12 }}
                            src={product.image} 
                            alt={product.name} 
                            className={`hamper-floating-item pos-${idx + 1}`}
                            title={product.name}
                          />
                        );
                      })}

                      {hamperItems.length === 0 && (
                        <div className="hamper-visual-empty">
                          <ShoppingBag size={36} />
                          <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Your Hamper is empty.<br/>Select items on the left to pack them.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hamper-summary-card">
                    <div className="hamper-summary-row">
                      <span>Casing ({boxTypes.find(b => b.id === selectedBox)?.name})</span>
                      <span>₹{boxTypes.find(b => b.id === selectedBox)?.price}</span>
                    </div>
                    <div className="hamper-summary-row">
                      <span>Items Count</span>
                      <span>{hamperItems.length} / 5</span>
                    </div>
                    <div className="hamper-summary-row">
                      <span>Items Total</span>
                      <span>
                        ₹{hamperItems.reduce((acc, itemId) => {
                          const p = products.find(prod => prod.id === itemId);
                          return acc + (p?.price || 0);
                        }, 0)}
                      </span>
                    </div>
                    <div className="hamper-summary-row total">
                      <span>Total Hamper Value</span>
                      <span>
                        ₹{(boxTypes.find(b => b.id === selectedBox)?.price || 0) + 
                          hamperItems.reduce((acc, itemId) => {
                            const p = products.find(prod => prod.id === itemId);
                            return acc + (p?.price || 0);
                          }, 0)}
                      </span>
                    </div>
                    <button 
                      className="hamper-checkout-btn"
                      onClick={handleOrderCustomHamper}
                      disabled={hamperItems.length === 0}
                    >
                      <Gift size={16} />
                      Order Custom Hamper
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Calligraphy Customizer */}
            {activeStudioTab === 'calligraphy' && (
              <div className="calligraphy-customizer-grid">
                <div className="calligraphy-inputs-panel">
                  {/* Message Input */}
                  <div className="calligraphy-field">
                    <label>Greeting Message</label>
                    <textarea 
                      rows={4}
                      value={cardMessage}
                      onChange={(e) => setCardMessage(e.target.value.slice(0, 160))}
                      placeholder="Write your greeting message (Max 160 characters)..."
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                      {cardMessage.length} / 160 characters
                    </span>
                  </div>

                  {/* Font Choice */}
                  <div className="calligraphy-field">
                    <label>Calligraphy Script Type</label>
                    <div className="font-selectors-grid">
                      <button 
                        className={`font-option-btn ${cardFont === 'royal' ? 'active' : ''}`}
                        onClick={() => setCardFont('royal')}
                        style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                      >
                        Royal Gold Script
                      </button>
                      <button 
                        className={`font-option-btn ${cardFont === 'vedic' ? 'active' : ''}`}
                        onClick={() => setCardFont('vedic')}
                        style={{ fontFamily: '"Playfair Display", serif' }}
                      >
                        Vedic Serif
                      </button>
                      <button 
                        className={`font-option-btn ${cardFont === 'minimal' ? 'active' : ''}`}
                        onClick={() => setCardFont('minimal')}
                        style={{ fontFamily: '"Outfit", sans-serif' }}
                      >
                        Minimalist Sans
                      </button>
                    </div>
                  </div>

                  {/* Ink Choice */}
                  <div className="calligraphy-field">
                    <label>Signature Ink Color</label>
                    <div className="ink-selectors-row">
                      <button 
                        className={`ink-option-btn ${cardInk === 'gold' ? 'active' : ''}`}
                        onClick={() => setCardInk('gold')}
                        style={{ color: '#C8A96B', borderColor: cardInk === 'gold' ? '#C8A96B' : '' }}
                      >
                        ● Liquid Gold
                      </button>
                      <button 
                        className={`ink-option-btn ${cardInk === 'crimson' ? 'active' : ''}`}
                        onClick={() => setCardInk('crimson')}
                        style={{ color: '#C96A4A', borderColor: cardInk === 'crimson' ? '#C96A4A' : '' }}
                      >
                        ● Terracotta
                      </button>
                      <button 
                        className={`ink-option-btn ${cardInk === 'cyan' ? 'active' : ''}`}
                        onClick={() => setCardInk('cyan')}
                        style={{ color: '#008B8B', borderColor: cardInk === 'cyan' ? '#008B8B' : '' }}
                      >
                        ● Cyan Blue
                      </button>
                    </div>
                  </div>

                  <button 
                    className="hamper-checkout-btn"
                    onClick={handleAddCardToOrder}
                    disabled={!cardMessage.trim()}
                  >
                    <PenTool size={16} />
                    Attach Handwritten Card (₹99)
                  </button>
                </div>

                {/* Calligraphy Card Render Preview (Right Side) */}
                <div className="greetings-card-preview-panel">
                  <div className="greetings-card-mockup">
                    <div className="card-filigree-top">SAUGAAT HANDCRAFTED WRAPPING</div>
                    
                    <div 
                      className="card-message-body"
                      style={{
                        color: cardInk === 'gold' ? '#D4AF37' : cardInk === 'crimson' ? '#C96A4A' : '#D9146D',
                        fontFamily: cardFont === 'royal' ? 'Georgia, serif' : cardFont === 'vedic' ? '"Playfair Display", serif' : '"Outfit", sans-serif',
                        fontStyle: cardFont === 'royal' ? 'italic' : 'normal',
                        fontWeight: cardFont === 'minimal' ? '400' : 'bold'
                      }}
                    >
                      "{cardMessage || 'Type your message on the left...'}"
                    </div>

                    <div className="card-wax-seal">
                      <span className="card-sender-logo">Saugaat Curator</span>
                      <div className="wax-seal-icon" title="Authentic Gifting Wax Seal">S</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Occasion Registry */}
            {activeStudioTab === 'registry' && (
              <div className="registry-tab-container">
                <div className="registry-header-row">
                  <h3 className="panel-title" style={{ fontSize: '1.2rem' }}>
                    <Calendar size={18} className="text-secondary" />
                    Manage Your Gifting Registries
                  </h3>
                  <button 
                    className="create-registry-btn"
                    onClick={() => setShowCreateRegistry(!showCreateRegistry)}
                  >
                    {showCreateRegistry ? 'Close Form' : 'Create New Registry'}
                  </button>
                </div>

                {/* Create Registry Form Block */}
                {showCreateRegistry && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="registry-creation-box"
                  >
                    <form onSubmit={handleCreateRegistry}>
                      <div className="registry-form-grid">
                        <div className="calligraphy-field">
                          <label>Event / Registry Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Anand's Wedding Pool, Baby Shower"
                            value={newRegistryName}
                            onChange={(e) => setNewRegistryName(e.target.value)}
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>
                        <div className="calligraphy-field">
                          <label>Target Funding (₹)</label>
                          <input 
                            type="number" 
                            required
                            min="5000"
                            step="1000"
                            value={newRegistryTarget}
                            onChange={(e) => setNewRegistryTarget(Number(e.target.value))}
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>
                        <div className="calligraphy-field">
                          <label>Target Date</label>
                          <input 
                            type="date" 
                            required
                            value={newRegistryDate}
                            onChange={(e) => setNewRegistryDate(e.target.value)}
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>
                      </div>
                      <div className="registry-form-actions">
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => setShowCreateRegistry(false)}
                          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        >
                          Publish Registry
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Registries List Grid */}
                <div className="registries-list-grid">
                  {registries.map(reg => {
                    const percent = Math.min(100, Math.round((reg.current / reg.target) * 100));
                    return (
                      <div key={reg.id} className="registry-card">
                        <div>
                          <div className="registry-card-top">
                            <span className="registry-badge">ACTIVE POOL</span>
                            <span className="registry-date">📅 {reg.date}</span>
                          </div>
                          <h3>{reg.name}</h3>
                          
                          <div style={{ margin: '16px 0' }}>
                            <div className="registry-stats-row">
                              <span>Target: ₹{reg.target.toLocaleString()}</span>
                              <span style={{ fontWeight: 'bold' }}>{percent}% Funded</span>
                            </div>
                            <div className="registry-progress-bar">
                              <div 
                                className="registry-progress-fill" 
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <div className="registry-stats-row" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              <span>Collected: ₹{reg.current.toLocaleString()}</span>
                              <span>Remaining: ₹{(reg.target - reg.current).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="registry-contributors">
                          <strong>Contributors:</strong> {reg.contributors}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
