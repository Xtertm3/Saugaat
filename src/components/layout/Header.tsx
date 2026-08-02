import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, User, LogOut, BarChart3, Menu, X, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getProducts, type Product } from '../../lib/database';
import './Header.css';

export const Header: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { cart, wishlist } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    getProducts().then(prods => setAllProducts(prods)).catch(console.error);
  }, []);

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
              <img src="/logo.png" alt="Saugaat Logo" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
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
                            <img src={img} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
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
            <li>
              <Link to="/category/all" style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                All Gifts
              </Link>
            </li>
            <li>
              <Link to="/category/home-decor" style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Home Decor
              </Link>
            </li>
            <li>
              <Link to="/category/idols" style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Idols
              </Link>
            </li>
            <li>
              <Link to="/category/festivals" style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Festivals
              </Link>
            </li>
            <li>
              <Link to="/category/toys" style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Toys
              </Link>
            </li>
            <li>
              <Link to="/category/gift-packs" style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Gift Packs
              </Link>
            </li>
            <li>
              <Link to="/category/return-gifts" style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Return Gifts
              </Link>
            </li>
            <li>
              <Link to="/category/just-like-that" style={{ textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Just Like That
              </Link>
            </li>
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
              <img src="/logo.png" alt="Saugaat Logo" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
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
            <li>
              <Link to="/category/all" onClick={() => setIsMobileMenuOpen(false)}>All Gifts Collection</Link>
            </li>
            <li>
              <Link to="/category/home-decor" onClick={() => setIsMobileMenuOpen(false)}>Home Decor</Link>
            </li>
            <li>
              <Link to="/category/idols" onClick={() => setIsMobileMenuOpen(false)}>Idols</Link>
            </li>
            <li>
              <Link to="/category/festivals" onClick={() => setIsMobileMenuOpen(false)}>Festivals</Link>
            </li>
            <li>
              <Link to="/category/toys" onClick={() => setIsMobileMenuOpen(false)}>Toys</Link>
            </li>
            <li>
              <Link to="/category/gift-packs" onClick={() => setIsMobileMenuOpen(false)}>Gift Packs</Link>
            </li>
            <li>
              <Link to="/category/return-gifts" onClick={() => setIsMobileMenuOpen(false)}>Return Gifts</Link>
            </li>
            <li>
              <Link to="/category/just-like-that" onClick={() => setIsMobileMenuOpen(false)}>Just Like That</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
