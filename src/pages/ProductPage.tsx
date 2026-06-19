import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Share2, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductById, type Product } from '../lib/database';

export const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const prod = await getProductById(productId);
        setProduct(prod);
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setQuantity(1);
  }, [productId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <RefreshCw size={36} className="spin-anim" style={{ color: 'var(--secondary-color)' }} />
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
  }

  if (!product) {
    return (
      <div className="container text-center section-padding" style={{ minHeight: '60vh' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Continue Shopping</Link>
      </div>
    );
  }

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const isWishlisted = isInWishlist(product.id);
  const featuredImg = product.product_images && product.product_images.length > 0
    ? product.product_images.find(img => img.is_featured)?.image_url || product.product_images[0].image_url
    : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="product-page section-padding container">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/">Home</Link> / <span className="text-primary">{product.name}</span>
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
            src={featuredImg} 
            alt={product.name} 
            style={{ width: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', maxHeight: '550px', objectFit: 'cover' }} 
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="product-details"
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>{product.name}</h1>
          
          <div className="price-container" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--primary-color)' }}>₹{product.price}</span>
            {product.original_price && product.original_price > product.price && (
              <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{product.original_price}</span>
            )}
            {product.discount_percentage > 0 && (
              <span style={{ backgroundColor: 'var(--accent-color)', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {product.discount_percentage}% OFF
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
            <button 
              className="btn btn-primary" 
              style={{ flex: 2, padding: '15px' }}
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: featuredImg
                  });
                }
              }}
            >
              ADD TO CART
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ flex: 1, padding: '15px' }}
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: featuredImg
                  });
                }
                navigate('/cart');
              }}
            >
              BUY IT NOW
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '15px', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => toggleWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: featuredImg,
                description: product.description || ''
              })}
            >
              <Heart size={20} fill={isWishlisted ? 'var(--accent-color)' : 'none'} color={isWishlisted ? 'var(--accent-color)' : 'currentColor'} />
            </button>
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
