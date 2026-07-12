import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicLayout = () => {
  const { user } = useAuth();

  // Redirect authenticated user to Dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-hidden">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
