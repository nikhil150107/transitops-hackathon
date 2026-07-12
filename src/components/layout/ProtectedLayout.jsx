import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ProtectedLayout = () => {
  const { user } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Auth protection guard
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        expanded={sidebarExpanded} 
        onToggle={toggleSidebar} 
      />

      {/* Main Panel Content Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar Header */}
        <Navbar />

        {/* Dynamic Nested Content Page */}
        <main className="flex-1 overflow-y-auto p-6 focus:outline-none">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default ProtectedLayout;
