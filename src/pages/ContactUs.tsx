import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

export const ContactUs: React.FC = () => {
  return (
    <div className="contact-page section-padding container" style={{ minHeight: '60vh' }}>
      <div className="text-center mb-10">
        <h1 className="section-title">Contact Us</h1>
        <div className="title-underline"></div>
        <p className="text-muted mt-4">We would love to hear from you. Get in touch with us for any queries.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'start' }}>
        {/* Contact Info & Map */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '50%', color: 'var(--secondary-color)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Our Address</h3>
                <p style={{ color: 'var(--text-muted)' }}>123 Gifting Boulevard, Premium Estate<br />New Delhi, India 110001</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '50%', color: 'var(--secondary-color)' }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Phone Number</h3>
                <p style={{ color: 'var(--text-muted)' }}>+91 98765 43210</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '50%', color: 'var(--secondary-color)' }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Email Address</h3>
                <p style={{ color: 'var(--text-muted)' }}>hello@saugaat.com</p>
              </div>
            </div>
          </div>

          {/* Map Embed (Placeholder using iframe) */}
          <div style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.48129412968!2d77.0688997!3d28.5272803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1683100000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}
        >
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '25px' }}>Send an Enquiry</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Your Name</label>
              <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Your Email</label>
              <input type="email" placeholder="john@example.com" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Subject</label>
              <input type="text" placeholder="Bulk Order Enquiry" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Message</label>
              <textarea rows={5} placeholder="How can we help you?" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
            </div>
            <button type="button" className="btn btn-primary" style={{ marginTop: '10px', padding: '15px' }}>Submit Enquiry</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
