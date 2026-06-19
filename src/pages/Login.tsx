import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authRole, setAuthRole] = useState<'user' | 'admin'>('user');
  
  const navigate = useNavigate();
  const { loginMock } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Mock Login Credentials checks (for easy local testing)
    if (authRole === 'admin' && email === 'admin@saugaat.com' && password === 'saugaat123') {
      loginMock('admin@saugaat.com', 'admin');
      navigate('/admin/dashboard');
      setLoading(false);
      return;
    }

    if (authRole === 'user' && email === 'customer@saugaat.com' && password === 'saugaat123') {
      loginMock('customer@saugaat.com', 'user');
      navigate('/');
      setLoading(false);
      return;
    }

    if (!supabase) {
      setMessage({ 
        type: 'error', 
        text: 'Supabase is not configured. Please use the Quick Demo Login buttons below or configure your .env.local file.' 
      });
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign up with role metadata
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: authRole
            }
          }
        });
        if (error) throw error;
        setMessage({ 
          type: 'success', 
          text: `Registration successful as ${authRole === 'admin' ? 'Administrator' : 'Client'}! Please check your email inbox to verify your account (unless email verification is disabled in your Supabase dashboard).` 
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Redirect based on metadata role
        const loggedUserRole = data.user?.user_metadata?.role || 'user';
        if (loggedUserRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
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

  const triggerQuickLogin = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      loginMock('admin@saugaat.com', 'admin');
      navigate('/admin/dashboard');
    } else {
      loginMock('customer@saugaat.com', 'user');
      navigate('/');
    }
  };

  return (
    <div className="section-padding container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass" style={{ 
        padding: '40px', 
        borderRadius: 'var(--radius-lg)', 
        width: '100%', 
        maxWidth: '480px',
        border: '1px solid rgba(200, 169, 107, 0.25)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        
        {/* Decorative Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={14} /> Luxury Gifting Hub
          </span>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', marginTop: '8px' }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <div className="title-underline" style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary-color)', margin: '10px auto 0 auto' }}></div>
        </div>

        {/* Role Segmented Selector */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(31, 77, 58, 0.06)', 
          padding: '4px', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '28px',
          border: '1px solid rgba(31, 77, 58, 0.08)'
        }}>
          <button 
            type="button"
            onClick={() => { setAuthRole('user'); setMessage(null); }}
            style={{ 
              flex: 1, 
              padding: '10px 0', 
              borderRadius: '6px', 
              backgroundColor: authRole === 'user' ? 'var(--primary-color)' : 'transparent', 
              color: authRole === 'user' ? 'white' : 'var(--primary-color)', 
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
          >
            <User size={14} /> Client Portal
          </button>
          <button 
            type="button"
            onClick={() => { setAuthRole('admin'); setMessage(null); }}
            style={{ 
              flex: 1, 
              padding: '10px 0', 
              borderRadius: '6px', 
              backgroundColor: authRole === 'admin' ? 'var(--primary-color)' : 'transparent', 
              color: authRole === 'admin' ? 'white' : 'var(--primary-color)', 
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
          >
            <ShieldCheck size={14} /> Admin Console
          </button>
        </div>

        {/* Message Alert Box */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ 
                padding: '14px', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '24px',
                backgroundColor: message.type === 'error' ? '#ffebee' : '#e8f5e9',
                color: message.type === 'error' ? '#c62828' : '#2e7d32',
                fontSize: '0.85rem',
                border: `1px solid ${message.type === 'error' ? '#ffcdd2' : '#c8e6c9'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Authentication Form */}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Mail size={12} /> Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com" 
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                outline: 'none', 
                fontFamily: 'inherit', 
                fontSize: '14px',
                transition: 'border-color 0.2s'
              }} 
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Lock size={12} /> Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••" 
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                outline: 'none', 
                fontFamily: 'inherit', 
                fontSize: '14px',
                transition: 'border-color 0.2s'
              }} 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '14px', marginTop: '8px', width: '100%', border: 'none', borderRadius: 'var(--radius-md)', letterSpacing: '1px', fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? `Sign Up as ${authRole === 'admin' ? 'Admin' : 'Client'}` : `Log In to ${authRole === 'admin' ? 'Console' : 'Portal'}`)}
          </button>
        </form>

        {/* Third Party Login (Only shown for standard clients) */}
        {authRole === 'user' && !isSignUp && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
              <span style={{ padding: '0 10px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            </div>

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
          </>
        )}

        {/* Demo Fast Login Buttons */}
        <div style={{ 
          marginTop: '30px', 
          padding: '16px', 
          backgroundColor: 'rgba(200, 169, 107, 0.08)',
          border: '1px dashed var(--secondary-color)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>
            ⚡ Fast Testing & Curation Mock Logins
          </h4>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              onClick={() => triggerQuickLogin('user')}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'white',
                border: '1px solid var(--border-color)',
                color: 'var(--primary-color)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Demo Client
            </button>
            <button 
              type="button" 
              onClick={() => triggerQuickLogin('admin')}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'white',
                border: '1px solid var(--border-color)',
                color: 'var(--accent-color)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Toggle between Signup / Login */}
        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
};
