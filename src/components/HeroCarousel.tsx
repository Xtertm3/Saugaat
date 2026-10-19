import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, MessageSquare, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { preloadImages } from '../utils/imagePreloader';
import { slugify, type Product } from '../lib/database';
import { useCart } from '../context/CartContext';
import './HeroCarousel.css';

interface HeroCarouselProps {
  products: Product[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!products || products.length === 0) return;
    const slideUrls = products.map((p) => p.product_images?.[0]?.image_url).filter(Boolean);
    preloadImages(slideUrls, { width: 650, quality: 75 });
  }, [products]);

  useEffect(() => {
    if (isHovering || products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovering, products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!products || products.length === 0) {
    return (
      <div style={{ minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No products available</p>
      </div>
    );
  }

  const currentProduct = products[currentIndex];
  const isBedsheetProduct = currentProduct.name.toLowerCase().includes('bedsheet');
  const isDiwaliHamper = currentProduct.name.toLowerCase().includes('diwali');
  const rawImageUrl =
    (currentProduct.product_images && currentProduct.product_images.length > 0 && currentProduct.product_images[0]?.image_url) ||
    (isBedsheetProduct ? '/products/rassrang-bedsheet-combo-4pack.jpg' : 
     isDiwaliHamper ? '/products/diwali-herbal-tea-jute-hamper.jpg' :
     'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format,compress&fit=crop&q=70&w=650&fm=webp');

  const imageUrl = getOptimizedImageUrl(rawImageUrl, { width: 700, quality: 80 });
  const isQuoteItem = currentProduct.price === 0 || currentProduct.category_id === 'curtains' || slugify(currentProduct.category_id) === 'curtains';
  const discountPercentage = currentProduct.original_price && currentProduct.original_price > currentProduct.price
    ? Math.round(((currentProduct.original_price - currentProduct.price) / currentProduct.original_price) * 100)
    : (currentProduct.discount_percentage || 0);

  const getWhatsAppMessage = () => {
    if (isDiwaliHamper) {
      return `*DIWALI FESTIVE GIFT HAMPER ORDER - SAUGAAT*\n----------------------------------------\n🪔 *Hamper:* ${currentProduct.name}\n💰 *Festive Price:* ₹${currentProduct.price} each\n🎁 *Description:* Handcrafted festive curation with pure herbal teas\n----------------------------------------\nHi Saugaat Team, I want to order this Diwali Gift Hamper (${currentProduct.name}) priced at ₹${currentProduct.price} each. Please assist me with delivery and booking!`;
    }
    if (isBedsheetProduct) {
      return `*HERO FLASH SALE ORDER - SAUGAAT*\n------------------------------\n🖼️ *Item:* ${currentProduct.name}\n💰 *Price:* ₹${currentProduct.price} (Get 4 at price of 2)\n------------------------------\nHi Saugaat Team, I want to order this Flash Sale Bed Sheet offer! Please guide me.`;
    }
    return `*ORDER ENQUIRY - SAUGAAT*\n------------------------------\n✨ *Item:* ${currentProduct.name}\n💰 *Price:* ₹${currentProduct.price}\n------------------------------\nHi Saugaat Team, I would like to order ${currentProduct.name}. Please guide me.`;
  };

  const handleQuickBuy = () => {
    addToCart({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: imageUrl
    });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      navigate('/cart');
    }, 600);
  };

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="hero-carousel-slide"
        >
          {/* Image Column */}
          <motion.div
            initial={{ x: -25, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="hero-carousel-image-box"
          >
            <Link to={`/product/${currentProduct.id}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={imageUrl}
                alt={currentProduct.name}
                loading="eager"
                decoding="sync"
                onError={(e) => {
                  if (isBedsheetProduct) {
                    (e.target as HTMLImageElement).src = '/rassrang-bedsheet.jpg';
                  } else if (isDiwaliHamper) {
                    (e.target as HTMLImageElement).src = '/products/diwali-herbal-tea-jute-hamper.jpg';
                  } else {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format,compress&fit=crop&q=75&w=650&fm=webp';
                  }
                }}
              />
            </Link>

            {/* Discount / Quote badge */}
            {isQuoteItem ? (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.5px'
                }}
              >
                PRICE ON REQUEST
              </div>
            ) : isDiwaliHamper ? (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'linear-gradient(135deg, #b8860b 0%, #c41e3a 100%)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: 800,
                  fontSize: '11px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(184, 134, 11, 0.4)'
                }}
              >
                🪔 DIWALI SPECIAL • ₹750 EACH
              </div>
            ) : discountPercentage > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: 800,
                  fontSize: '11px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(230, 57, 70, 0.4)'
                }}
              >
                {discountPercentage >= 50 ? '🔥 GET 4 AT PRICE OF 2 (50% OFF)' : `${discountPercentage}% OFF`}
              </div>
            ) : null}
          </motion.div>

          {/* Offer Details Column */}
          <motion.div
            initial={{ x: 25, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="hero-carousel-info"
          >
            {/* Badges bar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {isDiwaliHamper ? (
                <span
                  style={{
                    background: 'linear-gradient(135deg, #b8860b 0%, #c41e3a 100%)',
                    color: 'white',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    boxShadow: '0 2px 10px rgba(196, 30, 58, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🪔 Diwali Festive Special
                </span>
              ) : (
                <span
                  style={{
                    background: 'linear-gradient(135deg, #c8a96b 0%, #b38b46 100%)',
                    color: 'white',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    boxShadow: '0 2px 8px rgba(200, 169, 107, 0.3)'
                  }}
                >
                  {isBedsheetProduct ? '⚡ Flash Sale Deal' : '✨ Featured Curation'}
                </span>
              )}
              {currentProduct.is_bestseller && (
                <span
                  style={{
                    background: 'var(--secondary-color)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  ⭐ Bestseller
                </span>
              )}
              {currentProduct.is_trending && (
                <span
                  style={{
                    background: 'var(--primary-color)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  🔥 Hero Collection
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1
              style={{
                fontSize: 'clamp(1.5rem, 2.8vw, 2.3rem)',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                color: 'var(--primary-color)',
                margin: 0,
                lineHeight: 1.2
              }}
            >
              <Link to={`/product/${currentProduct.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {isBedsheetProduct ? 'GET 4 AT THE PRICE OF TWO — Rassrang Double Bedsheets (Set of 4)' : currentProduct.name}
              </Link>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                margin: 0,
                lineHeight: 1.55,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {currentProduct.description}
            </p>

            {/* Pricing Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              {isQuoteItem ? (
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--primary-color)'
                  }}
                >
                  Price on Request
                </span>
              ) : (
                <>
                  <span
                    style={{
                      fontSize: '2rem',
                      fontWeight: 900,
                      color: 'var(--primary-color)'
                    }}
                  >
                    ₹{currentProduct.price.toLocaleString()}
                  </span>
                  {currentProduct.original_price && currentProduct.original_price > currentProduct.price && (
                    <span
                      style={{
                        fontSize: '1.15rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'line-through'
                      }}
                    >
                      ₹{currentProduct.original_price.toLocaleString()}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#1b5e20',
                        backgroundColor: '#e8f5e9',
                        padding: '3px 10px',
                        borderRadius: '12px'
                      }}
                    >
                      SAVE ₹{(currentProduct.original_price! - currentProduct.price).toLocaleString()} ({discountPercentage}% OFF)
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Features Pill Bar */}
            {isDiwaliHamper ? (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  fontSize: '0.8rem',
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                  backgroundColor: 'rgba(212, 175, 55, 0.14)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '4px solid #b8860b',
                  flexWrap: 'wrap'
                }}
              >
                <span>🪔 Festive Diwali Collection</span>
                <span>•</span>
                <span>🎁 Complete Gift Hamper</span>
                <span>•</span>
                <span>🌿 100% Herbal Teas</span>
                <span>•</span>
                <span>✨ Special Festive Price: ₹750 Each</span>
              </div>
            ) : isBedsheetProduct ? (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  fontSize: '0.8rem',
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                  backgroundColor: 'rgba(200, 169, 107, 0.12)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '4px solid var(--secondary-color)',
                  flexWrap: 'wrap'
                }}
              >
                <span>✨ Assorted Colours & Prints</span>
                <span>•</span>
                <span>🛏️ Fits Double Beds</span>
                <span>•</span>
                <span>🌿 100% Cotton Feel Fabric</span>
                <span>•</span>
                <span>1 Bedsheet MRP: ₹1,499</span>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '4px',
                flexWrap: 'wrap'
              }}
            >
              {!isQuoteItem && (
                <button
                  onClick={handleQuickBuy}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    minWidth: '170px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 700,
                    padding: '12px 18px',
                    fontSize: '0.85rem'
                  }}
                >
                  {justAdded ? (
                    <>
                      <Check size={18} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> BUY NOW (₹{currentProduct.price}{isDiwaliHamper ? ' EACH' : ''})
                    </>
                  )}
                </button>
              )}

              <a
                href={`https://wa.me/918368229705?text=${encodeURIComponent(getWhatsAppMessage())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  flex: 1,
                  minWidth: '170px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  borderColor: '#25D366',
                  color: 'white',
                  fontWeight: 700,
                  padding: '12px 18px',
                  fontSize: '0.85rem'
                }}
              >
                <MessageSquare size={18} /> ORDER VIA WHATSAPP (8368229705)
              </a>

              <Link
                to={`/product/${currentProduct.id}`}
                className="btn btn-secondary"
                style={{
                  padding: '12px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                View Details
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button onClick={goToPrevious} className="hero-nav-arrow prev" title="Previous Slide">
        <ChevronLeft size={22} />
      </button>

      <button onClick={goToNext} className="hero-nav-arrow next" title="Next Slide">
        <ChevronRight size={22} />
      </button>

      {/* Dots Indicator */}
      <div className="hero-dots-container">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentIndex ? '30px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: index === currentIndex ? 'var(--secondary-color)' : 'rgba(11, 34, 57, 0.25)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};
