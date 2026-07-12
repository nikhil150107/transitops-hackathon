import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../utils/api';

const Navbar = ({ onMenuOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Local state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    navigate('/login');
  };

  const getPageTitle = () => {
    const paths = {
      '/': 'Dashboard Overview',
      '/fleet': 'Fleet Registry',
      '/drivers': 'Driver Profiles',
      '/trips': 'Trip Dispatcher',
      '/maintenance': 'Maintenance Desk',
      '/expenses': 'Fuel & Expenses',
      '/analytics': 'Analytics Hub',
      '/settings': 'System Settings'
    };
    return paths[location.pathname] || 'Pravaah Operations';
  };

  const dummyNotifications = [
    { id: 1, text: 'VAN-05 has exceeded cargo load limit.', time: '5m ago', type: 'critical' },
    { id: 2, text: 'John is currently Suspended due to expired license.', time: '1h ago', type: 'warning' },
    { id: 3, text: 'New dispatch record created for TR007.', time: '2h ago', type: 'info' }
  ];

  return (
    <header className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 z-20 h-16 flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-sm">
      
      {/* LEFT SECTION: Mobile Hamburger & Page Title & Search */}
      <div className="flex items-center space-x-3 flex-1">
        
        {/* Mobile Hamburger menu */}
        <button
          onClick={onMenuOpen}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50"
          title="Open Menu"
        >
          <Icons.Menu className="w-5 h-5" />
        </button>

        {/* Page Title & breadcrumb */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Pravaah</span>
          <Icons.ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <h1 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tight whitespace-nowrap">
            {getPageTitle()}
          </h1>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-xs ml-0 sm:ml-4 hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global search operations, vehicles..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs font-semibold placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 transition-all"
          />
        </div>

      </div>

      {/* MID SECTION: Incident Marquee Ticker */}
      {activeIncidents.length > 0 && (
        <div className="hidden xl:flex items-center flex-1 max-w-sm mx-4 px-4 py-1.5 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 rounded-full overflow-hidden text-[10px] text-rose-700 dark:text-rose-400">
          <Icons.ShieldAlert className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-rose-550 animate-pulse" />
          <div className="flex-1 w-full overflow-hidden relative h-4">
            <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap absolute flex space-x-6">
              {activeIncidents.map((inc, i) => (
                <span key={i} className="font-bold">
                  ⚠️ {inc.type}: {inc.description}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RIGHT SECTION: Telemetry status, alerts drop, theme toggle, avatar dropdown */}
      <div className="flex items-center space-x-3.5 flex-shrink-0">
        
        {/* Telemetry Status Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 text-[9px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-full text-slate-500 font-bold uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-emerald-600 dark:text-emerald-500">SYSTEM: ACTIVE</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Telemetry: Stable</span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Icons.Sun className="w-4 h-4" /> : <Icons.Moon className="w-4 h-4" />}
        </button>

        {/* NOTIFICATIONS BELL DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200 transition-colors relative"
            title="Notifications"
          >
            <Icons.Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-800 animate-pulse"></span>
          </button>

          {notifDropdownOpen && (
            <>
              <div className="fixed inset-0 z-45" onClick={() => setNotifDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2.5 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 py-2 divide-y divide-slate-100 dark:divide-slate-700/50 text-xs">
                <div className="px-4 py-2 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">System Notifications</span>
                  <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold">3 alerts</span>
                </div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  {dummyNotifications.map((notif) => (
                    <div key={notif.id} className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 flex items-start space-x-2.5 cursor-pointer">
                      <span className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        notif.type === 'critical' ? 'bg-rose-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></span>
                      <div className="space-y-0.5">
                        <p className="text-slate-700 dark:text-slate-305 font-medium leading-relaxed">{notif.text}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="relative">
          <button 
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <img 
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop'} 
              alt="Avatar" 
              className="w-7 h-7 rounded-full border border-slate-205 object-cover"
            />
            <div className="hidden md:block text-left text-[11px]">
              <p className="font-bold text-slate-850 dark:text-slate-205 leading-none">{user?.name || 'Operator'}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1 leading-none">{user?.role || 'Operator'}</p>
            </div>
            <Icons.ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <>
              <div className="fixed inset-0 z-45" onClick={() => setUserDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 py-1.5 divide-y divide-slate-100 dark:divide-slate-700/50 text-xs">
                <div className="px-4 py-2">
                  <p className="font-bold text-slate-800 dark:text-slate-100 leading-none">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 hover:bg-slate-55 dark:hover:bg-slate-700/40 text-slate-650 dark:text-slate-350"
                  >
                    <Icons.User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <button 
                    onClick={() => { navigate('/settings'); setUserDropdownOpen(false); }}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 hover:bg-slate-55 dark:hover:bg-slate-700/40 text-slate-650 dark:text-slate-350"
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

      {/* Marquee animation styling */}
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
