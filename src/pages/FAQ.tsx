import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we only ship within India. We are working hard to expand our logistics to international destinations soon!"
  },
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 3-5 business days for metro cities, and 5-7 business days for other locations."
  },
  {
    question: "Can I customize a gift hamper?",
    answer: "Absolutely! We offer bespoke gifting solutions for bulk orders (weddings, corporate events). Please reach out via our Contact Us page with your requirements."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 7 days of delivery if the item is damaged or defective. Please ensure the product is unused and in its original packaging."
  },
  {
    question: "Are your crystals authentic?",
    answer: "Yes, all our healing crystals are 100% natural and ethically sourced. Each piece comes with a card explaining its healing properties."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page section-padding container" style={{ minHeight: '60vh', maxWidth: '800px' }}>
      <div className="text-center mb-10">
        <h1 className="section-title">Frequently Asked Questions</h1>
        <div className="title-underline"></div>
        <p className="text-muted mt-4">Find answers to some of our most common queries.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{ 
              backgroundColor: 'white', 
              borderRadius: 'var(--radius-md)', 
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{ 
                padding: '20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: openIndex === index ? 'var(--bg-main)' : 'white'
              }}
              onClick={() => toggleFaq(index)}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: '500', margin: 0, color: 'var(--primary-color)' }}>
                {faq.question}
              </h3>
              <div style={{ color: 'var(--secondary-color)' }}>
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {openIndex === index && (
              <div style={{ padding: '0 20px 20px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <div style={{ paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
                  {faq.answer}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
