import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, LogOut, BarChart3, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

export const Header: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { cart, wishlist } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

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

          {/* Search bar (Center) */}
          <div className="header-center" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div className="search-bar desktop-only" style={{ maxWidth: '320px', width: '100%' }}>
              <input type="text" placeholder="Search premium gifts..." />
              <button className="search-btn">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Icons & Account (Right) */}
          <div className="header-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
            <div className="search-bar mobile-only" style={{ border: 'none', padding: 0, width: 'auto', background: 'transparent' }}>
              <button className="icon-btn" style={{ color: 'var(--primary-color)' }}>
                <Search size={22} />
              </button>
            </div>

            {isAdmin && (
              <Link to="/admin/dashboard" className="icon-btn" title="Admin Panel" style={{ color: 'var(--primary-color)' }}>
                <BarChart3 size={22} />
              </Link>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/my-orders" className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'none' }}>
                  Track Orders
                </Link>
                <button onClick={() => signOut()} className="icon-btn" title="Logout" style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="icon-btn" title="Login" style={{ color: 'var(--primary-color)' }}>
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
          
          <div className="mobile-nav-title">Categories</div>
          <ul className="mobile-nav-list">
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

