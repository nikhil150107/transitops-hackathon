import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ProtectedLayout from './components/layout/ProtectedLayout';
import PublicLayout from './components/layout/PublicLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveTracking from './pages/LiveTracking';
import Incidents from './pages/Incidents';
import RouteOptimizer from './pages/RouteOptimizer';
import Notifications from './pages/Notifications';
import Emergency from './pages/Emergency';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// App CSS
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Layout Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tracking" element={<LiveTracking />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/optimizer" element={<RouteOptimizer />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all Redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
