import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/forms/Button';
import * as Icons from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('manager@pravaah.gov.in');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Fleet Manager');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      if (password.length < 6) {
        throw new Error('Incorrect credentials. Password must be at least 6 characters.');
      }

      await login(email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoCredentials = (selectedRole) => {
    setRole(selectedRole);
    const slug = selectedRole.toLowerCase().replace(' ', '');
    setEmail(`${slug}@pravaah.gov.in`);
    setPassword('admin123');
  };

  const features = [
    { name: 'Fleet Manager', desc: 'Real-time telemetry and state tracking logs', icon: 'Bus' },
    { name: 'Dispatcher', desc: 'AI route optimization and schedule broadcasts', icon: 'Cpu' },
    { name: 'Safety Officer', desc: 'SOS emergency controls and unit dispatches', icon: 'ShieldAlert' },
    { name: 'Financial Analyst', desc: 'Analytical charts on fuel and carbon savings', icon: 'BarChart3' },
  ];

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105 overflow-hidden">
      
      {/* LEFT PANEL */}
      <div className="w-full md:w-5/12 text-white relative p-8 md:p-12 flex flex-col justify-between overflow-hidden border-r border-slate-700 bg-[#1F2937] dark:bg-[#1F2937]">
        
        {/* Decorative Ambient Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex items-center space-x-3 z-10">
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex-shrink-0">
            <Icons.Navigation className="w-6 h-6 fill-current text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-wider text-white">PRAVAAH</span>
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-none mt-0.5">Control Terminal</span>
          </div>
        </div>

        {/* Feature List Section */}
        <div className="my-auto py-10 space-y-8 z-10">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
              Platform Modules
            </span>
            <h2 className="text-3xl font-black leading-tight tracking-tight">
              Smart Transport Operations Platform
            </h2>
          </div>

          <div className="space-y-4">
            {features.map((f, idx) => {
              const IconComp = Icons[f.icon] || Icons.Zap;
              return (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/8 transition-colors">
                  <div className="p-2 bg-white/10 rounded-xl text-indigo-300 mt-0.5">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{f.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-semibold">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Ministry of Urban Transit • Pravaah v2.4.0
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-slate-900 relative">
        <div className="w-full max-w-md space-y-6 z-10">
          
          {/* Header */}
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Operator Sign In
            </h2>
            <p className="text-xs text-slate-450 dark:text-slate-550 font-bold">
              Access telemetry grids and command dispatcher resources.
            </p>
          </div>

          {/* Failed Login Alert Card */}
          {error && (
            <div className="p-4 bg-rose-55 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start space-x-3 shadow-sm animate-shake">
              <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 rounded-xl text-rose-600 dark:text-rose-400">
                <Icons.AlertOctagon className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider text-[10px]">Security Alert</p>
                <p className="text-rose-655 dark:text-rose-350 font-semibold leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-white dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-5">
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              
              {/* Role Selector */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px] tracking-wider">Role Scope (RBAC)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Icons.LockKeyhole className="w-4 h-4" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => loadDemoCredentials(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-101 font-semibold focus:outline-none"
                  >
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px] tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-405">
                    <Icons.Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@pravaah.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-101"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px] tracking-wider">Security Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-405">
                    <Icons.Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-101"
                  />
                </div>
              </div>

              {/* Extras */}
              <div className="flex justify-between items-center text-xs font-semibold pt-1">
                <label className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-primary-500 focus:ring-primary-500/20 h-4 w-4 bg-slate-50 dark:bg-slate-900 border-slate-205 dark:border-slate-750"
                  />
                  <span>Remember session</span>
                </label>
                <a href="#forgot" className="text-primary-555 hover:underline">Forgot password?</a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 mt-3 bg-gradient-to-r from-primary-500 to-indigo-650 hover:from-primary-600 hover:to-indigo-700 shadow-md shadow-primary-500/10 text-white font-bold"
              >
                Authenticate Terminal Session
              </Button>

            </form>

            {/* Quick selector options */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider text-center">
                RBAC Demo Accounts Quick Fill
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('Fleet Manager')}
                  className="px-2.5 py-1.5 border border-slate-205 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Fleet Manager
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('Dispatcher')}
                  className="px-2.5 py-1.5 border border-slate-205 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Dispatcher
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('Safety Officer')}
                  className="px-2.5 py-1.5 border border-slate-205 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Safety Officer
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('Financial Analyst')}
                  className="px-2.5 py-1.5 border border-slate-205 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Financial Analyst
                </button>
              </div>
            </div>

          </div>

          <p className="text-center text-[9px] text-slate-455 dark:text-slate-550 uppercase tracking-widest font-bold leading-normal">
            SECURE SYSTEM AUTHORIZED FOR OFFICIAL USE ONLY. ACCESSIBILITY PARAMETERS ARE MONITORED BY THE TRANSPORT BOARD.
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;
