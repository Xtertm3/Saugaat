import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { STORE_CONTACT } from '../../config/contact';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-info">
            <img src="/logo.png" alt="Saugaat Logo" style={{ height: '150px', width: 'auto', marginBottom: '15px', objectFit: 'contain' }} />
            <p className="footer-desc">
              Curated luxury gifting and premium home decor for every special occasion. 
              Celebrate life's moments with elegance.
            </p>
            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div>📍 {STORE_CONTACT.address}</div>
              <div style={{ marginTop: '4px' }}>📞 <a href={`tel:${STORE_CONTACT.phone}`} style={{ color: 'inherit' }}>{STORE_CONTACT.phone}</a></div>
              <div style={{ marginTop: '4px' }}>✉️ <a href={`mailto:${STORE_CONTACT.email}`} style={{ color: 'inherit' }}>{STORE_CONTACT.email}</a></div>
            </div>
            <div className="social-links" style={{ marginTop: '15px' }}>
              <a href="#" className="social-icon">IG</a>
              <a href="#" className="social-icon">FB</a>
              <a href="#" className="social-icon">TW</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
              <li><Link to="/returns">Return & Exchange</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h3 className="footer-title">Shop</h3>
            <ul className="footer-links">
              <li><Link to="/category/home-decor">Home Decor</Link></li>
              <li><Link to="/category/idols">Idols</Link></li>
              <li><Link to="/category/festivals">Festivals</Link></li>
              <li><Link to="/category/toys">Toys</Link></li>
              <li><Link to="/category/gift-packs">Gift Packs</Link></li>
              <li><Link to="/category/return-gifts">Return Gifts</Link></li>
              <li><Link to="/category/just-like-that">Just Like That</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col newsletter">
            <h3 className="footer-title">Stay in Touch</h3>
            <p>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Saugaat. All rights reserved.</p>
          <div className="payment-methods">
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
