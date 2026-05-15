import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories, products } from '../data/mockData';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            The Art of Thoughtful Gifting
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            Discover premium home decor, spiritual essentials, and curated hampers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/category/all" className="btn btn-primary hero-btn">
              Shop Now
            </Link>
          </motion.div>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Shop By Category */}
      <section className="section-padding container">
        <div className="text-center mb-10">
          <h2 className="section-title">Shop by Category</h2>
          <div className="title-underline"></div>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={`/category/${category.id}`} className="category-circle">
                <div className="category-image-wrapper">
                  <img src={category.image} alt={category.name} className="category-image" />
                </div>
                <span className="category-name">{category.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="section-padding bg-main">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="section-title">Trending Now</h2>
            <div className="title-underline"></div>
          </div>
          <div className="product-grid">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="product-card"
              >
                {product.discount && <div className="product-badge">{product.discount}</div>}
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-actions">
                    <button className="btn btn-primary" style={{flex: 1}}>Add to Cart</button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price-wrapper">
                    <span className="product-price">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="product-original-price">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/category/all" className="btn btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Feature Banner */}
      <section className="feature-banner section-padding text-center">
        <div className="container relative z-10">
          <h2 className="feature-title mb-4">Gifts for Every Occasion</h2>
          <p className="feature-desc mb-8">
            Make every moment memorable with our exquisite collection of handpicked gifts.
          </p>
          <Link to="/category/gift-packs" className="btn btn-accent">Explore Gifting</Link>
        </div>
        <div className="hero-overlay"></div>
      </section>
    </div>
  );
};
