import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { loginMock } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage(null);

    // Mock Login Credentials check
    if (email === 'admin@saugaat.com' && password === 'saugaat123') {
      loginMock('admin@saugaat.com', 'admin');
      navigate('/admin/dashboard');
      setLoading(false);
      return;
    }

    if (email === 'customer@saugaat.com' && password === 'saugaat123') {
      loginMock('customer@saugaat.com', 'user');
      navigate('/');
      setLoading(false);
      return;
    }

    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase is not configured. Please use the demo credentials above or check your .env.local file.' });
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Registration successful! Please check your email for verification.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred during authentication.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding container" style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h2>

        {/* Mock Credentials Box */}
        <div style={{
          backgroundColor: 'rgba(205, 168, 115, 0.08)',
          border: '1px dashed var(--secondary-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '24px',
          fontSize: '0.85rem',
          color: 'var(--primary-color)'
        }}>
          <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--primary-color)' }}>
            🔑 Demo / Testing Credentials
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <strong style={{ display: 'block', color: 'var(--accent-color)', marginBottom: '4px' }}>Customer Account</strong>
              <div style={{ fontSize: '0.8rem' }}>User: <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' }}>customer@saugaat.com</code></div>
              <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>Pass: <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' }}>saugaat123</code></div>
            </div>
            <div>
              <strong style={{ display: 'block', color: 'var(--accent-color)', marginBottom: '4px' }}>Admin Account</strong>
              <div style={{ fontSize: '0.8rem' }}>User: <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' }}>admin@saugaat.com</code></div>
              <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>Pass: <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' }}>saugaat123</code></div>
            </div>
          </div>
        </div>

        {message && (
          <div style={{ 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)', 
            marginBottom: '20px',
            backgroundColor: message.type === 'error' ? '#ffebee' : '#e8f5e9',
            color: message.type === 'error' ? '#c62828' : '#2e7d32',
            fontSize: '0.9rem'
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com" 
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', outline: 'none', fontFamily: 'inherit', fontSize: '14px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••" 
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', outline: 'none', fontFamily: 'inherit', fontSize: '14px' }} 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '15px', marginTop: '10px', width: '100%', border: 'none', borderRadius: 'var(--radius-md)', letterSpacing: '1px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};
