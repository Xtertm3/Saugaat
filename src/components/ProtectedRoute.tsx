import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthAdmin } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAdmin = useAuthAdmin();

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const ProtectedUserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const storedUser = localStorage.getItem('saugaat_user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

