import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSkeleton type="spinner" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    // Redirect according to current user's actual role
    if (currentUser?.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (currentUser?.role === 'STAFF') return <Navigate to="/staff" replace />;
    return <Navigate to="/customer" replace />;
  }

  return children;
};
