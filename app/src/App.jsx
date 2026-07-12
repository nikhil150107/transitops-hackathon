import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ProtectedLayout from './components/layout/ProtectedLayout';
import PublicLayout from './components/layout/PublicLayout';

// Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Fleet from './pages/Fleet/Fleet';
import Drivers from './pages/Drivers/Drivers';
import Dispatcher from './pages/Dispatcher/Dispatcher';
import Maintenance from './pages/Maintenance/Maintenance';
import FuelExpense from './pages/FuelExpense/FuelExpense';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';

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
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/trips" element={<Dispatcher />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/expenses" element={<FuelExpense />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all Redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
