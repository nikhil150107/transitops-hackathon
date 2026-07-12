import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [telemetryUptime, setTelemetryUptime] = useState('99.98%');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const incidents = await api.getIncidents();
        const active = incidents.filter(i => i.status !== 'Resolved' && (i.severity === 'High' || i.severity === 'Critical'));
        setActiveIncidents(active);
      } catch (err) {
        console.error('Ticker fetch error', err);
      }
    };
    fetchTickerData();
    const interval = setInterval(fetchTickerData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const paths = {
      '/': 'Dashboard Overview',
      '/tracking': 'Live Vehicle Tracking',
      '/incidents': 'Incident Log Desk',
      '/optimizer': 'AI Route Optimizer',
      '/notifications': 'Passenger Notification Console',
      '/emergency': 'SOS Dispatch Control',
      '/analytics': 'Analytics Hub',
      '/profile': 'Operator Profile',
      '/settings': 'System Settings'
    };
    return paths[location.pathname] || 'Saarthi Operations';
  };

  return (
    <header className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 z-20 h-16 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
      
      {/* Title */}
      <div className="flex items-center space-x-3">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Saarthi</span>
        <Icons.ChevronRight className="w-4 h-4 text-slate-350 dark:text-slate-650" />
        <h1 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight">{getPageTitle()}</h1>
      </div>

      {/* Ticker marquee feed */}
      {activeIncidents.length > 0 && (
        <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8 px-4 py-1.5 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 rounded-full overflow-hidden text-xs text-rose-700 dark:text-rose-400">
          <Icons.ShieldAlert className="w-4 h-4 mr-2 flex-shrink-0 text-rose-550 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[9px] bg-rose-500 text-white px-2 py-0.5 rounded-full mr-3 animate-pulse">Critical</span>
          <div className="flex-1 w-full overflow-hidden relative h-4">
            <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap absolute flex space-x-8">
              {activeIncidents.map((inc, i) => (
                <span key={i} className="font-bold">
                  ⚠️ {inc.type}: {inc.description} (Location: {inc.location})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Telemetry info and Actions */}
      <div className="flex items-center space-x-4">
        
        {/* Telemetry Status Indicator */}
        <div className="hidden md:flex items-center space-x-2 text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-full text-slate-500 font-bold uppercase">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-emerald-600 dark:text-emerald-500">SYSTEM: ACTIVE</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Telemetry: {telemetryUptime}</span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Icons.Sun className="w-4.5 h-4.5" /> : <Icons.Moon className="w-4.5 h-4.5" />}
        </button>

        {/* User Account Controls */}
        <div className="relative">
          <button 
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <img 
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop'} 
              alt="Avatar" 
              className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-600 object-cover"
            />
            <div className="hidden md:block text-left text-[11px]">
              <p className="font-bold text-slate-800 dark:text-slate-200 leading-none">{user?.name || 'Operator'}</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mt-0.5">{user?.role || 'Operator'}</p>
            </div>
            <Icons.ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <>
              <div className="fixed inset-0 z-45" onClick={() => setUserDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 py-1.5 divide-y divide-slate-100 dark:divide-slate-700/50 text-xs">
                <div className="px-4 py-2">
                  <p className="font-bold text-slate-800 dark:text-slate-100">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-650 dark:text-slate-350"
                  >
                    <Icons.User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <button 
                    onClick={() => { navigate('/settings'); setUserDropdownOpen(false); }}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-650 dark:text-slate-350"
                  >
                    <Icons.Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
                <div className="py-1">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-955/10"
                  >
                    <Icons.LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Marquee Ticker CSS styling wrapper */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
