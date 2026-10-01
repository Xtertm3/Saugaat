import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { preloadImages } from '../utils/imagePreloader';
import { slugify, type Product } from '../lib/database';

interface HeroCarouselProps {
  products: Product[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const slideUrls = products.map((p) => p.product_images?.[0]?.image_url).filter(Boolean);
    preloadImages(slideUrls, { width: 650, quality: 70 });
  }, [products]);

  useEffect(() => {
    if (isHovering || products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
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
    return <div style={{ minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>No products available</p>
    </div>;
  }

  const currentProduct = products[currentIndex];
  const rawImageUrl = currentProduct.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format,compress&fit=crop&q=70&w=650&fm=webp';
  const imageUrl = getOptimizedImageUrl(rawImageUrl, { width: 650, quality: 70 });
  const isQuoteItem = currentProduct.price === 0 || currentProduct.category_id === 'curtains' || slugify(currentProduct.category_id) === 'curtains';
  const discountPercentage = currentProduct.original_price && currentProduct.original_price > currentProduct.price
    ? Math.round(((currentProduct.original_price - currentProduct.price) / currentProduct.original_price) * 100)
    : (currentProduct.discount_percentage || 0);

  return (
    <div
      className="hero-carousel"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '440px',
        maxHeight: '520px',
        background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.04) 0%, rgba(245, 158, 11, 0.05) 100%)',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(8, 145, 178, 0.15)'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-carousel-slide"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 420px) 1fr',
            gap: '40px',
            alignItems: 'center',
            padding: '30px 60px',
            maxWidth: '1240px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          {/* Image side */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-carousel-image-box"
            style={{
              position: 'relative',
              width: '100%',
              height: '380px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              background: 'linear-gradient(145deg, #1f4d3a 0%, #0b2239 100%)',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px'
            }}
          >
            <Link to={`/product/${currentProduct.id}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={imageUrl}
                alt={currentProduct.name}
                loading="eager"
                decoding="sync"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format,compress&fit=crop&q=75&w=650&fm=webp';
                }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  display: 'block',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}
              />
            </Link>

            {/* Discount / Quote badge */}
            {isQuoteItem ? (
              <div
                style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
              >
                PRICE ON REQUEST
              </div>
            ) : discountPercentage > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 800,
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(230, 57, 70, 0.4)'
                }}
              >
                {discountPercentage >= 50 ? '🔥 GET 4 AT PRICE OF 2 (50% OFF)' : `${discountPercentage}% OFF`}
              </div>
            ) : null}
          </motion.div>

          {/* Info side */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
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
                ⚡ Flash Sale Deal
              </span>
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

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: 'var(--primary-color)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              <Link to={`/product/${currentProduct.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {currentProduct.name}
              </Link>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                margin: 0,
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {currentProduct.description}
            </p>

            {/* Pricing */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                flexWrap: 'wrap'
              }}
            >
              {isQuoteItem ? (
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--primary-color)',
                  }}
                >
                  Price on Request
                </span>
              ) : (
                <>
                  <span
                    style={{
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: 'var(--primary-color)',
                    }}
                  >
                    ₹{currentProduct.price.toLocaleString()}
                  </span>
                  {currentProduct.original_price && currentProduct.original_price > currentProduct.price && (
                    <span
                      style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'line-through',
                      }}
                    >
                      ₹{currentProduct.original_price.toLocaleString()}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#2e7d32',
                        backgroundColor: '#e8f5e9',
                        padding: '4px 10px',
                        borderRadius: '12px'
                      }}
                    >
                      SAVE ₹{(currentProduct.original_price! - currentProduct.price).toLocaleString()} ({discountPercentage}% OFF)
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Features summary bar if bedsheets */}
            {currentProduct.name.toLowerCase().includes('bedsheet') && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  fontSize: '0.8rem',
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                  backgroundColor: 'rgba(200, 169, 107, 0.1)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--secondary-color)'
                }}
              >
                <span>✨ Assorted Colours & Prints</span>
                <span>•</span>
                <span>🛏️ Fits Double Beds</span>
                <span>•</span>
                <span>🌿 100% Cotton Feel</span>
              </div>
            )}

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '6px',
                flexWrap: 'wrap'
              }}
            >
              <Link
                to={`/product/${currentProduct.id}`}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  minWidth: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  padding: '12px 20px',
                  fontSize: '0.85rem'
                }}
              >
                <ShoppingCart size={18} /> VIEW OFFER DETAILS
              </Link>
              <a
                href={`https://wa.me/918368229705?text=${encodeURIComponent(`*HERO FLASH SALE ORDER - SAUGAAT*\n------------------------------\n🖼️ *Item:* ${currentProduct.name}\n💰 *Price:* ₹${currentProduct.price} (Get 4 at price of 2)\n------------------------------\nHi Saugaat Team, I want to order this Flash Sale Bed Sheet offer! Please guide me.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  flex: 1,
                  minWidth: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  borderColor: '#25D366',
                  color: 'white',
                  fontWeight: 700,
                  padding: '12px 20px',
                  fontSize: '0.85rem'
                }}
              >
                <MessageSquare size={18} /> ORDER VIA WHATSAPP (8368229705)
              </a>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-color)';
          (e.currentTarget as HTMLButtonElement).style.color = 'white';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.9)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary-color)';
        }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-color)';
          (e.currentTarget as HTMLButtonElement).style.color = 'white';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.9)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary-color)';
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10,
        }}
      >
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentIndex ? '32px' : '12px',
              height: '12px',
              borderRadius: '6px',
              background: index === currentIndex ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (index !== currentIndex) {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentIndex) {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.5)';
              }
            }}
          />
        ))}
      </div>

      {/* Mobile responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          [style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
            padding: 30px !important;
            gap: 20px !important;
          }

          [style*="fontSize: '2.5rem'"] {
            font-size: 1.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};
