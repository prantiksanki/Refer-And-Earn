import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserEmail } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  // Check if user email is stored in localStorage (set after successful login)
  const userEmail = getUserEmail();
  
  if (!userEmail) {
    return <Navigate to="/" replace />;
  }

  return children;
}
