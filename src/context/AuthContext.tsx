import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { getProfile, updateProfilePoints, calculateTier } from '../lib/database';

export type UserRole = 'user' | 'admin' | null;

type AuthContextType = {
  user: User | null;
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  points: number;
  tier: string;
  signOut: () => Promise<void>;
  loginMock: (email: string, role: UserRole) => void;
  updatePoints: (pointsToAdd: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  isAdmin: false,
  points: 0,
  tier: 'Bronze Tier Member',
  signOut: async () => {},
  loginMock: () => {},
  updatePoints: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const useAuthAdmin = () => {
  const { isAdmin } = useAuth();
  return isAdmin;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [points, setPoints] = useState<number>(0);
  const [tier, setTier] = useState<string>('Bronze Tier Member');
  const [loading, setLoading] = useState(true);

  const isAdmin = role === 'admin';

  const syncProfile = async (userId: string) => {
    if (supabase) {
      const profile = await getProfile(userId);
      if (profile) {
        setPoints(profile.points);
        setTier(profile.tier);
      } else {
        setPoints(0);
        setTier('Bronze Tier Member');
      }
    }
  };

  useEffect(() => {
    // Check if there is a mock session first
    const mockSession = localStorage.getItem('saugaat_mock_session');
    if (mockSession) {
      try {
        const sessionData = JSON.parse(mockSession);
        setUser(sessionData.user);
        setRole(sessionData.role);
        setPoints(sessionData.points ?? 350);
        setTier(sessionData.tier ?? 'Gold Tier Member');
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
        syncProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setRole((session.user.user_metadata?.role as UserRole) ?? 'user');
        syncProfile(session.user.id);
      } else {
        // Only clear if we aren't using a mock session
        if (!localStorage.getItem('saugaat_mock_session')) {
          setUser(null);
          setRole(null);
          setPoints(0);
          setTier('Bronze Tier Member');
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
    
    const mockPoints = userRole === 'user' ? 350 : 0;
    const mockTier = calculateTier(mockPoints);

    setUser(mockUser);
    setRole(userRole);
    setPoints(mockPoints);
    setTier(mockTier);
    localStorage.setItem('saugaat_mock_session', JSON.stringify({ 
      user: mockUser, 
      role: userRole, 
      points: mockPoints, 
      tier: mockTier 
    }));
  };

  const signOut = async () => {
    localStorage.removeItem('saugaat_mock_session');
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setRole(null);
    setPoints(0);
    setTier('Bronze Tier Member');
  };

  const updatePoints = async (pointsToAdd: number) => {
    const newPoints = points + pointsToAdd;
    const newTier = calculateTier(newPoints);

    setPoints(newPoints);
    setTier(newTier);

    // Persist to Mock session
    const mockSession = localStorage.getItem('saugaat_mock_session');
    if (mockSession) {
      try {
        const sessionData = JSON.parse(mockSession);
        sessionData.points = newPoints;
        sessionData.tier = newTier;
        localStorage.setItem('saugaat_mock_session', JSON.stringify(sessionData));
        return;
      } catch (e) {
        console.error('Error updating mock session points:', e);
      }
    }

    // Persist to Supabase profiles
    if (supabase && user) {
      await updateProfilePoints(user.id, newPoints);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, isAdmin, points, tier, signOut, loginMock, updatePoints }}>
      {children}
    </AuthContext.Provider>
  );
};

