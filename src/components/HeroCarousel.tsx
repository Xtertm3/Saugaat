import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { preloadImages } from '../utils/imagePreloader';
import { type Product } from '../lib/database';

interface HeroCarouselProps {
  products: Product[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Preload all carousel slide images immediately into RAM
  useEffect(() => {
    if (!products || products.length === 0) return;
    const slideUrls = products.map((p) => p.product_images?.[0]?.image_url).filter(Boolean);
    preloadImages(slideUrls, { width: 650, quality: 70 });
  }, [products]);

  // Auto-advance carousel every 5 seconds unless hovering
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
    return <div style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>No products available</p>
    </div>;
  }

  const currentProduct = products[currentIndex];
  const rawImageUrl = currentProduct.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format,compress&fit=crop&q=70&w=650&fm=webp';
  const imageUrl = getOptimizedImageUrl(rawImageUrl, { width: 650, quality: 70 });
  const discountPercentage = currentProduct.original_price && currentProduct.original_price > currentProduct.price
    ? Math.round(((currentProduct.original_price - currentProduct.price) / currentProduct.original_price) * 100)
    : (currentProduct.discount_percentage || 0);

  return (
    <div
      className="hero-carousel"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '600px',
        background: 'var(--bg-main)',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Carousel slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center',
            padding: '60px',
          }}
        >
          {/* Image side */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              background: 'white',
            }}
          >
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

            {/* Discount badge */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'var(--accent-color)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {discountPercentage}% OFF
            </div>
          </motion.div>

          {/* Info side */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Badges */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {currentProduct.is_bestseller && (
                <span
                  style={{
                    background: 'var(--secondary-color)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  ⭐ Bestseller
                </span>
              )}
              {currentProduct.is_trending && (
                <span
                  style={{
                    background: 'var(--accent-color)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  🔥 Trending
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                fontFamily: 'Playfair Display, serif',
                color: 'var(--primary-color)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {currentProduct.name}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-muted)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {currentProduct.description}
            </p>

            {/* Pricing */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
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
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              <button
                className="btn btn-primary"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                style={{
                  background: 'white',
                  border: '2px solid var(--secondary-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--secondary-color)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'white';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--secondary-color)';
                }}
              >
                <Heart size={20} color="var(--secondary-color)" />
              </button>
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
