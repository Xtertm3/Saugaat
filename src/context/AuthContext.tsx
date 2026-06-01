import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin' | null;

type AuthContextType = {
  user: User | null;
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  loginMock: (email: string, role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  loginMock: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const useAuthAdmin = () => {
  const { isAdmin } = useAuth();
  return isAdmin;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = role === 'admin';

  useEffect(() => {
    // Check if there is a mock session first
    const mockSession = localStorage.getItem('saugaat_mock_session');
    if (mockSession) {
      try {
        const sessionData = JSON.parse(mockSession);
        setUser(sessionData.user);
        setRole(sessionData.role);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Error parsing mock session:', e);
      }
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setRole((session.user.user_metadata?.role as UserRole) ?? 'user');
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setRole((session.user.user_metadata?.role as UserRole) ?? 'user');
      } else {
        // Only clear if we aren't using a mock session
        if (!localStorage.getItem('saugaat_mock_session')) {
          setUser(null);
          setRole(null);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginMock = (email: string, userRole: UserRole) => {
    const mockUser = {
      id: `mock-${userRole}-${Date.now()}`,
      email: email,
      user_metadata: { role: userRole },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as unknown as User;
    
    setUser(mockUser);
    setRole(userRole);
    localStorage.setItem('saugaat_mock_session', JSON.stringify({ user: mockUser, role: userRole }));
  };

  const signOut = async () => {
    localStorage.removeItem('saugaat_mock_session');
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, isAdmin, signOut, loginMock }}>
      {children}
    </AuthContext.Provider>
  );
};
