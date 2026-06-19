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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);

    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase is not configured. Google Sign In will not work.' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred during Google Sign In.' });
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

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <span style={{ padding: '0 10px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        {/* Google Sign In Button */}
        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-secondary" 
          style={{ 
            padding: '14px', 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            backgroundColor: 'white',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
            <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.61.424 3.125 1.176 4.448l2.788-2.196z" fill="#FBBC05" />
            <path d="M9 3.58c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.806 11.426 0 9 0 5.483 0 2.443 2.017 1.176 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button>

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
