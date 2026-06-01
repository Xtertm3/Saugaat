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
