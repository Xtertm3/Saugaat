import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCustomerOrders } from '../lib/database';
import type { Order } from '../lib/database';
import { 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  ChevronRight,
  ShoppingBag,
  MapPin,
  FileText,
  PenTool,
  Printer,
  X,
  Sparkles
} from 'lucide-react';
import './Home.css';

export const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const fetchOrders = async () => {
    if (user?.email) {
      const customerOrders = await getCustomerOrders(user.email);
      setOrders(customerOrders);
      if (customerOrders.length > 0 && !selectedOrderId) {
        const active = customerOrders.find(o => o.status !== 'delivered');
        setSelectedOrderId(active ? active.id : customerOrders[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const handleStorageChange = () => {
      fetchOrders();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'processing': return 'In Curation';
      case 'shipped': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="my-orders-wrapper bg-light-sand" style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/dashboard" className="link-arrow" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '24px', gap: '6px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="dashboard-section-header" style={{ marginBottom: '32px' }}>
          <div>
            <span className="section-subtitle">Track Purchases</span>
            <h2 className="luxury-section-title">My Orders & Tracking</h2>
            <div className="title-underline"></div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="typing-indicator" style={{ display: 'inline-flex' }}>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Fetching your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass text-center" style={{ padding: '60px 40px', borderRadius: 'var(--radius-lg)' }}>
            <ShoppingBag size={48} className="text-secondary" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>No Orders Yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '8px auto 24px auto' }}>
              You haven't placed any orders with us yet. Build a custom hamper box or check our trending collection!
            </p>
            <Link to="/category/all" className="btn btn-primary">Start Gifting</Link>
          </div>
        ) : (
          <div className="orders-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            {/* Split Grid styling overrides for wider viewports */}
            <style>{`
              @media (min-width: 992px) {
                .orders-split-grid {
                  grid-template-columns: 350px 1fr !important;
                }
              }
              @media (min-width: 768px) {
                .summary-logs-split {
                  grid-template-columns: 1.2fr 1fr !important;
                }
              }
              .order-sidebar-card {
                cursor: pointer;
                transition: all 0.2s ease;
              }
              .order-sidebar-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-sm);
              }
              .order-sidebar-card.active-card {
                background-color: rgba(205, 168, 115, 0.08) !important;
                border-color: var(--secondary-color) !important;
              }
              @media print {
                body * {
                  visibility: hidden;
                }
                .printable-invoice-area, .printable-invoice-area * {
                  visibility: visible;
                }
                .printable-invoice-area {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}</style>

            {/* Orders list sidebar */}
            <div className="orders-sidebar-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '4px' }}>
                Order History ({orders.length})
              </h3>
              {orders.map(order => {
                const isActive = order.id === selectedOrderId;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`glass order-sidebar-card ${isActive ? 'active-card' : ''}`}
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      border: isActive ? '1px solid var(--secondary-color)' : '1px solid var(--border-color)',
                      backgroundColor: isActive ? 'rgba(205, 168, 115, 0.05)' : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>#{order.id}</span>
                      <span className={`status-pill ${order.status}`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
                      {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.items}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>₹{order.total}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        Track <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected order tracking detail view */}
            <div className="order-tracking-details-view">
              {selectedOrder ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Tracking Timeline Card */}
                  <div className="tracker-panel glass" style={{ width: '100%', padding: '30px', borderRadius: 'var(--radius-lg)' }}>
                    <div className="panel-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <h3 className="panel-title" style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Truck size={20} className="text-secondary" />
                          Tracking Order: #{selectedOrder.id}
                        </h3>
                        <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: '4px', marginBottom: 0 }}>
                          Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                          onClick={() => setShowInvoiceModal(true)}
                          className="btn btn-secondary" 
                          style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Printer size={14} /> Tax Invoice
                        </button>
                        <div style={{ textAlign: 'right' }}>
                          <span className="delivery-est" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>Est. Delivery: {selectedOrder.expectedDelivery}</span>
                          <span className={`status-pill ${selectedOrder.status}`} style={{ display: 'inline-block', marginTop: '4px' }}>
                            {getStatusLabel(selectedOrder.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline visualization */}
                    {(() => {
                      const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
                      const currentIndex = statusOrder.indexOf(selectedOrder.status);
                      const percent = currentIndex === 0 ? 0 : currentIndex === 1 ? 33 : currentIndex === 2 ? 66 : 100;

                      const getLogTime = (s: string) => {
                        const log = selectedOrder.logs.find(l => l.status === s);
                        if (!log) return s === 'delivered' ? 'Pending' : s === 'shipped' ? 'On the Way' : '';
                        return new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      };

                      return (
                        <div className="timeline-container" style={{ margin: '35px 0' }}>
                          <div className="timeline-line">
                            <div className="timeline-line-fill" style={{ width: `${percent}%` }}></div>
                          </div>
                          
                          <div className={`timeline-step ${currentIndex >= 0 ? (currentIndex === 0 ? 'active' : 'completed') : 'pending'}`}>
                            <div className="step-dot">
                              {currentIndex > 0 ? <CheckCircle2 size={16} /> : currentIndex === 0 ? <div className="pulse-ring"></div> : null}
                            </div>
                            <span className="step-label">Ordered</span>
                            <span className="step-time">{getLogTime('pending')}</span>
                          </div>

                          <div className={`timeline-step ${currentIndex >= 1 ? (currentIndex === 1 ? 'active' : 'completed') : 'pending'}`}>
                            <div className="step-dot">
                              {currentIndex > 1 ? <CheckCircle2 size={16} /> : currentIndex === 1 ? <div className="pulse-ring"></div> : null}
                            </div>
                            <span className="step-label">Processing</span>
                            <span className="step-time">{getLogTime('processing')}</span>
                          </div>

                          <div className={`timeline-step ${currentIndex >= 2 ? (currentIndex === 2 ? 'active' : 'completed') : 'pending'}`}>
                            <div className="step-dot">
                              {currentIndex > 2 ? <CheckCircle2 size={16} /> : currentIndex === 2 ? <div className="pulse-ring"></div> : null}
                            </div>
                            <span className="step-label">In Transit</span>
                            <span className="step-time">{getLogTime('shipped')}</span>
                          </div>

                          <div className={`timeline-step ${currentIndex >= 3 ? (currentIndex === 3 ? 'active' : 'completed') : 'pending'}`}>
                            <div className="step-dot">
                              {currentIndex === 3 ? <CheckCircle2 size={16} /> : null}
                            </div>
                            <span className="step-label">Delivered</span>
                            <span className="step-time">{getLogTime('delivered')}</span>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="tracker-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '24px' }}>
                      <span className="status-note" style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        <strong>Latest Update:</strong> {selectedOrder.logs[selectedOrder.logs.length - 1]?.description || 'Order placed successfully.'}
                      </span>
                    </div>
                  </div>

                  {/* Shipment Logs and Summary Split */}
                  <div className="summary-logs-split" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                    {/* Log Milestones */}
                    <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} className="text-secondary" /> Shipment Milestones
                      </h3>
                      <div className="milestones-log-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {selectedOrder.logs.slice().reverse().map((log, index) => (
                          <div key={index} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ 
                                width: '10px', 
                                height: '10px', 
                                borderRadius: '50%', 
                                backgroundColor: index === 0 ? 'var(--secondary-color)' : '#ccc',
                                border: index === 0 ? '2px solid var(--primary-color)' : 'none',
                                zIndex: 2
                              }}></div>
                              {index !== selectedOrder.logs.length - 1 && (
                                <div style={{ width: '2px', flex: 1, backgroundColor: '#eaeaea', marginTop: '4px', marginBottom: '-12px' }}></div>
                              )}
                            </div>
                            <div style={{ paddingBottom: '4px' }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                {new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '2px', fontWeight: index === 0 ? 600 : 400 }}>
                                {log.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary details */}
                    <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={18} className="text-secondary" /> Order Summary
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <span className="text-muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Items Purchased</span>
                          <span style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--primary-color)' }}>{selectedOrder.items}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}>
                          <MapPin size={16} className="text-muted" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <span className="text-muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Delivery Address</span>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              {user?.email ? user.email.split('@')[0].toUpperCase() : 'Valued Customer'}<br />
                              123 Heritage Lane, Bandra West, Mumbai, MH - 400050
                            </span>
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px', color: 'var(--text-muted)' }}>
                            <span>Subtotal</span>
                            <span>₹{selectedOrder.total}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px', color: 'var(--text-muted)' }}>
                            <span>Shipping</span>
                            <span className="text-secondary" style={{ fontWeight: 600 }}>FREE</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', color: 'var(--primary-color)', marginTop: '8px', paddingTop: '8px', borderTop: '1px dotted var(--border-color)' }}>
                            <span>Total Paid</span>
                            <span>₹{selectedOrder.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calligraphy Card Attached Section */}
                  {selectedOrder.card && (
                    <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-lg)' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PenTool size={18} className="text-secondary" /> Attached Calligraphy Greeting Card
                      </h3>
                      
                      <div className="greetings-card-preview-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <div className="greetings-card-mockup" style={{ 
                          width: '100%', 
                          maxWidth: '550px',
                          border: '2px solid var(--secondary-color)', 
                          padding: '35px 25px', 
                          borderRadius: '8px', 
                          backgroundColor: '#fdfbf7', 
                          boxShadow: 'var(--shadow-sm)',
                          textAlign: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            position: 'absolute',
                            inset: '10px',
                            border: '1px solid rgba(205, 168, 115, 0.3)',
                            pointerEvents: 'none'
                          }} />
                          
                          <div style={{
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: '0.72rem',
                            letterSpacing: '2px',
                            color: 'var(--text-muted)',
                            marginBottom: '20px',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            Saugaat Luxury Gifting Studio
                          </div>

                          <div 
                            style={{
                              color: selectedOrder.card.ink === 'gold' ? '#D4AF37' : selectedOrder.card.ink === 'crimson' ? '#C96A4A' : '#D9146D',
                              fontFamily: selectedOrder.card.font === 'royal' ? 'Georgia, serif' : selectedOrder.card.font === 'vedic' ? '"Playfair Display", serif' : '"Outfit", sans-serif',
                              fontStyle: selectedOrder.card.font === 'royal' ? 'italic' : 'normal',
                              fontSize: '1.2rem',
                              lineHeight: '1.7',
                              fontWeight: selectedOrder.card.font === 'minimal' ? '400' : 'bold',
                              margin: '20px 0 30px 0',
                              padding: '0 20px',
                              minHeight: '80px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            "{selectedOrder.card.message}"
                          </div>

                          <div style={{
                            width: '45px',
                            height: '45px',
                            backgroundColor: '#C96A4A',
                            borderRadius: '50%',
                            margin: '0 auto',
                            boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.4), 2px 2px 4px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            zIndex: 3
                          }}>
                            <div style={{
                              border: '1px dashed rgba(255,255,255,0.4)',
                              width: '33px',
                              height: '33px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontFamily: 'Georgia, serif',
                              fontWeight: 'bold'
                            }}>
                              S
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Tax Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="printable-invoice-area" style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '40px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            color: '#1a1a1a'
          }}>
            {/* Modal Controls */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={18} style={{ color: 'var(--secondary-color)' }} /> Official Tax Invoice
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handlePrintInvoice} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Printer size={14} style={{ marginRight: '6px' }} /> Print / Save PDF
                </button>
                <button onClick={() => setShowInvoiceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div style={{ border: '2px solid var(--primary-color)', padding: '30px', backgroundColor: 'var(--bg-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '20px', marginBottom: '25px' }}>
                <div>
                  <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--primary-color)', fontSize: '1.8rem', margin: 0 }}>SAUGAAT</h1>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#555' }}>Curated Luxury & Home Decor</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '1.2rem', color: 'var(--secondary-color)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>TAX INVOICE</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#555' }}><strong>Invoice #:</strong> INV-{selectedOrder.id}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#555' }}><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                <div>
                  <strong style={{ color: 'var(--primary-color)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Billed & Shipped To:</strong>
                  <p style={{ margin: '6px 0 0 0', fontWeight: 600 }}>{user?.email ? user.email.split('@')[0].toUpperCase() : 'Valued Customer'}</p>
                  <p style={{ margin: '2px 0 0 0', color: '#555' }}>Email: {user?.email || 'customer@saugaat.com'}</p>
                  <p style={{ margin: '2px 0 0 0', color: '#555' }}>Address: Premium Residential Curation</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--primary-color)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Payment Info:</strong>
                  <p style={{ margin: '6px 0 0 0', color: '#555' }}><strong>Method:</strong> {selectedOrder.card ? 'Saugaat Calligraphy Card Included' : 'Standard Payment'}</p>
                  <p style={{ margin: '2px 0 0 0', color: '#555' }}><strong>Status:</strong> <span style={{ color: '#2e7d32', fontWeight: 600 }}>PAID</span></p>
                  <p style={{ margin: '2px 0 0 0', color: '#555' }}><strong>Tracking ID:</strong> {selectedOrder.id}</p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--primary-color)', color: 'white', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Item Description</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
                    <td style={{ padding: '12px' }}>{selectedOrder.items}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>1</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>₹{selectedOrder.total}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>₹{selectedOrder.total}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid var(--secondary-color)', paddingTop: '15px' }}>
                <div style={{ width: '250px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <span>Shipping Fee:</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-color)', borderTop: '1px solid #ccc', paddingTop: '8px', marginTop: '6px' }}>
                    <span>Grand Total:</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Stamp */}
            <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px dashed #ccc', paddingTop: '16px', fontSize: '0.75rem', color: '#777' }}>
              Thank you for choosing Saugaat Luxury Gifting Studio. This is a computer-generated tax invoice.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
