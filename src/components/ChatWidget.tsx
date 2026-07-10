import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Truck, 
  Gift as GiftIcon, 
  PenTool, 
  Ticket,
  Headphones
} from 'lucide-react';
import './ChatWidget.css';
import { getMockOrders, getActiveCampaigns } from '../lib/database';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  type?: 'default' | 'tracking' | 'recs' | 'lead-form' | 'lead-success';
  orderData?: any;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', note: '' });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! I am Aditi, your personal Saugaat Gifting Curator. I can assist you with active orders, customization options, or corporate bulk gifting. How may I add value to your experience today?'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const triggerBotResponse = (userText: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      let replyType: Message['type'] = 'default';
      let matchingOrder: any = undefined;
 
      const lowerText = userText.toLowerCase();
 
      // Check if the query has an order ID match
      const orderMatch = userText.toUpperCase().match(/(?:#)?(SG-(?:2026-)?\d+)/);
      const isTrackQuery = lowerText.includes('track') || lowerText.includes('status') || lowerText.includes('where is');
      
      if (orderMatch) {
        let orderId = orderMatch[1];
        if (orderId.startsWith('SG-') && !orderId.startsWith('SG-2026-')) {
          orderId = 'SG-2026-' + orderId.substring(3);
        }
        const allOrders = getMockOrders();
        const order = allOrders.find(o => o.id === orderId);
        if (order) {
          matchingOrder = order;
          replyText = `I found your order **#${order.id}** containing *${order.items}*.\n\n` +
            `• **Current Status**: ${order.status.toUpperCase()}\n` +
            `• **Expected Delivery**: ${order.expectedDelivery}\n` +
            `• **Latest Update**: *${order.logs[order.logs.length - 1]?.description || 'Order placed.'}*`;
          replyType = 'tracking';
        } else {
          replyText = `I searched for order **#${orderId}** but couldn't find it. Please double-check your order ID (e.g. SG-2026-081).`;
        }
      } else if (isTrackQuery || lowerText.includes('order')) {
        // Look up the active logged-in user
        const mockSession = localStorage.getItem('saugaat_mock_session');
        if (mockSession) {
          try {
            const sessionData = JSON.parse(mockSession);
            const email = sessionData.user?.email;
            if (email) {
              const allOrders = getMockOrders();
              const userOrders = allOrders.filter(o => o.customerEmail === email);
              if (userOrders.length > 0) {
                const active = userOrders.find(o => o.status !== 'delivered') || userOrders[0];
                matchingOrder = active;
                replyText = `I found your active order **#${active.id}** containing *${active.items}*:\n\n` +
                  `• **Current Status**: ${active.status.toUpperCase()}\n` +
                  `• **Expected Delivery**: ${active.expectedDelivery}\n` +
                  `• **Latest Update**: *${active.logs[active.logs.length - 1]?.description || 'Order placed.'}*\n\n` +
                  `You can type another order ID (e.g., SG-2026-081) if you want to track a different order!`;
                replyType = 'tracking';
              } else {
                replyText = "You don't have any active orders under your account right now. Build a bespoke hamper or browse our collections to place one!";
              }
            } else {
              replyText = "Please log in to track your active orders, or specify an order ID (e.g. SG-2026-080).";
            }
          } catch (e) {
            replyText = "I encountered an error looking up your session. Please provide a specific order ID to track (e.g., SG-2026-080).";
          }
        } else {
          replyText = "Please log in to track your active orders, or specify an order ID (e.g. SG-2026-080).";
        }
      } else if (lowerText.includes('hamper') || lowerText.includes('custom') || lowerText.includes('build')) {
        replyText = 'Crafting a bespoke hamper is simple! Go to your Customer Dashboard and open the "Hamper Builder" tab. Select your box style, drag premium items (Brass Diya, Incense, Sweets), and watch the budget sync live. Would you like to check it out?';
      } else if (lowerText.includes('card') || lowerText.includes('greeting') || lowerText.includes('calligraphy')) {
        replyText = 'We offer premium hand-written calligraphy greeting cards. To customize yours, head to your Customer Dashboard -> "Greeting Card Calligraphy" tab. You can preview scripts (Vedic, Royal Gold, Minimal Sans) in real-time. Feel free to try it!';
      } else if (lowerText.includes('promotion') || lowerText.includes('voucher') || lowerText.includes('coupon') || lowerText.includes('offer')) {
        const campaigns = getActiveCampaigns();
        const promoList = campaigns.map(c => `✨ **${c.code}** (${c.name}): **${c.value}** for *${c.target}*`).join('\n');
        replyText = `Here are our active promotional campaigns for the season:\n\n${promoList}\n\n*Note: Administrators can generate new customized voucher codes directly inside the Admin Dashboard under "Campaign Manager".*`;
      } else if (lowerText.includes('curator') || lowerText.includes('talk') || lowerText.includes('agent') || lowerText.includes('speak')) {
        replyText = 'Connecting to Gifting Curator Aditi... Connected!\n\n"Namaste! I would love to curate a specialized package for your occasion or assist with customized branding. Please leave your details below and I will get back to you within 30 minutes:"';
        replyType = 'lead-form';
      } else {
        replyText = 'Thank you for reaching out to Saugaat Concierge! That sounds wonderful. A dedicated gifting curator will verify your inquiry shortly. Feel free to email us directly at concierge@saugaat.com for bespoke design catalog requests.';
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: replyText,
          type: replyType,
          orderData: matchingOrder
        }
      ]);
    }, 1000);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText
      }
    ]);
    setInputText('');

    triggerBotResponse(userText);
  };

  const handlePresetClick = (presetText: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: `user-preset-${Date.now()}`,
        sender: 'user',
        text: presetText
      }
    ]);

    triggerBotResponse(presetText);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `lead-success-${Date.now()}`,
          sender: 'bot',
          text: `Thank you, ${leadForm.name || 'valued client'}! Your request has been queued. Gifting Curator Aditi will contact you at ${leadForm.email || 'your email'} shortly.`,
          type: 'lead-success'
        }
      ]);
      setLeadForm({ name: '', email: '', note: '' });
    }, 800);
  };

  return (
    <div className="saugaat-chatbot-container">
      {/* Toggle Bubble Button */}
      <button 
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Gifting Curator"
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
        {!isOpen && <div className="chatbot-pulse-indicator"></div>}
      </button>

      {/* Slide-up Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="chatbot-window"
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-curator-profile">
                <div className="curator-avatar-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" 
                    alt="Aditi - Curator" 
                    className="curator-avatar"
                  />
                  <div className="curator-online-dot"></div>
                </div>
                <div className="curator-info">
                  <h4>Aditi Sharma</h4>
                  <span>Saugaat Gifting Curator</span>
                </div>
              </div>
              <X 
                size={20} 
                className="chatbot-close-btn" 
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Chat Messages */}
            <div className="chatbot-body">
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div className={`chat-message ${msg.sender}`}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    
                    {/* Interactive Widget Types */}
                    {msg.type === 'tracking' && msg.orderData && (
                      <div className="chat-tracking-card">
                        <div className="chat-tracking-title">
                          <span>Delhivery Express #{msg.orderData.id}</span>
                          <span className="text-secondary">EST: {msg.orderData.expectedDelivery}</span>
                        </div>
                        <div className="chat-tracking-timeline">
                          {msg.orderData.logs.map((log: any, idx: number) => (
                            <div key={idx} className={`chat-timeline-step ${idx === msg.orderData.logs.length - 1 ? 'active' : 'completed'}`}>
                              <strong>{log.status.toUpperCase()}</strong>: {log.description}
                              <span className="chat-timeline-time">
                                {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.type === 'lead-form' && (
                      <form onSubmit={handleLeadSubmit} className="chat-lead-form">
                        <input 
                          type="text" 
                          placeholder="Your Name" 
                          required
                          value={leadForm.name}
                          onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        />
                        <input 
                          type="email" 
                          placeholder="Your Email" 
                          required
                          value={leadForm.email}
                          onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        />
                        <textarea 
                          placeholder="Occasion or Custom Request details..." 
                          rows={2}
                          value={leadForm.note}
                          onChange={(e) => setLeadForm({ ...leadForm, note: e.target.value })}
                        />
                        <button type="submit">Submit Request</button>
                      </form>
                    )}
                  </div>
                </div>
              ))}

              {/* Bot typing simulation */}
              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}

              {/* Presets suggestions (Shown when last message is from bot and not a input form) */}
              {!isTyping && messages[messages.length - 1]?.sender === 'bot' && messages[messages.length - 1]?.type !== 'lead-form' && (
                <div className="chatbot-presets-wrapper">
                  <button 
                    onClick={() => handlePresetClick('Track active order #SG-2026-081')}
                    className="chatbot-preset-btn"
                  >
                    <Truck size={14} className="text-secondary" />
                    <span>Track active order #SG-2026-081</span>
                  </button>
                  <button 
                    onClick={() => handlePresetClick('How do I build a custom hamper?')}
                    className="chatbot-preset-btn"
                  >
                    <GiftIcon size={14} className="text-secondary" />
                    <span>How to build custom hamper</span>
                  </button>
                  <button 
                    onClick={() => handlePresetClick('Tell me about greeting card options')}
                    className="chatbot-preset-btn"
                  >
                    <PenTool size={14} className="text-secondary" />
                    <span>Calligraphy card customizer</span>
                  </button>
                  <button 
                    onClick={() => handlePresetClick('What active promotions do you have?')}
                    className="chatbot-preset-btn"
                  >
                    <Ticket size={14} className="text-secondary" />
                    <span>Check voucher promotions</span>
                  </button>
                  <button 
                    onClick={() => handlePresetClick('I want to speak with Gifting Curator')}
                    className="chatbot-preset-btn"
                  >
                    <Headphones size={14} className="text-secondary" />
                    <span>Connect with human curator</span>
                  </button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="chatbot-footer">
              <input 
                type="text" 
                className="chatbot-input" 
                placeholder="Ask Aditi anything..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
              />
              <button 
                type="submit" 
                className={`chatbot-send-btn ${!inputText.trim() || isTyping ? 'disabled' : ''}`}
                disabled={!inputText.trim() || isTyping}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
