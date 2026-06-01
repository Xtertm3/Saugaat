import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, Package, FolderOpen, LogOut, Menu, X, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import '../Admin.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <Award size={24} className="sidebar-header-gold-icon" style={{ color: 'var(--secondary-color)' }} />
          {!collapsed && <span className="admin-sidebar-logo">Saugaat Portal</span>}
        </div>

        {/* Desktop Collapse Toggle */}
        <button 
          className="sidebar-collapse-toggle desktop-only"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <nav className="admin-nav">
          <Link
            to="/admin/dashboard"
            className={`admin-nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
            title="Dashboard"
          >
            <BarChart3 size={20} />
            {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link
            to="/admin/products"
            className={`admin-nav-item ${isActive('/admin/products') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
            title="Products"
          >
            <Package size={20} />
            {!collapsed && <span>Products</span>}
          </Link>
          <Link
            to="/admin/categories"
            className={`admin-nav-item ${isActive('/admin/categories') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
            title="Categories"
          >
            <FolderOpen size={20} />
            {!collapsed && <span>Categories</span>}
          </Link>
          
          <button
            className="admin-nav-item logout-nav-item"
            onClick={handleLogout}
            style={{ marginTop: 'auto' }}
            title="Logout"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <div className="admin-header glass">
          <div className="admin-header-left">
            <button
              className="btn-icon mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="admin-header-title">{title}</h1>
          </div>

          <div className="admin-header-right">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="desktop-only">
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {user?.email?.split('@')[0].toUpperCase()}
                </div>
                <div className="admin-user-email" style={{ fontSize: '11px', marginTop: '2px' }}>{user?.email}</div>
              </div>
            </div>
            <button
              className="btn-icon header-logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};
