import React from 'react';
import { motion } from 'framer-motion';

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="section-padding container" style={{ minHeight: '60vh', maxWidth: '800px' }}>
      <div className="text-center mb-10">
        <h1 className="section-title">Shipping & Delivery Policy</h1>
        <div className="title-underline"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div style={{ color: 'var(--text-main)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '20px' }}>
            At <strong>Saugaat</strong>, we are committed to delivering your gifts and decor items with the utmost care and efficiency. Please read our shipping policy below to understand our processing times, shipping rates, and delivery expectations.
          </p>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>1. Order Processing Time</h3>
          <p style={{ marginBottom: '15px' }}>
            All orders are processed within <strong>1 to 2 business days</strong> (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. 
          </p>
          <p style={{ marginBottom: '20px' }}>
            <em>Please note: During high-volume periods such as Diwali or corporate gifting seasons, processing times may be slightly extended.</em>
          </p>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>2. Domestic Shipping Rates and Estimates</h3>
          <p style={{ marginBottom: '15px' }}>
            Shipping charges for your order will be calculated and displayed at checkout. We offer the following standard shipping options:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>Standard Shipping:</strong> 3 to 5 business days for metro cities.</li>
            <li style={{ marginBottom: '10px' }}><strong>Regional Delivery:</strong> 5 to 7 business days for non-metro and remote locations.</li>
            <li style={{ marginBottom: '10px' }}><strong>Free Shipping:</strong> Enjoy complimentary standard shipping on all orders over ₹1,500.</li>
          </ul>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>3. Shipment Confirmation & Order Tracking</h3>
          <p style={{ marginBottom: '20px' }}>
            You will receive a Shipment Confirmation email once your order has shipped, containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>4. Damages & Issues</h3>
          <p style={{ marginBottom: '20px' }}>
            We package all our premium items securely. However, if you receive a damaged product, please contact us immediately at <strong>hello@saugaat.com</strong> with photos of the damaged item and packaging so we can resolve the issue promptly.
          </p>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>5. International Shipping</h3>
          <p>
            Currently, Saugaat does not offer international shipping. We only deliver within the boundaries of India. We are working on expanding our logistics to reach our global customers soon.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
