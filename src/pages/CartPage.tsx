import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import './Home.css';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal;

  const handleCheckout = () => {
    if (!user?.email) {
      alert('Please log in to checkout your cart.');
      navigate('/login');
      return;
    }

    if (cart.length === 0) return;

    navigate('/checkout');
  };

  return (
    <div className="cart-page-wrapper bg-light-sand" style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/" className="link-arrow" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '24px', gap: '6px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>

        <div className="dashboard-section-header" style={{ marginBottom: '32px' }}>
          <div>
            <span className="section-subtitle">Shopping Cart</span>
            <h2 className="luxury-section-title">Your Selected Gifts</h2>
            <div className="title-underline"></div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="glass text-center" style={{ padding: '60px 40px', borderRadius: 'var(--radius-lg)' }}>
            <ShoppingBag size={48} className="text-secondary" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>Your Cart is Empty</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '8px auto 24px auto' }}>
              You haven't added any premium gifts or custom hampers to your cart yet. Explore our curated collections!
            </p>
            <Link to="/" className="btn btn-primary">Browse Collections</Link>
          </div>
        ) : (
          <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            <style>{`
              @media (min-width: 992px) {
                .cart-grid {
                  grid-template-columns: 1fr 380px !important;
                }
              }
              .quantity-selector {
                display: flex;
                align-items: center;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                overflow: hidden;
                width: fit-content;
                background: white;
              }
              .quantity-btn {
                background: none;
                border: none;
                padding: 6px 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
              }
              .quantity-btn:hover {
                background: rgba(0,0,0,0.05);
              }
              .quantity-val {
                padding: 0 12px;
                font-weight: 600;
                font-size: 0.9rem;
              }
            `}</style>

            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item) => (
                <div key={item.id} className="glass" style={{ display: 'flex', gap: '20px', padding: '20px', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', margin: '0 0 4px 0', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>{item.name}</h3>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--secondary-color)' }}>₹{item.price}</div>
                  </div>

                  <div className="quantity-selector">
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span className="quantity-val">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.05rem' }}>
                      ₹{item.price * item.quantity}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', padding: '4px 0', marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary Panel */}
            <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', margin: '0 0 20px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Summary
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Shipping</span>
                  <span className="text-secondary" style={{ fontWeight: 600 }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <button 
                  onClick={handleCheckout} 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <CreditCard size={18} /> Proceed to Checkout
                </button>
                
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px', fontStyle: 'italic' }}>
                  Orders placed here will immediately appear in your Real-time tracking history list.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
