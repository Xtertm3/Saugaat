import React from 'react';
import { motion } from 'framer-motion';

export const ReturnPolicy: React.FC = () => {
  return (
    <div className="section-padding container" style={{ minHeight: '60vh', maxWidth: '800px' }}>
      <div className="text-center mb-10">
        <h1 className="section-title">Return & Exchange Policy</h1>
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
            At <strong>Saugaat</strong>, we want you to be completely satisfied with your purchase. If for any reason you are not entirely happy with your premium gifting or decor item, we are here to help with a clear and transparent return process.
          </p>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>1. Return Eligibility</h3>
          <p style={{ marginBottom: '15px' }}>
            We have a <strong>7-day return policy</strong>, which means you have 7 days after receiving your item to request a return.
          </p>
          <p style={{ marginBottom: '20px' }}>
            To be eligible for a return, your item must be in the exact same condition that you received it: unworn, unused, with tags, and in its original packaging. You will also need the receipt or proof of purchase.
          </p>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>2. Non-Returnable Items</h3>
          <p style={{ marginBottom: '15px' }}>
            Certain types of items cannot be returned due to hygiene and customization reasons. These include:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '10px' }}>Customized or personalized gift items.</li>
            <li style={{ marginBottom: '10px' }}>Perishable goods (e.g., sweets in gift hampers) once opened.</li>
            <li style={{ marginBottom: '10px' }}>Gift cards.</li>
            <li style={{ marginBottom: '10px' }}>Items marked as "Final Sale" or purchased during a clearance event.</li>
          </ul>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>3. How to Start a Return</h3>
          <p style={{ marginBottom: '20px' }}>
            To start a return, you can contact us at <strong>hello@saugaat.com</strong>. If your return is accepted, we will send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
          </p>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>4. Exchanges</h3>
          <p style={{ marginBottom: '20px' }}>
            The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item. We only directly exchange items if they are defective or damaged upon arrival.
          </p>

          <h3 style={{ color: 'var(--primary-color)', marginTop: '30px', marginBottom: '15px' }}>5. Refunds Process</h3>
          <p style={{ marginBottom: '20px' }}>
            We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within <strong>5-7 business days</strong>. Please remember it can take some time for your bank or credit card company to process and post the refund too.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
