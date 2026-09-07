import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, User, LogOut, BarChart3, Menu, X, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getProducts, getCategories, slugify, type Product, type Category } from '../../lib/database';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import './Header.css';

export const Header: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { cart, wishlist } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCatalogData = async () => {
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setDbCategories(cats);
      setAllProducts(prods);
    } catch (e) {
      console.error('Error loading header catalog:', e);
    }
  };

  useEffect(() => {
    fetchCatalogData();
    window.addEventListener('storage', fetchCatalogData);
    window.addEventListener('saugaat_catalog_updated', fetchCatalogData);
    return () => {
      window.removeEventListener('storage', fetchCatalogData);
      window.removeEventListener('saugaat_catalog_updated', fetchCatalogData);
    };
  }, []);

  const hiddenCategoryKeys = ['idols', 'toys'];
  const parentCategories = dbCategories.filter(c => {
    if (c.parent_id !== null) return false;
    const slug = slugify(c.name);
    return !hiddenCategoryKeys.includes(c.id.toLowerCase()) && !hiddenCategoryKeys.includes(slug);
  });

  const uniqueParentCategories: Category[] = [];
  const seenCategorySlugs = new Set<string>();
  for (const cat of parentCategories) {
    const slug = slugify(cat.name);
    if (!seenCategorySlugs.has(slug)) {
      seenCategorySlugs.add(slug);
      uniqueParentCategories.push(cat);
    }
  }

  const navCategories = [
    { id: 'all', path: '/category/all', label: 'All Gifts' },
    ...uniqueParentCategories.map(c => ({
      id: c.id,
      path: `/category/${c.id}`,
      label: c.name
    }))
  ];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = allProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q))
    ).slice(0, 6);
    setSearchResults(filtered);
  }, [searchQuery, allProducts]);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <header className="header glass" style={{ padding: '15px 0' }}>
      <div className="container">
        <div className="header-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo & Mobile Menu Toggle (Left) */}
          <div className="header-left" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              className="icon-btn mobile-only" 
              onClick={() => setIsMobileMenuOpen(true)} 
              title="Open Menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="logo" style={{ display: 'inline-block' }}>
              <img src="/logo.webp" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} alt="Saugaat Logo" loading="eager" decoding="async" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
            </Link>
          </div>

          {/* Live Search bar (Center) */}
          <div className="header-center" style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }} ref={searchRef}>
            <div className="search-bar desktop-only" style={{ maxWidth: '340px', width: '100%', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search premium gifts, idols, decor..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
              />
              <button className="search-btn" onClick={() => {
                if (searchQuery.trim()) {
                  navigate(`/category/all?search=${encodeURIComponent(searchQuery)}`);
                  setIsSearchOpen(false);
                }
              }}>
                <Search size={18} />
              </button>

              {/* Instant Search Results Dropdown */}
              {isSearchOpen && searchQuery.trim() !== '' && (
                <div className="search-results-dropdown glass shadow-lg" style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid rgba(200, 169, 107, 0.3)',
                  zIndex: 1100,
                  maxHeight: '380px',
                  overflowY: 'auto',
                  padding: '12px 0'
                }}>
                  {searchResults.length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No matching gifts found.
                    </div>
                  ) : (
                    <>
                      <div style={{ padding: '4px 16px 8px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Matching Products
                      </div>
                      {searchResults.map(p => {
                        const img = p.product_images && p.product_images.length > 0 ? p.product_images[0].image_url : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800';
                        return (
                          <div 
                            key={p.id}
                            onClick={() => handleSelectProduct(p.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px 16px',
                              cursor: 'pointer',
                              borderBottom: '1px solid rgba(0,0,0,0.04)',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(200, 169, 107, 0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <img src={getOptimizedImageUrl(img, { width: 80, quality: 70 })} alt={p.name} loading="lazy" decoding="async" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 'bold' }}>₹{p.price}</div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Icons & Account (Right) */}
          <div className="header-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
            {isAdmin && (
              <Link to="/admin/dashboard" className="icon-btn" title="Admin Panel" style={{ color: 'var(--primary-color)' }}>
                <BarChart3 size={22} />
              </Link>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/dashboard" className="icon-btn" title="My Account & Dashboard" style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  <LayoutDashboard size={20} />
                  <span className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Dashboard</span>
                </Link>
                <Link to="/my-orders" className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'none' }}>
                  Orders
                </Link>
                <button onClick={() => signOut()} className="icon-btn" title="Logout" style={{ color: 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="icon-btn" title="Login / Register" style={{ color: 'var(--primary-color)' }}>
                <User size={22} />
              </Link>
            )}

            <Link to="/wishlist" className="icon-btn badge-container" title="Wishlist" style={{ color: 'var(--primary-color)' }}>
              <Heart size={22} />
              {wishlistCount > 0 && <span className="badge" style={{ backgroundColor: 'var(--secondary-color)' }}>{wishlistCount}</span>}
            </Link>
            
            <Link to="/cart" className="icon-btn badge-container" title="Shopping Cart" style={{ color: 'var(--primary-color)' }}>
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="badge bg-accent">{cartCount}</span>}
            </Link>
          </div>
        </div>

        {/* Clean Luxury Navigation Menu */}
        <nav className="main-nav" style={{ marginTop: '15px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
          <ul className="nav-list" style={{ display: 'flex', justifyContent: 'center', gap: '25px', listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
            {navCategories.map((cat) => {
              const isActive = location.pathname === cat.path || (cat.id === 'all' && (location.pathname === '/' || location.pathname === '/category/all'));
              return (
                <li key={cat.id}>
                  <Link 
                    to={cat.path} 
                    className={isActive ? 'active' : ''}
                  >
                    {cat.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className="mobile-menu-content" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-menu-header">
            <h2 className="logo" style={{ margin: 0 }}>
              <img src="/logo.webp" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} alt="Saugaat Logo" loading="lazy" decoding="async" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
            </h2>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              style={{ color: 'var(--primary-color)', cursor: 'pointer' }}
              title="Close Menu"
            >
              <X size={24} />
            </button>
          </div>

          {user && (
            <div style={{ padding: '12px 16px', margin: '15px 0', backgroundColor: 'rgba(200, 169, 107, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(200, 169, 107, 0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed in as</div>
              <div style={{ fontWeight: 600, color: 'var(--primary-color)', fontSize: '0.9rem' }}>{user.email}</div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-color)', textDecoration: 'underline' }}>My Dashboard</Link>
                <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'underline' }}>My Orders</Link>
              </div>
            </div>
          )}
          
          <div className="mobile-nav-title">Categories</div>
          <ul className="mobile-nav-list">
            {navCategories.map((cat) => {
              const isActive = location.pathname === cat.path || (cat.id === 'all' && (location.pathname === '/' || location.pathname === '/category/all'));
              return (
                <li key={cat.id}>
                  <Link 
                    to={cat.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={isActive ? 'active' : ''}
                    style={{ color: isActive ? 'var(--secondary-color)' : 'var(--primary-color)', fontWeight: isActive ? 700 : 500 }}
                  >
                    {cat.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
};
