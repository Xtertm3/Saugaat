import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products, categories } from '../data/mockData';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const category = categories.find(c => c.id === categoryId);
  const categoryName = category ? category.name : (categoryId === 'all' ? 'All Products' : 'Category');
  
  const displayProducts = categoryId === 'all' 
    ? products 
    : products.filter(p => p.category === categoryId);

  return (
    <div className="category-page section-padding container" style={{ minHeight: '60vh' }}>
      <div className="mb-10 text-center">
        <h1 className="section-title">{categoryName}</h1>
        <div className="title-underline"></div>
        <p className="text-muted mt-4">Showing {displayProducts.length} products</p>
      </div>

      {displayProducts.length === 0 ? (
        <div className="text-center" style={{ padding: '40px 0' }}>
          <h3>No products found in this category.</h3>
          <Link to="/category/all" className="btn btn-primary mt-4" style={{ marginTop: '20px' }}>View All Products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="product-card"
            >
              {product.discount && <div className="product-badge">{product.discount}</div>}
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-actions">
                  <button className="btn btn-primary" style={{flex: 1}}>Add to Cart</button>
                  <Link to={`/product/${product.id}`} className="btn btn-secondary" style={{ backgroundColor: 'white' }}>View</Link>
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
      )}
    </div>
  );
};
