import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ expanded, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'LayoutDashboard', roles: ['Operator', 'Administrator', 'Driver'] },
    { name: 'Live Tracking', path: '/tracking', icon: 'Navigation', roles: ['Operator', 'Administrator', 'Driver'] },
    { name: 'Incidents', path: '/incidents', icon: 'AlertTriangle', roles: ['Operator', 'Administrator'], badge: true },
    { name: 'Route Optimizer', path: '/optimizer', icon: 'Cpu', roles: ['Operator', 'Administrator'] },
    { name: 'Notifications', path: '/notifications', icon: 'Bell', roles: ['Operator', 'Administrator'] },
    { name: 'Emergency SOS', path: '/emergency', icon: 'ShieldAlert', roles: ['Operator', 'Administrator', 'Driver'], sos: true },
    { name: 'Analytics', path: '/analytics', icon: 'BarChart3', roles: ['Operator', 'Administrator'] },
    { name: 'Operator Profile', path: '/profile', icon: 'User', roles: ['Operator', 'Administrator', 'Driver'] },
    { name: 'System Settings', path: '/settings', icon: 'Settings', roles: ['Administrator', 'Operator'] },
  ];

  const allowedNavItems = navItems.filter(item => item.roles.includes(user?.role || 'Operator'));

  return (
    <aside 
      className={`flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/60 z-30 transition-all duration-300 ease-in-out ${
        expanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-primary-500 text-white shadow-md shadow-primary-500/20 flex-shrink-0">
            <Icons.Navigation className="w-5 h-5 fill-current" />
          </div>
          {expanded && (
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-primary-500 to-indigo-600 bg-clip-text text-transparent">
              SAARTHI
            </span>
          )}
        </div>
        <button 
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          {expanded ? <Icons.ChevronLeft className="w-5 h-5" /> : <Icons.ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {allowedNavItems.map((item) => {
          const IconComp = Icons[item.icon] || Icons.HelpCircle;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-155 group relative ${
                  isActive
                    ? item.sos 
                      ? 'bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-450 font-bold'
                      : 'bg-primary-50 dark:bg-primary-950/15 text-primary-600 dark:text-primary-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <IconComp className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                  item.sos ? 'text-rose-500' : 'text-inherit'
                }`} />
                {expanded && <span>{item.name}</span>}
              </div>

              {expanded && item.sos && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}

              {!expanded && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700/50">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-505 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-955/10 transition-colors group relative"
        >
          <Icons.LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          {expanded && <span>Log Out</span>}
          {!expanded && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-50">
              Log Out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
