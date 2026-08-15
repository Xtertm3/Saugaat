import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, getActiveCampaigns } from '../lib/database';
import { STORE_CONTACT } from '../config/contact';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  Wallet,
  Tag,
  Check,
  AlertCircle,
  Printer,
  MessageSquare,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';

type CheckoutStep = 'shipping' | 'method' | 'payment' | 'success';

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PaymentInfo {
  method: 'card' | 'upi' | 'cod';
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvv?: string;
  upiId?: string;
}

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user, points, updatePoints } = useAuth();
  const navigate = useNavigate();

  // Redirect if cart is empty and we are not in success step
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  useEffect(() => {
    if (cart.length === 0 && currentStep !== 'success') {
      navigate('/cart');
    }
  }, [cart, currentStep, navigate]);

  // Form states
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  // Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccessMsg, setCouponSuccessMsg] = useState<string | null>(null);

  // Subtotal calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 50 : 0;
  
  // Calculate discount
  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.value.includes('%')) {
      const percentage = parseInt(appliedCoupon.value.replace(/[^0-9]/g, ''));
      return Math.round((subtotal * percentage) / 100);
    } else {
      const fixedAmount = parseInt(appliedCoupon.value.replace(/[^0-9]/g, ''));
      return Math.min(subtotal, fixedAmount);
    }
  };

  const discount = getDiscountAmount();
  const total = Math.max(0, subtotal + shippingCost - discount);

  // Validate Shipping Form
  const validateShipping = () => {
    const errors: Record<string, string> = {};
    if (!shippingAddress.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!shippingAddress.email.trim() || !/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      errors.email = 'A valid Email is required';
    }
    if (!shippingAddress.phone.trim() || !/^\+?[0-9]{10,12}$/.test(shippingAddress.phone.replace(/\s+/g, ''))) {
      errors.phone = 'A valid Phone number is required';
    }
    if (!shippingAddress.addressLine.trim()) errors.addressLine = 'Address is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';
    if (!shippingAddress.state.trim()) errors.state = 'State is required';
    if (!shippingAddress.postalCode.trim() || !/^[0-9]{6}$/.test(shippingAddress.postalCode)) {
      errors.postalCode = 'A valid 6-digit PIN code is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Payment Info
  const validatePayment = () => {
    const errors: Record<string, string> = {};
    if (paymentInfo.method === 'card') {
      const cleanCard = (paymentInfo.cardNumber || '').replace(/\s+/g, '');
      if (cleanCard.length !== 16 || isNaN(Number(cleanCard))) {
        errors.cardNumber = 'Card number must be 16 digits';
      }
      if (!(paymentInfo.cardName || '').trim()) {
        errors.cardName = 'Name on card is required';
      }
      const exp = paymentInfo.expiry || '';
      if (!exp || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(exp)) {
        errors.expiry = 'Expiry must be MM/YY';
      }
      const cleanCvv = (paymentInfo.cvv || '').trim();
      if (cleanCvv.length !== 3 || isNaN(Number(cleanCvv))) {
        errors.cvv = 'CVV must be 3 digits';
      }
    } else if (paymentInfo.method === 'upi') {
      const upi = (paymentInfo.upiId || '').trim();
      if (!upi || !upi.includes('@')) {
        errors.upiId = 'Enter a valid UPI ID (e.g. name@upi)';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Apply Coupon Code
  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccessMsg(null);
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const campaigns = getActiveCampaigns();
    const cleanCode = couponCode.toUpperCase().trim();
    const campaign = campaigns.find(c => c.code.toUpperCase() === cleanCode);

    if (!campaign) {
      setCouponError('Invalid coupon code. Try JUSTFORYOU or WEDDING15');
      return;
    }

    // Verify target audience (Gold members restriction representation)
    if (campaign.target.toLowerCase().includes('gold') && points < 300) {
      setCouponError(`This coupon is exclusive to Gold Tier Members (requires 300+ Gifting Points). Your points: ${points}`);
      return;
    }

    setAppliedCoupon(campaign);
    setCouponSuccessMsg(`Successfully applied coupon code: "${campaign.code}"! Saving ${campaign.value}.`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccessMsg(null);
    setCouponCode('');
  };

  // Order Submission
  const handleSubmitOrder = async () => {
    if (!validatePayment()) return;

    // Compile items list
    const itemsDescription = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');

    // Check for pending card
    let attachedCard = undefined;
    const pendingCardJson = localStorage.getItem('saugaat_pending_card');
    if (pendingCardJson) {
      try {
        attachedCard = JSON.parse(pendingCardJson);
        localStorage.removeItem('saugaat_pending_card');
      } catch (e) {
        console.error('Error parsing pending card:', e);
      }
    }

    // Expected Delivery Date calculation
    const daysToAdd = shippingMethod === 'express' ? 3 : 6;
    const estDelivery = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const newOrder = await createOrder({
      customerEmail: shippingAddress.email,
      customerName: shippingAddress.fullName,
      items: itemsDescription + (appliedCoupon ? ` [Discount: ${appliedCoupon.code}]` : ''),
      total: total,
      expectedDelivery: estDelivery,
      card: attachedCard
    });

    if (newOrder) {
      // Award Gifting Points: 100 standard + 50 bonus if express shipping selected + 20 if coupon code applied
      let pointsAwarded = 100;
      if (shippingMethod === 'express') pointsAwarded += 50;
      if (appliedCoupon) pointsAwarded += 20;

      await updatePoints(pointsAwarded);
      
      setCreatedOrder({
        ...newOrder,
        pointsAwarded,
        address: shippingAddress,
        payment: paymentInfo,
        shippingFee: shippingCost,
        subtotal,
        discount
      });

      // Format WhatsApp order message for customer redirection
      const waText = `*NEW SAUGAAT ORDER #${newOrder.id}*
------------------------------
👤 *Customer:* ${shippingAddress.fullName}
📞 *Phone:* ${shippingAddress.phone}
✉️ *Email:* ${shippingAddress.email}
📍 *Address:* ${shippingAddress.addressLine}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}

📦 *Items Purchased:*
${cart.map(item => `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n')}

💳 *Payment:* ${paymentInfo.method.toUpperCase()}
💰 *Total Paid:* ₹${total}
------------------------------
Thank you! Please process my order.`;

      const whatsappUrl = `https://wa.me/${STORE_CONTACT.whatsappNumber}?text=${encodeURIComponent(waText)}`;
      
      // Open WhatsApp chat in a new tab for instant order direct communication
      window.open(whatsappUrl, '_blank');

      clearCart();
      setCurrentStep('success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="checkout-page bg-light-sand" style={{ minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        
        {/* Step Indicator Header (Hide on Success step to look cleaner) */}
        {currentStep !== 'success' && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', textDecoration: 'none', color: 'var(--text-muted)' }}>
                <ArrowLeft size={16} /> Return to Shopping Cart
              </Link>
            </div>
            
            <div className="dashboard-section-header" style={{ marginBottom: '24px' }}>
              <div>
                <span className="section-subtitle">Luxury Checkout Curation</span>
                <h2 className="luxury-section-title">Complete Your Gifting Order</h2>
                <div className="title-underline"></div>
              </div>
            </div>

            {/* Stepper progress representation */}
            <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 30px', borderRadius: 'var(--radius-md)', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep === 'shipping' ? 1 : 0.6 }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: currentStep === 'shipping' ? 'var(--primary-color)' : 'var(--border-color)', 
                  color: currentStep === 'shipping' ? '#fff' : 'var(--text-main)',
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }}>1</span>
                <span style={{ fontWeight: currentStep === 'shipping' ? 600 : 400, fontSize: '0.9rem' }}>Shipping Address</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep === 'method' ? 1 : 0.6 }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: currentStep === 'method' ? 'var(--primary-color)' : 'var(--border-color)', 
                  color: currentStep === 'method' ? '#fff' : 'var(--text-main)',
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }}>2</span>
                <span style={{ fontWeight: currentStep === 'method' ? 600 : 400, fontSize: '0.9rem' }}>Delivery Method</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep === 'payment' ? 1 : 0.6 }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: currentStep === 'payment' ? 'var(--primary-color)' : 'var(--border-color)', 
                  color: currentStep === 'payment' ? '#fff' : 'var(--text-main)',
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }}>3</span>
                <span style={{ fontWeight: currentStep === 'payment' ? 600 : 400, fontSize: '0.9rem' }}>Secure Payment</span>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentStep !== 'success' ? (
            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
              
              {/* Responsive settings for grids */}
              <style>{`
                @media (min-width: 992px) {
                  .checkout-grid {
                    grid-template-columns: 1fr 400px !important;
                  }
                }
                .form-group-checkout {
                  display: flex;
                  flex-direction: column;
                  gap: 6px;
                  margin-bottom: 18px;
                }
                .form-group-checkout label {
                  font-size: 0.82rem;
                  font-weight: 600;
                  color: var(--primary-color);
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }
                .checkout-input {
                  padding: 12px 14px;
                  border: 1px solid var(--border-color);
                  border-radius: var(--radius-sm);
                  background: white;
                  font-family: var(--font-body);
                  font-size: 0.95rem;
                  transition: border-color 0.2s;
                }
                .checkout-input:focus {
                  outline: none;
                  border-color: var(--secondary-color);
                }
                .input-error {
                  border-color: var(--accent-color) !important;
                }
                .error-text-checkout {
                  color: var(--accent-color);
                  font-size: 0.76rem;
                  margin-top: 2px;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  font-weight: 500;
                }
                .method-card-checkout {
                  padding: 20px;
                  border: 1px solid var(--border-color);
                  border-radius: var(--radius-md);
                  background: white;
                  cursor: pointer;
                  display: flex;
                  gap: 15px;
                  align-items: center;
                  transition: all 0.2s;
                }
                .method-card-checkout.active {
                  border-color: var(--secondary-color);
                  background-color: rgba(205, 168, 115, 0.05);
                }
                .method-card-checkout input[type="radio"] {
                  accent-color: var(--primary-color);
                  width: 18px;
                  height: 18px;
                }
                .theme-checkout-form {
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                }
              `}</style>

              {/* Main Steps Form Area */}
              <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-lg)' }}>
                
                {/* STEP 1: Shipping Address */}
                {currentStep === 'shipping' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={20} className="text-secondary" /> Shipping Details
                    </h3>
                    
                    <div className="theme-checkout-form">
                      <div className="form-group-checkout">
                        <label>Recipient Full Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. John Doe"
                          className={`checkout-input ${formErrors.fullName ? 'input-error' : ''}`}
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        />
                        {formErrors.fullName && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.fullName}</span>}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group-checkout">
                          <label>Email Address</label>
                          <input 
                            type="email" 
                            placeholder="john@email.com"
                            className={`checkout-input ${formErrors.email ? 'input-error' : ''}`}
                            value={shippingAddress.email}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                          />
                          {formErrors.email && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.email}</span>}
                        </div>
                        <div className="form-group-checkout">
                          <label>Contact Phone</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 9876543210"
                            className={`checkout-input ${formErrors.phone ? 'input-error' : ''}`}
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                          />
                          {formErrors.phone && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.phone}</span>}
                        </div>
                      </div>

                      <div className="form-group-checkout">
                        <label>Address details (Street, Flat/Apt, Landmark)</label>
                        <input 
                          type="text" 
                          placeholder="123 Main St, Apartment 4B"
                          className={`checkout-input ${formErrors.addressLine ? 'input-error' : ''}`}
                          value={shippingAddress.addressLine}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                        />
                        {formErrors.addressLine && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.addressLine}</span>}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                        <div className="form-group-checkout">
                          <label>City</label>
                          <input 
                            type="text" 
                            placeholder="Mumbai"
                            className={`checkout-input ${formErrors.city ? 'input-error' : ''}`}
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          />
                          {formErrors.city && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.city}</span>}
                        </div>
                        <div className="form-group-checkout">
                          <label>State</label>
                          <input 
                            type="text" 
                            placeholder="Maharashtra"
                            className={`checkout-input ${formErrors.state ? 'input-error' : ''}`}
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          />
                          {formErrors.state && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.state}</span>}
                        </div>
                        <div className="form-group-checkout">
                          <label>PIN Code</label>
                          <input 
                            type="text" 
                            placeholder="400001"
                            maxLength={6}
                            className={`checkout-input ${formErrors.postalCode ? 'input-error' : ''}`}
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          />
                          {formErrors.postalCode && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.postalCode}</span>}
                        </div>
                      </div>

                      <button 
                        onClick={() => { if (validateShipping()) setCurrentStep('method'); }}
                        className="btn btn-primary"
                        style={{ marginTop: '20px', width: '100%', display: 'flex', gap: '8px' }}
                      >
                        Continue to Shipping Method <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Shipping Method */}
                {currentStep === 'method' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={20} className="text-secondary" /> Gifting Delivery Method
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div 
                        className={`method-card-checkout ${shippingMethod === 'standard' ? 'active' : ''}`}
                        onClick={() => setShippingMethod('standard')}
                      >
                        <input 
                          type="radio" 
                          checked={shippingMethod === 'standard'} 
                          onChange={() => setShippingMethod('standard')} 
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', margin: 0, fontWeight: 600 }}>Standard Delivery</h4>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Delivered in 5-7 business days with standard protective padding box.
                          </p>
                        </div>
                        <strong style={{ color: 'var(--primary-color)' }}>FREE</strong>
                      </div>

                      <div 
                        className={`method-card-checkout ${shippingMethod === 'express' ? 'active' : ''}`}
                        onClick={() => setShippingMethod('express')}
                      >
                        <input 
                          type="radio" 
                          checked={shippingMethod === 'express'} 
                          onChange={() => setShippingMethod('express')} 
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', margin: 0, fontWeight: 600 }}>Express Courier (+50 XP Bonus)</h4>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Delivered in 2-3 business days in Jaipur Studio signature crate boxes.
                          </p>
                        </div>
                        <strong style={{ color: 'var(--secondary-color)' }}>₹50</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <button 
                          onClick={() => setCurrentStep('shipping')}
                          className="btn btn-secondary"
                          style={{ flex: 1 }}
                        >
                          Back
                        </button>
                        <button 
                          onClick={() => setCurrentStep('payment')}
                          className="btn btn-primary"
                          style={{ flex: 1, display: 'flex', gap: '8px' }}
                        >
                          Continue to Payment <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Secure Payment */}
                {currentStep === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={20} className="text-secondary" /> Secure Gifting Payment
                    </h3>

                    {/* Method Selector tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', gap: '10px' }}>
                      <button 
                        onClick={() => setPaymentInfo({ ...paymentInfo, method: 'card' })}
                        style={{ 
                          padding: '10px 15px', 
                          borderBottom: paymentInfo.method === 'card' ? '2px solid var(--primary-color)' : 'none',
                          fontWeight: paymentInfo.method === 'card' ? 600 : 400,
                          color: paymentInfo.method === 'card' ? 'var(--primary-color)' : 'var(--text-muted)'
                        }}
                      >
                        Credit/Debit Card
                      </button>
                      <button 
                        onClick={() => setPaymentInfo({ ...paymentInfo, method: 'upi' })}
                        style={{ 
                          padding: '10px 15px', 
                          borderBottom: paymentInfo.method === 'upi' ? '2px solid var(--primary-color)' : 'none',
                          fontWeight: paymentInfo.method === 'upi' ? 600 : 400,
                          color: paymentInfo.method === 'upi' ? 'var(--primary-color)' : 'var(--text-muted)'
                        }}
                      >
                        UPI Payment
                      </button>
                      <button 
                        onClick={() => setPaymentInfo({ ...paymentInfo, method: 'cod' })}
                        style={{ 
                          padding: '10px 15px', 
                          borderBottom: paymentInfo.method === 'cod' ? '2px solid var(--primary-color)' : 'none',
                          fontWeight: paymentInfo.method === 'cod' ? 600 : 400,
                          color: paymentInfo.method === 'cod' ? 'var(--primary-color)' : 'var(--text-muted)'
                        }}
                      >
                        Cash on Delivery
                      </button>
                    </div>

                    <div className="theme-checkout-form">
                      {paymentInfo.method === 'card' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="form-group-checkout">
                            <label>Card Number (16 digits)</label>
                            <input 
                              type="text" 
                              maxLength={19}
                              placeholder="4111 2222 3333 4444"
                              className={`checkout-input ${formErrors.cardNumber ? 'input-error' : ''}`}
                              value={paymentInfo.cardNumber}
                              onChange={(e) => {
                                // Add space format
                                const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                                setPaymentInfo({ ...paymentInfo, cardNumber: formatted.substring(0, 19) });
                              }}
                            />
                            {formErrors.cardNumber && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.cardNumber}</span>}
                          </div>

                          <div className="form-group-checkout">
                            <label>Cardholder Name</label>
                            <input 
                              type="text" 
                              placeholder="JOHN DOE"
                              style={{ textTransform: 'uppercase' }}
                              className={`checkout-input ${formErrors.cardName ? 'input-error' : ''}`}
                              value={paymentInfo.cardName}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                            />
                            {formErrors.cardName && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.cardName}</span>}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group-checkout">
                              <label>Expiry Date</label>
                              <input 
                                type="text" 
                                placeholder="MM/YY"
                                maxLength={5}
                                className={`checkout-input ${formErrors.expiry ? 'input-error' : ''}`}
                                value={paymentInfo.expiry}
                                onChange={(e) => {
                                  let v = e.target.value.replace(/[^0-9]/g, '');
                                  if (v.length > 2) {
                                    v = v.substring(0, 2) + '/' + v.substring(2, 4);
                                  }
                                  setPaymentInfo({ ...paymentInfo, expiry: v });
                                }}
                              />
                              {formErrors.expiry && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.expiry}</span>}
                            </div>
                            <div className="form-group-checkout">
                              <label>CVV (3 digits)</label>
                              <input 
                                type="password" 
                                placeholder="***"
                                maxLength={3}
                                className={`checkout-input ${formErrors.cvv ? 'input-error' : ''}`}
                                value={paymentInfo.cvv}
                                onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                              />
                              {formErrors.cvv && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.cvv}</span>}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {paymentInfo.method === 'upi' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="form-group-checkout">
                            <label>UPI Gifting Address / ID</label>
                            <input 
                              type="text" 
                              placeholder="username@upi"
                              className={`checkout-input ${formErrors.upiId ? 'input-error' : ''}`}
                              value={paymentInfo.upiId}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, upiId: e.target.value })}
                            />
                            {formErrors.upiId && <span className="error-text-checkout"><AlertCircle size={12} /> {formErrors.upiId}</span>}
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '10px 0 0 0' }}>
                            We support Razorpay BHIM UPI payments. A prompt will be sent to your UPI app during checkout completion.
                          </p>
                        </motion.div>
                      )}

                      {paymentInfo.method === 'cod' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '10px 0' }}>
                          <div style={{ display: 'flex', gap: '10px', backgroundColor: 'rgba(200, 169, 107, 0.08)', padding: '14px', borderRadius: '4px', border: '1px solid var(--secondary-color)' }}>
                            <Wallet className="text-secondary" style={{ flexShrink: 0 }} />
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                              <strong>Cash on Delivery (COD) Selected.</strong><br />
                              Pay in cash or swipe cards upon parcel receipt. Gifting Studio packing seal verifies invoice validity.
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button 
                          onClick={() => setCurrentStep('method')}
                          className="btn btn-secondary"
                          style={{ flex: 1 }}
                        >
                          Back
                        </button>
                        <button 
                          onClick={handleSubmitOrder}
                          className="btn btn-primary"
                          style={{ flex: 1, display: 'flex', gap: '8px' }}
                        >
                          Confirm & Pay ₹{total} <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Order Summary Right Panel */}
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShoppingBag size={18} className="text-secondary" /> Gifting Order Summary
                </h3>

                {/* Items preview list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '180px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', alignItems: 'center' }}>
                      <span className="text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                        {item.name} <strong style={{ color: 'var(--primary-color)' }}>x{item.quantity}</strong>
                      </span>
                      <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Form */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Gifting Coupon Code
                  </label>
                  {!appliedCoupon ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Voucher Code"
                        className="checkout-input"
                        style={{ padding: '8px 10px', fontSize: '0.85rem', flex: 1, textTransform: 'uppercase' }}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        className="btn btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(76,175,80,0.08)', border: '1px dashed #4caf50', padding: '8px 12px', borderRadius: '4px' }}>
                      <span style={{ fontSize: '0.82rem', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Tag size={12} /> {appliedCoupon.code} ({appliedCoupon.value} Saved)
                      </span>
                      <button 
                        onClick={handleRemoveCoupon}
                        style={{ color: 'var(--accent-color)', fontSize: '0.76rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {couponError && <span className="error-text-checkout" style={{ display: 'block', marginTop: '6px' }}><AlertCircle size={12} /> {couponError}</span>}
                  {couponSuccessMsg && <span style={{ color: '#2e7d32', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontWeight: 500 }}><Check size={12} /> {couponSuccessMsg}</span>}
                </div>

                {/* Pricing Deck */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Shipping fee</span>
                    <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                  </div>
                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32', fontWeight: 500 }}>
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1px dotted var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    <span>Total Cost</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '20px', backgroundColor: 'rgba(31,77,58,0.05)', padding: '10px 12px', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--primary-color)' }}>
                  <ShieldCheck size={14} style={{ flexShrink: 0 }} />
                  <span>256-Bit SSL Encrypted checkout curation.</span>
                </div>
              </div>

            </div>
          ) : (
            /* SUCCESS CONFIRMATION STEP */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ maxWidth: '750px', margin: '0 auto' }}
              className="print-success-wrapper"
            >
              <style>{`
                @media print {
                  body {
                    background-color: white !important;
                    color: black !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                  .print-success-wrapper {
                    box-shadow: none !important;
                    border: none !important;
                    background: transparent !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                  }
                  .success-banner-box {
                    border: 1px solid #000 !important;
                    padding: 20px !important;
                  }
                }
              `}</style>
              
              <div className="glass success-banner-box" style={{ padding: '40px 30px', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden' }}>
                
                {/* Filigree decorative details */}
                <div style={{ position: 'absolute', inset: '15px', border: '1px solid rgba(205, 168, 115, 0.25)', pointerEvents: 'none' }} />
                
                <div className="no-print">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(31, 77, 58, 0.1)', 
                    color: 'var(--primary-color)',
                    margin: '0 auto 16px auto',
                    boxShadow: 'inset 0 0 10px rgba(31,77,58,0.1)'
                  }}>
                    <CheckCircle2 size={36} className="text-secondary" />
                  </div>
                  
                  <span className="section-subtitle" style={{ letterSpacing: '3px' }}>Auspicious Curations</span>
                  <h2 className="luxury-section-title" style={{ fontSize: '2.1rem', marginBottom: '8px' }}>Order Confirmed Successfully</h2>
                  <div className="title-underline" style={{ margin: '8px auto 24px auto' }} />
                  
                  <div style={{ 
                    maxWidth: '480px', 
                    margin: '0 auto 30px auto', 
                    backgroundColor: 'rgba(205, 168, 115, 0.12)', 
                    border: '1px solid var(--secondary-color)', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '12px 18px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--primary-color)'
                  }}>
                    <Sparkles size={16} className="text-secondary" style={{ marginRight: '6px', display: 'inline' }} />
                    Thank you! <strong>{createdOrder.pointsAwarded} Gifting XP Points</strong> have been credited to your membership profile.
                  </div>
                </div>

                {/* Print Title Block */}
                <div style={{ display: 'none' }} className="print-title">
                  <h2>SAUGAAT eCOMMERCE RECEIPT</h2>
                  <p>Date: {new Date(createdOrder.created_at).toLocaleDateString()}</p>
                </div>

                {/* Receipt Grid details */}
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.9rem' }}>
                    <div>
                      <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Order References</span>
                      <strong>ID: #{createdOrder.id}</strong>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Date: {new Date(createdOrder.created_at).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Estimated Delivery</span>
                      <strong>{createdOrder.expectedDelivery}</strong>
                      <span style={{ display: 'block', color: 'var(--secondary-color)', fontSize: '0.8rem', fontWeight: 600, marginTop: '2px' }}>
                        Shipping Status: Processing ⏳
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', fontSize: '0.9rem', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                    <div>
                      <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Delivery Address</span>
                      <strong style={{ color: 'var(--primary-color)' }}>{createdOrder.address.fullName}</strong>
                      <div style={{ color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.5', fontSize: '0.85rem' }}>
                        {createdOrder.address.addressLine}, {createdOrder.address.city}, {createdOrder.address.state} - {createdOrder.address.postalCode}<br />
                        Phone: {createdOrder.address.phone} | Email: {createdOrder.address.email}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Secure Payment</span>
                      <strong style={{ textTransform: 'uppercase' }}>{createdOrder.payment.method} Selected</strong>
                      <div style={{ color: 'var(--text-muted)', marginTop: '2px', fontSize: '0.85rem' }}>
                        {createdOrder.payment.method === 'card' && `Card: **** **** **** ${createdOrder.payment.cardNumber?.substring(createdOrder.payment.cardNumber.length - 4)}`}
                        {createdOrder.payment.method === 'upi' && `UPI: ${createdOrder.payment.upiId}`}
                        {createdOrder.payment.method === 'cod' && `No immediate deduction.`}
                      </div>
                    </div>
                  </div>

                  {/* Items list detail block */}
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                    <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Products Curated</span>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '15px', borderRadius: '4px', border: '1px solid #f0f0f0' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 500 }}>{createdOrder.items}</span>
                    </div>
                  </div>

                  {/* Invoice Summary */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', width: '280px', alignSelf: 'flex-end' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>Subtotal</span>
                      <span>₹{createdOrder.subtotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>Shipping Fee</span>
                      <span>{createdOrder.shippingFee === 0 ? 'FREE' : `₹${createdOrder.shippingFee}`}</span>
                    </div>
                    {createdOrder.discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32', fontWeight: 500 }}>
                        <span>Applied Discount</span>
                        <span>-₹{createdOrder.discount}</span>
                      </div>
                    )}
                    <div style={{ borderTop: '1px dotted var(--border-color)', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      <span>Total Paid</span>
                      <span>₹{createdOrder.total}</span>
                    </div>
                  </div>

                </div>

                {/* Action panel */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '35px', justifyContent: 'center', flexWrap: 'wrap' }} className="no-print">
                  <a 
                    href={`https://wa.me/${STORE_CONTACT.whatsappNumber}?text=${encodeURIComponent(`Hi Saugaat Support, I have a question regarding Order #${createdOrder.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ backgroundColor: '#25D366', color: 'white', display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <MessageSquare size={16} /> Direct WhatsApp Chat
                  </a>

                  <a 
                    href={`mailto:${STORE_CONTACT.email}?subject=Inquiry regarding Order #${createdOrder.id}`}
                    className="btn btn-secondary"
                    style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <Mail size={16} /> Email Support ({STORE_CONTACT.email})
                  </a>

                  <button 
                    onClick={handlePrint}
                    className="btn btn-secondary"
                    style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <Printer size={16} /> Print Receipt
                  </button>

                  <Link 
                    to="/my-orders" 
                    className="btn btn-primary"
                    style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    Real-Time Tracking <ArrowRight size={16} />
                  </Link>
                </div>
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
