import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import '../Admin.css';

const ADMIN_CODE = 'SAUGAAT-ADMIN-2024';

export const AdminSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const navigate = useNavigate();

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase is not configured.' });
      return;
    }

    if (adminCode !== ADMIN_CODE) {
      setMessage({ type: 'error', text: 'Invalid admin code. Please check and try again.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
          },
        },
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Admin account created! Please check your email for verification.' });

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred during signup.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <h1 className="admin-title">Saugaat Admin Portal</h1>
          <p className="admin-subtitle">Create Admin Account</p>
        </div>

        {message && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAdminSignup} className="admin-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@saugaat.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Admin Code</label>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required
              placeholder="Enter admin code"
              className="form-input"
            />
            <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              You'll need a valid admin code to create an admin account.
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '15px', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
          Go back to <a href="/" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>Home</a>
        </div>
      </div>
    </div>
  );
};
