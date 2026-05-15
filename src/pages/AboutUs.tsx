import React from 'react';
import { motion } from 'framer-motion';

export const AboutUs: React.FC = () => {
  return (
    <div className="about-page section-padding container" style={{ minHeight: '60vh', maxWidth: '800px' }}>
      <div className="text-center mb-10">
        <h1 className="section-title">About Saugaat</h1>
        <div className="title-underline"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="content-body"
      >
        <img 
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200" 
          alt="Saugaat Gifting" 
          style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: '30px', boxShadow: 'var(--shadow-md)' }} 
        />
        
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>Our Story</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
          Welcome to <strong>Saugaat</strong>, where the art of gifting meets elegance and tradition. 
          Founded with a passion for bringing joy to special occasions, Saugaat curates premium, 
          handcrafted home decor, festive essentials, and bespoke gift hampers that speak directly to the heart.
        </p>

        <h2 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>Our Promise</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
          We believe that every gift should tell a story. Whether you are looking for divine idols to bless a new home, 
          healing crystals to bring positivity, or return gifts to express your gratitude, we ensure that every item in 
          our collection is sourced with the utmost care for quality and aesthetic appeal.
        </p>

        <div style={{ backgroundColor: 'var(--bg-main)', padding: '30px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginTop: '40px' }}>
          <h3 style={{ color: 'var(--secondary-color)', fontStyle: 'italic', marginBottom: '10px' }}>"Gifting made effortless, memorable, and beautiful."</h3>
        </div>
      </motion.div>
    </div>
  );
};
