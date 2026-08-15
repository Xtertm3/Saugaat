import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Truck, RefreshCw, Star, ShieldCheck, Sparkles, MessageSquare, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductById, getProductsByCategory, type Product } from '../lib/database';
import { STORE_CONTACT } from '../config/contact';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', author: 'Ananya Sharma', rating: 5, date: '2 days ago', comment: 'Absolutely mesmerizing finish! The brass work is heavy and genuine. Packed safely with velvet lining.' },
    { id: '2', author: 'Rohan Verma', rating: 5, date: '1 week ago', comment: 'Bought this as a housewarming gift. The recipients were thrilled with the calligraphy gift card!' },
    { id: '3', author: 'Pooja Hegde', rating: 4, date: '2 weeks ago', comment: 'Beautiful piece, arrived right on schedule. Would definitely recommend Saugaat for festival hampers.' }
  ]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const prod = await getProductById(productId);
        setProduct(prod);

        if (prod) {
          const featured = prod.product_images && prod.product_images.length > 0
            ? prod.product_images.find(img => img.is_featured)?.image_url || prod.product_images[0].image_url
            : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800';
          setSelectedImage(featured);

          // Fetch related
          if (prod.category_id) {
            const related = await getProductsByCategory(prod.category_id);
            setRelatedProducts(related.filter(p => p.id !== prod.id).slice(0, 4));
          }
        }
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

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    
    const rev: Review = {
      id: Date.now().toString(),
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim()
    };

    setReviews([rev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setReviewSubmittedMsg(true);
    setTimeout(() => setReviewSubmittedMsg(false), 4000);
  };

  const isWishlisted = isInWishlist(product.id);
  const allImages = product.product_images && product.product_images.length > 0
    ? product.product_images.map(img => img.image_url)
    : [selectedImage || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800'];

  return (
    <div className="product-page section-padding container">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '25px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link> / 
        <Link to="/category/all" style={{ color: 'var(--text-muted)', textDecoration: 'none', margin: '0 4px' }}>Collections</Link> / 
        <span className="text-primary" style={{ fontWeight: 600 }}>{product.name}</span>
      </div>

      <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }}>
        
        {/* Product Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="product-gallery-block"
        >
          <div className="product-image-large" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
            <img 
              src={selectedImage || allImages[0]} 
              alt={product.name} 
              style={{ width: '100%', maxHeight: '520px', objectFit: 'cover', display: 'block' }} 
            />
            {product.discount_percentage > 0 && (
              <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'var(--accent-color)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {product.discount_percentage}% OFF
              </span>
            )}
          </div>

          {/* Image Thumbnails List */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {allImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} thumbnail ${idx}`}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    border: selectedImage === img ? '2px solid var(--secondary-color)' : '1px solid var(--border-color)',
                    opacity: selectedImage === img ? 1 : 0.7,
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Details & Purchase Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="product-details"
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
            ✨ Saugaat Curated Edition
          </span>
          <h1 style={{ fontSize: '2.4rem', marginTop: '6px', marginBottom: '12px', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)', lineHeight: '1.2' }}>
            {product.name}
          </h1>

          {/* Rating Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', color: 'var(--secondary-color)' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="var(--secondary-color)" />
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>4.9</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({reviews.length} customer reviews)</span>
          </div>
          
          {/* Price Container */}
          <div className="price-container" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)' }}>₹{product.price}</span>
            {product.original_price && product.original_price > product.price && (
              <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{product.original_price}</span>
            )}
            <span style={{ fontSize: '0.8rem', color: '#15803d', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              Inclusive of all taxes (GST)
            </span>
          </div>

          <p style={{ color: 'var(--text-main)', marginBottom: '30px', fontSize: '1.05rem', lineHeight: '1.7' }}>
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="quantity-selector" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <span style={{ fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'white' }}>
              <button onClick={handleDecrease} style={{ padding: '10px 16px', cursor: 'pointer', background: 'transparent', border: 'none' }}><Minus size={16} /></button>
              <span style={{ padding: '0 16px', fontWeight: '700', fontSize: '1.1rem' }}>{quantity}</span>
              <button onClick={handleIncrease} style={{ padding: '10px 16px', cursor: 'pointer', background: 'transparent', border: 'none' }}><Plus size={16} /></button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons" style={{ display: 'flex', gap: '15px', marginBottom: '35px' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 2, padding: '16px', fontWeight: 700 }}
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: selectedImage || allImages[0]
                  });
                }
              }}
            >
              ADD TO CART
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ 
                flex: 1, 
                padding: '16px', 
                fontWeight: 700, 
                backgroundColor: '#25D366', 
                color: 'white', 
                borderColor: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: selectedImage || allImages[0]
                  });
                }
                
                const waMessage = `*DIRECT BUY REQUEST - SAUGAAT*
------------------------------
🎁 *Product:* ${product.name}
🔢 *Quantity:* ${quantity}
💰 *Price per Unit:* ₹${product.price}
💵 *Total Amount:* ₹${product.price * quantity}
------------------------------
Hi Saugaat Support, I would like to buy this item right now! Please guide me on payment and delivery details.`;

                const whatsappUrl = `https://wa.me/${STORE_CONTACT.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              <MessageSquare size={18} /> BUY IT NOW
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '16px', width: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => toggleWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: selectedImage || allImages[0],
                description: product.description || ''
              })}
              title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <Heart size={22} fill={isWishlisted ? 'var(--accent-color)' : 'none'} color={isWishlisted ? 'var(--accent-color)' : 'currentColor'} />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="product-features" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
              <Truck className="text-secondary" size={20} />
              <span><strong>Express Shipping:</strong> Dispatched in 24 hours with damage-proof padding.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
              <ShieldCheck className="text-secondary" size={20} />
              <span><strong>100% Authentic:</strong> Directly from master artisan workshops.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
              <Sparkles className="text-secondary" size={20} />
              <span><strong>Gift Ready:</strong> Free handwritten greeting card attached at checkout.</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs Section: Description / Specifications / Reviews */}
      <div className="product-tabs-wrapper" style={{ marginTop: '60px' }}>
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid var(--border-color)', marginBottom: '30px' }}>
          <button 
            onClick={() => setActiveTab('details')}
            style={{
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              color: activeTab === 'details' ? 'var(--primary-color)' : 'var(--text-muted)',
              borderBottom: activeTab === 'details' ? '3px solid var(--primary-color)' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            Craft Details
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            style={{
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              color: activeTab === 'specs' ? 'var(--primary-color)' : 'var(--text-muted)',
              borderBottom: activeTab === 'specs' ? '3px solid var(--primary-color)' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            Specifications
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              color: activeTab === 'reviews' ? 'var(--primary-color)' : 'var(--text-muted)',
              borderBottom: activeTab === 'reviews' ? '3px solid var(--primary-color)' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-color)', marginBottom: '12px' }}>Handcrafted Elegance</h3>
            <p style={{ lineHeight: '1.8', color: 'var(--text-main)' }}>
              {product.description} Crafted meticulously by skilled traditional Indian artisans using authentic brass, teak wood, and natural organic lacquers. Each piece undergoes high-precision quality checks before being packaged into our signature reusable velvet hampers.
            </p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div>
                <strong style={{ color: 'var(--primary-color)' }}>Material:</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Pure Artisan Brass & Gold Foil Lacquer</p>
              </div>
              <div>
                <strong style={{ color: 'var(--primary-color)' }}>Origin:</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Handcrafted in Jaipur & Moradabad</p>
              </div>
              <div>
                <strong style={{ color: 'var(--primary-color)' }}>Care Instructions:</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Wipe gently with soft dry cotton cloth. Avoid harsh chemicals.</p>
              </div>
              <div>
                <strong style={{ color: 'var(--primary-color)' }}>Packaging:</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Gold-gilded gift box with protective wood-wool padding</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)' }}>
            {/* Write a review form */}
            <div style={{ marginBottom: '40px', backgroundColor: 'rgba(255,255,255,0.8)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(200, 169, 107, 0.3)' }}>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} style={{ color: 'var(--secondary-color)' }} /> Share Your Feedback
              </h4>

              {reviewSubmittedMsg && (
                <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={18} /> Thank you! Your review has been added successfully.
                </div>
              )}

              <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Your Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Rating</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px', fontSize: '0.9rem' }}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Your Review</label>
                  <textarea 
                    rows={3}
                    placeholder="Tell us about the craftsmanship, packaging, and gifting experience..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px', fontSize: '0.9rem' }}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
                  Submit Review
                </button>
              </form>
            </div>

            {/* List of customer reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.map(rev => (
                <div key={rev.id} style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--primary-color)' }}>{rev.author}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>
                  <div style={{ display: 'flex', color: 'var(--secondary-color)', marginBottom: '8px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < rev.rating ? 'var(--secondary-color)' : 'none'} color="var(--secondary-color)" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommended Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '70px' }}>
          <div className="text-center mb-8">
            <span className="section-subtitle">Complementary Curations</span>
            <h2 className="luxury-section-title">You May Also Like</h2>
            <div className="title-underline" style={{ margin: '8px auto' }}></div>
          </div>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
            {relatedProducts.map(rel => {
              const relImg = rel.product_images && rel.product_images.length > 0 ? rel.product_images[0].image_url : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800';
              return (
                <div key={rel.id} className="premium-product-card">
                  <div className="product-image-container">
                    <img src={relImg} alt={rel.name} className="product-image" />
                    <div className="product-actions">
                      <Link to={`/product/${rel.id}`} className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="premium-product-info">
                    <h3 className="premium-product-title">
                      <Link to={`/product/${rel.id}`}>{rel.name}</Link>
                    </h3>
                    <div className="premium-product-price-wrapper">
                      <span className="product-price">₹{rel.price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Responsive adjustments */}
      <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
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
