import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { 
  RefreshCw, 
  Truck, 
  MapPin, 
  FileText, 
  PenTool, 
  CheckCircle2, 
  Printer, 
  Mail, 
  MessageSquare,
  X,
  ChevronRight,
  Clock,
  Send
} from 'lucide-react';
import { getMockOrders, updateOrderStatus, type Order } from '../../lib/database';
import '../Admin.css';

export const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Custom toast notifications
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);
  
  // Custom internal note state
  const [internalNote, setInternalNote] = useState('');
  const [internalNotesList, setInternalNotesList] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('saugaat_admin_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const fetchOrders = () => {
    setLoading(true);
    const mock = getMockOrders();
    setOrders(mock);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    window.addEventListener('storage', fetchOrders);
    return () => window.removeEventListener('storage', fetchOrders);
  }, []);

  useEffect(() => {
    localStorage.setItem('saugaat_admin_notes', JSON.stringify(internalNotesList));
  }, [internalNotesList]);

  const showToast = (msg: string) => {
    setAdminSuccessMsg(msg);
    setTimeout(() => setAdminSuccessMsg(null), 4000);
  };

  const handleUpdateStatus = async (orderId: string, nextStatus: Order['status']) => {
    let logDesc = '';
    if (nextStatus === 'pending') {
      logDesc = 'Order successfully placed. Gifting curator is reviewing.';
    } else if (nextStatus === 'processing') {
      logDesc = 'Hamper box curated and customized branding verified in Gifting Studio.';
    } else if (nextStatus === 'shipped') {
      logDesc = 'Dispatched from Jaipur Gifting Studio and handed over to express delivery partner.';
    } else if (nextStatus === 'delivered') {
      logDesc = 'Handed over to customer. Verification code verified.';
    }

    const updated = await updateOrderStatus(orderId, nextStatus, logDesc);
    if (updated) {
      fetchOrders();
      showToast(`⚡ Order #${orderId} status advanced to ${nextStatus.toUpperCase()}!`);
    }
  };

  const handleAddInternalNote = (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    if (!internalNote.trim()) return;

    setInternalNotesList(prev => {
      const current = prev[orderId] || [];
      return {
        ...prev,
        [orderId]: [...current, internalNote]
      };
    });
    setInternalNote('');
    showToast('📝 Internal administrator note recorded.');
  };

  const handleSendNotification = (type: 'email' | 'sms', orderId: string) => {
    showToast(`🔔 Dispatching order tracking updates for #${orderId} via ${type.toUpperCase()} services to customer. Alert queued successfully.`);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || order.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const selectedOrderNotes = selectedOrder ? internalNotesList[selectedOrder.id] || [] : [];

  return (
    <AdminLayout title="Fulfillment Control Panel">
      
      {/* Toast Alert */}
      {adminSuccessMsg && (
        <div style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          zIndex: 1100,
          background: 'rgba(31, 77, 58, 0.95)',
          border: '1.5px solid var(--secondary-color)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.9rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backdropFilter: 'blur(8px)'
        }}>
          <CheckCircle2 size={20} style={{ color: 'var(--secondary-color)' }} />
          <span>{adminSuccessMsg}</span>
        </div>
      )}

      {/* Admin Orders Layout splits on desktop to show Details Drawer */}
      <div className="orders-mgmt-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <style>{`
          @media (min-width: 1200px) {
            .orders-mgmt-split-grid {
              grid-template-columns: ${selectedOrderId ? '1.1fr 0.9fr' : '1fr'} !important;
            }
          }
          .status-tab-bar {
            display: flex;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 20px;
            gap: 12px;
            overflow-x: auto;
          }
          .status-tab-btn {
            padding: 10px 16px;
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--text-muted);
            border-bottom: 2px solid transparent;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }
          .status-tab-btn:hover {
            color: var(--primary-color);
          }
          .status-tab-btn.active {
            color: var(--primary-color);
            border-color: var(--secondary-color);
            font-weight: bold;
          }
          .orders-mgmt-drawer {
            background: white;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            padding: 24px;
            height: fit-content;
            box-shadow: var(--shadow-md);
            animation: slideInLeft 0.3s ease;
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .note-item-bubble {
            background: var(--bg-main);
            padding: 10px 14px;
            border-radius: var(--radius-sm);
            border-left: 3px solid var(--secondary-color);
            font-size: 0.82rem;
            color: var(--text-main);
          }
          .order-status-actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
            gap: 8px;
            margin-top: 10px;
          }
          .status-update-action-btn {
            padding: 8px 12px;
            font-size: 0.78rem;
            font-weight: 600;
            text-transform: uppercase;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
            background: white;
            cursor: pointer;
            transition: all var(--transition-fast);
            text-align: center;
          }
          .status-update-action-btn.pending-action:hover { background-color: #fffde7; border-color: #f57f17; color: #f57f17; }
          .status-update-action-btn.processing-action:hover { background-color: #e8f5e9; border-color: #2e7d32; color: #2e7d32; }
          .status-update-action-btn.shipped-action:hover { background-color: #e3f2fd; border-color: #1565c0; color: #1565c0; }
          .status-update-action-btn.delivered-action:hover { background-color: #f3e5f5; border-color: #7b1fa2; color: #7b1fa2; }
          
          .status-badge-inline {
            font-size: 0.72rem;
            font-weight: bold;
            text-transform: uppercase;
            padding: 2px 8px;
            border-radius: 4px;
          }
          .status-badge-inline.pending { background: #fff8e1; color: #f57f17; }
          .status-badge-inline.processing { background: #e8f5e9; color: #2e7d32; }
          .status-badge-inline.shipped { background: #e3f2fd; color: #1565c0; }
          .status-badge-inline.delivered { background: #f3e5f5; color: #7b1fa2; }
        `}</style>

        {/* List of Orders Panel */}
        <div className="admin-table-container">
          <div className="admin-table-header">
            <h2 className="admin-table-title">Customer Gifting Transactions</h2>
            <div className="admin-table-actions">
              <button 
                onClick={fetchOrders} 
                className="btn-icon" 
                title="Reload Transactions"
                disabled={loading}
              >
                <RefreshCw size={18} className={loading ? 'spin-anim' : ''} />
              </button>
              <input
                type="text"
                placeholder="Search orders, clients, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Status filter bar */}
          <div className="status-tab-bar" style={{ padding: '0 24px' }}>
            <button className={`status-tab-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All Orders</button>
            <button className={`status-tab-btn ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>Placed</button>
            <button className={`status-tab-btn ${statusFilter === 'processing' ? 'active' : ''}`} onClick={() => setStatusFilter('processing')}>In Curation</button>
            <button className={`status-tab-btn ${statusFilter === 'shipped' ? 'active' : ''}`} onClick={() => setStatusFilter('shipped')}>In Transit</button>
            <button className={`status-tab-btn ${statusFilter === 'delivered' ? 'active' : ''}`} onClick={() => setStatusFilter('delivered')}>Delivered</button>
          </div>

          {filteredOrders.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Profile</th>
                  <th>Purchased Items</th>
                  <th>Total Price</th>
                  <th>Fulfillment Status</th>
                  <th>Expected Est.</th>
                  <th>Greeting Card</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedOrderId === order.id ? 'rgba(205, 168, 115, 0.05)' : 'transparent' 
                    }}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <td>
                      <strong style={{ color: 'var(--primary-color)' }}>#{order.id}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{order.customerEmail}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.items}
                    </td>
                    <td><strong>₹{order.total}</strong></td>
                    <td>
                      <span className={`status-badge-inline ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{order.expectedDelivery}</td>
                    <td style={{ textAlign: 'center' }}>
                      {order.card ? (
                        <span title="Calligraphy Card Attached" style={{ display: 'inline-block' }}>
                          <PenTool size={16} className="text-secondary" />
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: 'var(--secondary-color)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                        Review <ChevronRight size={14} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>No orders found matching the filter criteria.</p>
            </div>
          )}
        </div>

        {/* Selected Order Detail Drawer */}
        {selectedOrder && (
          <div className="orders-mgmt-drawer">
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={18} className="text-secondary" />
                  Fulfillment Detail: #{selectedOrder.id}
                </h3>
                <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                  Created on {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrderId(null)}
                style={{ cursor: 'pointer', padding: '4px', color: 'var(--text-muted)' }}
                title="Close Panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Order Status Advancement Control */}
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '10px' }}>
                  ⚙️ Advance Shipment Workflow
                </h4>
                <div className="order-status-actions-grid">
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                    className={`status-update-action-btn pending-action ${selectedOrder.status === 'pending' ? 'active' : ''}`}
                    style={{ borderLeft: selectedOrder.status === 'pending' ? '3px solid #f57f17' : '1px solid var(--border-color)' }}
                  >
                    Placed
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                    className={`status-update-action-btn processing-action ${selectedOrder.status === 'processing' ? 'active' : ''}`}
                    style={{ borderLeft: selectedOrder.status === 'processing' ? '3px solid #2e7d32' : '1px solid var(--border-color)' }}
                  >
                    In Curation
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                    className={`status-update-action-btn shipped-action ${selectedOrder.status === 'shipped' ? 'active' : ''}`}
                    style={{ borderLeft: selectedOrder.status === 'shipped' ? '3px solid #1565c0' : '1px solid var(--border-color)' }}
                  >
                    Dispatched
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                    className={`status-update-action-btn delivered-action ${selectedOrder.status === 'delivered' ? 'active' : ''}`}
                    style={{ borderLeft: selectedOrder.status === 'delivered' ? '3px solid #7b1fa2' : '1px solid var(--border-color)' }}
                  >
                    Delivered
                  </button>
                </div>
              </div>

              {/* Shipping address & items details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: '4px' }}>
                  <span className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> Client Delivery Address
                  </span>
                  <p style={{ fontSize: '0.82rem', marginTop: '6px', lineHeight: '1.4', margin: '6px 0 0 0' }}>
                    <strong>{selectedOrder.customerName}</strong><br />
                    123 Luxury Lane, Malviya Nagar<br />
                    Jaipur, Rajasthan - 302017<br />
                    India
                  </p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: '4px' }}>
                  <span className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }}>
                    <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} /> Purchase Details
                  </span>
                  <p style={{ fontSize: '0.82rem', marginTop: '6px', margin: '6px 0 0 0', fontWeight: 500 }}>
                    {selectedOrder.items}
                  </p>
                  <div style={{ borderTop: '1px dotted #ccc', marginTop: '8px', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>Amount Paid:</span>
                    <strong>₹{selectedOrder.total}</strong>
                  </div>
                </div>
              </div>

              {/* Calligraphy Greeting Card Attachment */}
              {selectedOrder.card && (
                <div style={{ border: '1.5px solid var(--secondary-color)', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#fdfbf7', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '6px', border: '1px solid rgba(205,168,115,0.35)', pointerEvents: 'none' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.5px', marginBottom: '12px' }}>
                    <PenTool size={14} className="text-secondary" /> Handwritten Calligraphy Greeting Card Attachment
                  </span>
                  <p 
                    style={{ 
                      color: selectedOrder.card.ink === 'gold' ? '#D4AF37' : selectedOrder.card.ink === 'crimson' ? '#C96A4A' : '#D9146D',
                      fontFamily: selectedOrder.card.font === 'royal' ? 'Georgia, serif' : selectedOrder.card.font === 'vedic' ? '"Playfair Display", serif' : '"Outfit", sans-serif',
                      fontStyle: selectedOrder.card.font === 'royal' ? 'italic' : 'normal',
                      fontWeight: selectedOrder.card.font === 'minimal' ? 'normal' : 'bold',
                      fontSize: '1.1rem',
                      lineHeight: '1.6',
                      textAlign: 'center',
                      margin: '15px 0'
                    }}
                  >
                    "{selectedOrder.card.message}"
                  </p>
                  
                  {/* Wax Seal Mock */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#C96A4A',
                    borderRadius: '50%',
                    margin: '0 auto',
                    boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.4), 2px 2px 4px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.62rem',
                    fontFamily: 'Georgia, serif',
                    fontWeight: 'bold',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    S
                  </div>
                </div>
              )}

              {/* Progress Milestones Logs */}
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} className="text-secondary" /> Shipment Milestones History
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
                  {selectedOrder.logs.slice().reverse().map((log, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: index === 0 ? 'var(--secondary-color)' : '#ccc', zIndex: 2 }} />
                        {index !== selectedOrder.logs.length - 1 && (
                          <div style={{ width: '2px', flex: 1, backgroundColor: '#eaeaea', marginTop: '2px', marginBottom: '-10px' }} />
                        )}
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: index === 0 ? 600 : 400 }}>
                          {log.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispatch notification alerts & Invoice */}
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '10px' }}>
                  📢 Notifications & Print Actions
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleSendNotification('email', selectedOrder.id)}
                    className="action-btn"
                    style={{ flex: 1, minWidth: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 14px' }}
                  >
                    <Mail size={14} /> Send Email Alert
                  </button>
                  <button 
                    onClick={() => handleSendNotification('sms', selectedOrder.id)}
                    className="action-btn"
                    style={{ flex: 1, minWidth: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 14px' }}
                  >
                    <MessageSquare size={14} /> Send SMS Alert
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="action-btn"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 14px' }}
                    title="Print Tax Invoice"
                  >
                    <Printer size={14} /> Print Invoice
                  </button>
                </div>
              </div>

              {/* Internal Notes */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '12px' }}>
                  📝 Internal Administrator Notes
                </h4>
                
                {/* Notes List */}
                {selectedOrderNotes.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {selectedOrderNotes.map((note, idx) => (
                      <div key={idx} className="note-item-bubble">
                        {note}
                      </div>
                    ))}
                  </div>
                )}
                
                <form onSubmit={(e) => handleAddInternalNote(e, selectedOrder.id)} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text"
                    required
                    placeholder="Add internal shipping notes..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="campaign-input"
                    style={{ flex: 1, padding: '8px 10px', fontSize: '0.82rem' }}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.8rem', textTransform: 'none', display: 'flex', gap: '4px' }}
                  >
                    <Send size={12} /> Add Note
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
