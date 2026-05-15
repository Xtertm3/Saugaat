import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Close menu when route changes
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header glass">
      {/* Top Banner */}
      <div className="top-banner bg-primary text-white text-center py-2 text-sm">
        <span>Get 10% Off | Use Code "SAUGAAT10"</span>
      </div>

      <div className="container">
        <div className="header-main">
          {/* Hamburger Menu & Search (Left) */}
          <div className="header-left">
            <button className="icon-btn" onClick={toggleMenu} style={{ marginRight: '10px' }}>
              <Menu size={28} />
            </button>
            <div className="search-bar desktop-only">
              <input type="text" placeholder="Search for products, categories..." />
              <button className="search-btn">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Logo (Center) */}
          <div className="header-center text-center">
            <Link to="/" className="logo">
              <img src="/logo.png" alt="Saugaat Logo" style={{ height: '120px', width: 'auto', objectFit: 'contain' }} />
            </Link>
          </div>

          {/* Icons (Right) */}
          <div className="header-right">
            <div className="search-bar mobile-only" style={{ border: 'none', padding: 0, width: 'auto', background: 'transparent' }}>
              <button className="icon-btn">
                <Search size={24} />
              </button>
            </div>
            
            {user ? (
              <button onClick={() => signOut()} className="icon-btn desktop-only" title="Logout">
                <LogOut size={24} />
              </button>
            ) : (
              <Link to="/login" className="icon-btn desktop-only" title="Login">
                <User size={24} />
              </Link>
            )}
            
            <Link to="/wishlist" className="icon-btn badge-container desktop-only">
              <Heart size={24} />
              <span className="badge">0</span>
            </Link>
            <Link to="/cart" className="icon-btn badge-container">
              <ShoppingBag size={24} />
              <span className="badge bg-accent">2</span>
            </Link>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="main-nav desktop-only">
          <ul className="nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/category/home-decor">Home Decor</Link></li>
            <li><Link to="/category/idols">Idols</Link></li>
            <li><Link to="/category/festivals">Festivals</Link></li>
            <li><Link to="/category/toys">Toys</Link></li>
            <li><Link to="/category/gift-packs">Gift Packs</Link></li>
            <li><Link to="/category/return-gifts">Return Gifts</Link></li>
            <li><Link to="/category/just-like-that" className="text-accent font-medium">Just Like That</Link></li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <h2 className="text-primary font-heading">Menu</h2>
            <button className="icon-btn" onClick={toggleMenu}>
              <X size={28} />
            </button>
          </div>
          
          <div className="mobile-nav-section">
            <h3 className="mobile-nav-title">Shop Categories</h3>
            <ul className="mobile-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/category/home-decor">Home Decor</Link></li>
              <li><Link to="/category/idols">Idols</Link></li>
              <li><Link to="/category/festivals">Festivals</Link></li>
              <li><Link to="/category/toys">Toys</Link></li>
              <li><Link to="/category/gift-packs">Gift Packs</Link></li>
              <li><Link to="/category/return-gifts">Return Gifts</Link></li>
              <li><Link to="/category/just-like-that">Just Like That</Link></li>
            </ul>
          </div>

          <div className="mobile-nav-section mt-8">
            <h3 className="mobile-nav-title">Quick Links</h3>
            <ul className="mobile-nav-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              {user ? (
                <li><button onClick={() => signOut()} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 500 }}>Logout</button></li>
              ) : (
                <li><Link to="/login">Login / Sign Up</Link></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};
