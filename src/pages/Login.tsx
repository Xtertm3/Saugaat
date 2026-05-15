import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase is not configured. Please check your .env.local file.' });
      return;
    }

    setLoading(true);
    setMessage(null);

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
    <div className="section-padding container" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-color)' }}>
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h2>

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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com" 
              style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'inherit' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••" 
              style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'inherit' }} 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '15px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
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
