import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { preloadImages } from '../utils/imagePreloader';
import { slugify, type Product } from '../lib/database';
import { STORE_CONTACT } from '../config/contact';

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
              maxHeight: '360px',
              aspectRatio: '4/3',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              background: 'white',
              margin: '0 auto'
            }}
          >
            <Link to={`/product/${currentProduct.id}`}>
              <img
                src={imageUrl}
                alt={currentProduct.name}
                loading="eager"
                decoding="sync"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
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
                  letterSpacing: '0.5px'
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
                  background: 'var(--accent-color)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '12px',
                }}
              >
                {discountPercentage}% OFF
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
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                      fontSize: '1.8rem',
                      fontWeight: 700,
                      color: 'var(--primary-color)',
                    }}
                  >
                    ₹{currentProduct.price.toLocaleString()}
                  </span>
                  {currentProduct.original_price && currentProduct.original_price > currentProduct.price && (
                    <span
                      style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'line-through',
                      }}
                    >
                      ₹{currentProduct.original_price.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '6px'
              }}
            >
              {isQuoteItem ? (
                <a
                  href={`https://wa.me/${STORE_CONTACT.whatsappNumber}?text=${encodeURIComponent(`*HERO QUOTATION ENQUIRY - SAUGAAT*\n------------------------------\n🖼️ *Product:* ${currentProduct.name}\n📍 *Category:* Curtains & Decor\n------------------------------\nHi Saugaat Support, I am interested in getting a quote for this featured item.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
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
                  <MessageSquare size={18} /> GET QUOTATION VIA WHATSAPP
                </a>
              ) : (
                <Link
                  to={`/product/${currentProduct.id}`}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 700,
                    padding: '12px 20px',
                    fontSize: '0.85rem'
                  }}
                >
                  <ShoppingCart size={18} /> VIEW PRODUCT DETAILS
                </Link>
              )}
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
