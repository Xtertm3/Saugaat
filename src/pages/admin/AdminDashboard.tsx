import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  FolderOpen, 
  AlertCircle, 
  DollarSign, 
  Plus,
  Megaphone,
  Sparkles,
  Check
} from 'lucide-react';
import '../Admin.css';

interface DashboardStats {
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  activeListings: number;
  pendingReview: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'paid' | 'shipped' | 'pending' | 'cancelled';
  items: string;
  total: number;
}

interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  category: string;
}

export const AdminDashboard: React.FC = () => {
  const [stats] = useState<DashboardStats>({
    totalRevenue: 148250,
    totalProducts: 24,
    totalCategories: 7,
    activeListings: 22,
    pendingReview: 2,
  });

  const [orders] = useState<Order[]>([
    { id: 'SG-2026-081', customer: 'Rahul Sharma', date: 'June 01, 2026', status: 'paid', items: 'Brass Urli + Pooja Thali', total: 2198 },
    { id: 'SG-2026-080', customer: 'Priya Patel', date: 'June 01, 2026', status: 'shipped', items: 'Ceramic Vases Trio', total: 1899 },
    { id: 'SG-2026-079', customer: 'Amit Verma', date: 'May 31, 2026', status: 'paid', items: 'Marble Ganesha Idol', total: 1499 },
    { id: 'SG-2026-078', customer: 'Sneha Reddy', date: 'May 30, 2026', status: 'pending', items: 'Assorted Potlis Gift Pack', total: 999 },
    { id: 'SG-2026-077', customer: 'Vikram Singh', date: 'May 29, 2026', status: 'cancelled', items: 'Wooden Educational Toy Set', total: 599 },
  ]);

  const [lowStock] = useState<LowStockItem[]>([
    { id: 'p4', name: 'Ceramic Vases Trio', stock: 2, category: 'Home Decor' },
    { id: 'p3', name: 'Diwali Festive Pooja Thali', stock: 1, category: 'Festivals' },
    { id: 'p7', name: 'Surprise Coffee Mug Set', stock: 0, category: 'Gift Packs' },
  ]);

  const [activeChartPoint, setActiveChartPoint] = useState<{ x: number, y: number, value: string, day: string } | null>(null);

  // Campaign & Voucher Creator State
  const [campaignName, setCampaignName] = useState('Diwali Curation Gold');
  const [promoCode, setPromoCode] = useState('GOLDEN30');
  const [discountVal, setDiscountVal] = useState(30);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [targetTier, setTargetTier] = useState('Gold Tier Members');
  const [bannerTheme, setBannerTheme] = useState<'navy' | 'crimson' | 'gold'>('navy');
  const [campaignSuccess, setCampaignSuccess] = useState<string | null>(null);

  const [campaignsList, setCampaignsList] = useState([
    { id: 1, name: "Spontaneous Gifting Special", code: "JUSTFORYOU", value: "₹250 Off", target: "All Customers" },
    { id: 2, name: "Curator Wedding Collection", code: "WEDDING15", value: "15% Off", target: "Gold Members" }
  ]);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || !promoCode.trim()) return;

    const valueStr = discountType === 'percent' ? `${discountVal}% Off` : `₹${discountVal} Off`;
    
    setCampaignsList(prev => [
      ...prev,
      {
        id: Date.now(),
        name: campaignName,
        code: promoCode.toUpperCase().replace(/\s+/g, ''),
        value: valueStr,
        target: targetTier
      }
    ]);

    setCampaignSuccess(`✨ Campaign "${campaignName}" launched! Promo code ${promoCode.toUpperCase()} is active for ${targetTier}.`);
    setTimeout(() => setCampaignSuccess(null), 5000);
  };

  // Sales data for chart: Day, Value
  const chartData = [
    { day: 'Mon', val: 12000, x: 50, y: 150 },
    { day: 'Tue', val: 19000, x: 130, y: 110 },
    { day: 'Wed', val: 15000, x: 210, y: 130 },
    { day: 'Thu', val: 28000, x: 290, y: 60 },
    { day: 'Fri', val: 22000, x: 370, y: 90 },
    { day: 'Sat', val: 34000, x: 450, y: 30 },
    { day: 'Sun', val: 38000, x: 530, y: 10 },
  ];

  return (
    <AdminLayout title="Analytics Command Center">
      {/* Stats KPI Grid */}
      <div className="dashboard-grid">
        <div className="kpi-card premium-kpi shadow-glass">
          <div className="kpi-icon-wrapper revenue-icon">
            <DollarSign size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Weekly Sales</span>
            <div className="kpi-value">₹{(stats.totalRevenue).toLocaleString('en-IN')}</div>
            <div className="kpi-trend positive">
              <TrendingUp size={14} />
              <span>+14.2% from last week</span>
            </div>
          </div>
          {/* Sparkline */}
          <div className="kpi-sparkline">
            <svg viewBox="0 0 100 30" width="100%" height="30">
              <path 
                d="M 5,25 Q 20,15 35,20 T 65,10 T 95,5" 
                fill="none" 
                stroke="var(--secondary-color)" 
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="kpi-card premium-kpi shadow-glass">
          <div className="kpi-icon-wrapper products-icon">
            <Package size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Products</span>
            <div className="kpi-value">{stats.totalProducts}</div>
            <div className="kpi-trend positive">
              <TrendingUp size={14} />
              <span>+4 new additions</span>
            </div>
          </div>
          <div className="kpi-sparkline">
            <svg viewBox="0 0 100 30" width="100%" height="30">
              <path 
                d="M 5,28 Q 25,25 45,15 T 75,18 T 95,10" 
                fill="none" 
                stroke="#4caf50" 
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="kpi-card premium-kpi shadow-glass">
          <div className="kpi-icon-wrapper categories-icon">
            <FolderOpen size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Active Listings</span>
            <div className="kpi-value">{stats.activeListings}</div>
            <div className="kpi-trend positive">
              <span>92% Online Rate</span>
            </div>
          </div>
          <div className="kpi-sparkline">
            <svg viewBox="0 0 100 30" width="100%" height="30">
              <path 
                d="M 5,10 Q 35,10 55,10 T 95,10" 
                fill="none" 
                stroke="#2196f3" 
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="kpi-card premium-kpi shadow-glass">
          <div className="kpi-icon-wrapper review-icon">
            <AlertCircle size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Pending Reviews</span>
            <div className="kpi-value">{stats.pendingReview}</div>
            <div className="kpi-trend negative">
              <TrendingDown size={14} />
              <span>Needs immediate action</span>
            </div>
          </div>
          <div className="kpi-sparkline">
            <svg viewBox="0 0 100 30" width="100%" height="30">
              <path 
                d="M 5,5 Q 35,20 65,15 T 95,28" 
                fill="none" 
                stroke="var(--accent-color)" 
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Charts & Side Panels */}
      <div className="charts-split-section">
        {/* SVG Interactive Line Chart */}
        <div className="chart-panel shadow-glass">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Weekly Revenue Trends</h3>
              <span className="chart-subtitle">Sales statistics over the last 7 days</span>
            </div>
            <div className="chart-legend">
              <span className="legend-indicator"></span>
              <span>Revenue (INR)</span>
            </div>
          </div>

          <div className="svg-chart-container">
            <svg viewBox="0 0 600 200" width="100%" height="200" className="revenue-svg-chart">
              {/* Grid Lines */}
              <line x1="50" y1="10" x2="550" y2="10" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
              <line x1="50" y1="50" x2="550" y2="50" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
              <line x1="50" y1="90" x2="550" y2="90" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
              <line x1="50" y1="130" x2="550" y2="130" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
              <line x1="50" y1="170" x2="550" y2="170" stroke="#eaeaea" strokeWidth="1.5" />

              {/* Chart Gradient Area */}
              <defs>
                <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--secondary-color)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--secondary-color)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path 
                d="M 50,170 L 50,150 Q 130,110 130,110 T 210,130 T 290,60 T 370,90 T 450,30 T 530,10 L 530,170 Z" 
                fill="url(#chart-area-grad)"
              />

              {/* Line Curve */}
              <path 
                d="M 50,150 Q 130,110 130,110 T 210,130 T 290,60 T 370,90 T 450,30 T 530,10" 
                fill="none" 
                stroke="var(--primary-color)" 
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Interactive Dots */}
              {chartData.map((pt, idx) => (
                <circle 
                  key={idx}
                  cx={pt.x} 
                  cy={pt.y} 
                  r="6" 
                  className={`chart-data-dot ${activeChartPoint?.day === pt.day ? 'active' : ''}`}
                  onMouseEnter={() => setActiveChartPoint({ x: pt.x, y: pt.y, value: `₹${pt.val.toLocaleString('en-IN')}`, day: pt.day })}
                  onMouseLeave={() => setActiveChartPoint(null)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                />
              ))}

              {/* Tooltip Render inside SVG */}
              {activeChartPoint && (
                <g className="chart-tooltip-group">
                  <rect 
                    x={activeChartPoint.x - 55} 
                    y={activeChartPoint.y - 45} 
                    width="110" 
                    height="35" 
                    rx="6" 
                    fill="var(--primary-color)" 
                    stroke="var(--secondary-color)"
                    strokeWidth="1"
                  />
                  <text 
                    x={activeChartPoint.x} 
                    y={activeChartPoint.y - 32} 
                    fill="white" 
                    fontSize="10" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    {activeChartPoint.day}: {activeChartPoint.value}
                  </text>
                </g>
              )}
            </svg>
            
            {/* X-Axis labels */}
            <div className="chart-xaxis-labels">
              {chartData.map((pt, idx) => (
                <span key={idx}>{pt.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Categories progress bar */}
        <div className="chart-side-panel shadow-glass">
          <h3 className="chart-title" style={{ marginBottom: '20px' }}>Category Share</h3>
          <div className="progress-share-list">
            <div className="share-item">
              <div className="share-info">
                <span>Decor & Urli</span>
                <strong>45%</strong>
              </div>
              <div className="share-bar"><div className="share-bar-fill" style={{ width: '45%', backgroundColor: 'var(--primary-color)' }}></div></div>
            </div>
            
            <div className="share-item">
              <div className="share-info">
                <span>Pooja & Idols</span>
                <strong>30%</strong>
              </div>
              <div className="share-bar"><div className="share-bar-fill" style={{ width: '30%', backgroundColor: 'var(--secondary-color)' }}></div></div>
            </div>

            <div className="share-item">
              <div className="share-info">
                <span>Hampers & Packs</span>
                <strong>15%</strong>
              </div>
              <div className="share-bar"><div className="share-bar-fill" style={{ width: '15%', backgroundColor: 'var(--accent-color)' }}></div></div>
            </div>

            <div className="share-item">
              <div className="share-info">
                <span>Wooden Toys</span>
                <strong>10%</strong>
              </div>
              <div className="share-bar"><div className="share-bar-fill" style={{ width: '10%', backgroundColor: '#4caf50' }}></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Log & Inventory Grid */}
      <div className="log-tables-grid">
        {/* Recent Orders Log */}
        <div className="admin-table-container shadow-glass">
          <div className="admin-table-header">
            <h2 className="admin-table-title">Recent Transactions</h2>
            <Link to="/admin/products" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              View All Orders
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items Purchased</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong style={{ color: 'var(--primary-color)' }}>{order.id}</strong></td>
                  <td>{order.customer}</td>
                  <td className="text-muted" style={{ fontSize: '0.85rem' }}>{order.items}</td>
                  <td>
                    <span className={`status-pill ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td><strong>₹{order.total}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alerts & Inventory Health */}
        <div className="inventory-alerts-panel shadow-glass">
          <div className="panel-header" style={{ marginBottom: '16px', paddingBottom: '12px' }}>
            <h3 className="panel-title" style={{ fontSize: '1.05rem' }}>
              <AlertCircle size={18} style={{ color: 'var(--accent-color)' }} />
              Inventory Alert Center
            </h3>
            <span className="alert-count-tag bg-accent">3 Items Low</span>
          </div>

          <div className="inventory-list">
            {lowStock.map((item) => (
              <div key={item.id} className="inventory-alert-item">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-category text-muted">{item.category}</span>
                </div>
                <div className="item-status">
                  <span className={`stock-level-badge ${item.stock === 0 ? 'out' : 'low'}`}>
                    {item.stock === 0 ? 'Out of Stock' : `${item.stock} Units Left`}
                  </span>
                  <button className="reorder-action-btn" title="Reorder Stock">
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Admin Actions Box */}
          <div className="admin-quick-actions-drawer">
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)' }}>
              ⚡ Quick Actions
            </h4>
            <div className="action-buttons-flex">
              <a href="/admin/products" className="action-btn">
                <Plus size={14} /> Add Product
              </a>
              <a href="/admin/categories" className="action-btn">
                <FolderOpen size={14} /> Add Category
              </a>
            </div>
          </div>
        </div>
      {/* Campaign Success Notification */}
      {campaignSuccess && (
        <div style={{
          marginTop: '30px',
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid #4caf50',
          color: '#2e7d32',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Check size={18} />
          <span>{campaignSuccess}</span>
        </div>
      )}

      {/* Marketing Campaign & Voucher Creator Panel (Feature 5) */}
      <div className="admin-campaign-panel shadow-glass">
        <div className="panel-header" style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="panel-title" style={{ fontSize: '1.2rem' }}>
            <Megaphone size={18} className="text-secondary" />
            Marketing Campaign & Discount Creator
          </h3>
          <span className="alert-count-tag" style={{ background: 'rgba(205, 168, 115, 0.15)', color: 'var(--secondary-color)' }}>
            ACTIVE CONSOLE
          </span>
        </div>

        <div className="campaign-grid">
          {/* Creator Form */}
          <form onSubmit={handleCreateCampaign} className="campaign-form-section">
            <div className="campaign-field">
              <label>Campaign Name</label>
              <input 
                type="text" 
                required 
                className="campaign-input"
                placeholder="e.g. Diwali Curation Gold, Monsoon Special"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>

            <div className="campaign-field-row">
              <div className="campaign-field">
                <label>Promo Voucher Code</label>
                <input 
                  type="text" 
                  required 
                  className="campaign-input"
                  style={{ textTransform: 'uppercase' }}
                  placeholder="e.g. FESTIVE30"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>

              <div className="campaign-field">
                <label>Discount Value</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    className="campaign-input"
                    style={{ flex: 1 }}
                    value={discountVal}
                    onChange={(e) => setDiscountVal(Number(e.target.value))}
                  />
                  <select 
                    className="campaign-input"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percent' | 'fixed')}
                    style={{ width: '80px' }}
                  >
                    <option value="percent">% Off</option>
                    <option value="fixed">₹ Off</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="campaign-field-row">
              <div className="campaign-field">
                <label>Target Audience Tier</label>
                <select 
                  className="campaign-input"
                  value={targetTier}
                  onChange={(e) => setTargetTier(e.target.value)}
                >
                  <option value="All Customers">All Customers</option>
                  <option value="Silver Members">Silver Tier</option>
                  <option value="Gold Tier Members">Gold Tier Members</option>
                  <option value="Platinum Members">Platinum Tier Members</option>
                </select>
              </div>

              <div className="campaign-field">
                <label>Banner Theme</label>
                <div className="theme-options-grid">
                  <button 
                    type="button" 
                    className={`theme-btn theme-navy ${bannerTheme === 'navy' ? 'active' : ''}`}
                    onClick={() => setBannerTheme('navy')}
                  >
                    Navy
                  </button>
                  <button 
                    type="button" 
                    className={`theme-btn theme-crimson ${bannerTheme === 'crimson' ? 'active' : ''}`}
                    onClick={() => setBannerTheme('crimson')}
                  >
                    Ruby
                  </button>
                  <button 
                    type="button" 
                    className={`theme-btn theme-gold ${bannerTheme === 'gold' ? 'active' : ''}`}
                    onClick={() => setBannerTheme('gold')}
                  >
                    Gold
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="campaign-submit-btn">
              <Plus size={16} />
              Launch Campaign Code
            </button>
          </form>

          {/* Real-time Banner Preview and Active List */}
          <div className="campaign-preview-section">
            <div>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.5px' }}>
                Live Promo Banner Mockup
              </h4>
              <div className="banner-mockup-wrapper">
                <div className={`live-banner-mockup ${bannerTheme}`}>
                  <Sparkles size={16} className="banner-sparkles text-secondary" style={{ display: 'block' }} />
                  <div className="banner-badge">SAUGAAT PROMO</div>
                  
                  <div className="banner-title-text">
                    {campaignName || 'Campaign Name'}
                  </div>

                  <div className="banner-middle">
                    <span className="banner-promo-tag" style={{ display: 'block' }}>Use Voucher Code:</span>
                    <div className="banner-code-box">
                      <span className="banner-code-text">
                        {promoCode ? promoCode.toUpperCase().replace(/\s+/g, '') : 'PROMO'}
                      </span>
                    </div>
                  </div>

                  <div className="banner-discount-seal">
                    {discountVal || 0}
                    <span style={{ display: 'block' }}>{discountType === 'percent' ? '%' : '₹'}</span>
                  </div>

                  <div className="banner-footer-target">
                    Target: <strong>{targetTier}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Active campaigns history */}
            <div>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.5px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                Active Discount Codes
              </h4>
              <div className="active-campaigns-list">
                {campaignsList.map(c => (
                  <div key={c.id} className="active-campaign-row">
                    <div>
                      <h4>{c.name}</h4>
                      <span>Tier: {c.target}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <code style={{ display: 'block', marginBottom: '4px' }}>{c.code}</code>
                      <span className="text-accent" style={{ fontWeight: 600 }}>{c.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};
