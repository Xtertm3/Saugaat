import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Share2, Truck } from 'lucide-react';
import { products } from '../data/mockData';

export const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="container text-center section-padding" style={{minHeight: '60vh'}}>
        <h2>Product not found</h2>
        <Link to="/category/all" className="btn btn-primary" style={{ marginTop: '20px' }}>Continue Shopping</Link>
      </div>
    );
  }

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="product-page section-padding container">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/">Home</Link> / <Link to={`/category/${product.category}`}>Category</Link> / <span className="text-primary">{product.name}</span>
      </div>

      <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }}>
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="product-image-large"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }} 
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="product-details"
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.name}</h1>
          
          <div className="price-container" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--primary-color)' }}>₹{product.price}</span>
            {product.originalPrice && (
              <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{product.originalPrice}</span>
            )}
            {product.discount && (
              <span style={{ backgroundColor: 'var(--accent-color)', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {product.discount}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.6' }}>
            {product.description}
          </p>

          <div className="quantity-selector" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <span style={{ fontWeight: '500' }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <button onClick={handleDecrease} style={{ padding: '10px 15px', cursor: 'pointer', background: 'transparent', border: 'none' }}><Minus size={16} /></button>
              <span style={{ padding: '0 15px', fontWeight: '600' }}>{quantity}</span>
              <button onClick={handleIncrease} style={{ padding: '10px 15px', cursor: 'pointer', background: 'transparent', border: 'none' }}><Plus size={16} /></button>
            </div>
          </div>

          <div className="action-buttons" style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
            <button className="btn btn-primary" style={{ flex: 2, padding: '15px' }}>ADD TO CART</button>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '15px' }}>BUY IT NOW</button>
            <button className="btn btn-secondary" style={{ padding: '15px', width: '50px' }}><Heart size={20} /></button>
          </div>

          <div className="product-features" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck className="text-secondary" size={24} />
              <span>Free Shipping on orders over ₹999</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Share2 className="text-secondary" size={24} />
              <span>Share this product with friends</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .action-buttons {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};
