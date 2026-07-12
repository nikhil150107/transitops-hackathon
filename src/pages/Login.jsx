import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import * as Icons from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('operator@saarthi.gov.in');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Operator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-tr from-slate-550 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-850">
      <Card 
        className="w-full max-w-md shadow-2xl p-6"
        title="SAARTHI COMMAND CENTER"
        subtitle="Secure Access Telemetry Portal"
      >
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2 mb-4 animate-shake">
            <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          
          <div className="space-y-1.5">
            <label className="block text-slate-400 uppercase text-[9px]">Operational Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            >
              <option value="Operator">Transit Operator</option>
              <option value="Administrator">Platform Administrator</option>
              <option value="Driver">Transit Fleet Driver</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 uppercase text-[9px]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@saarthi.gov.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 uppercase text-[9px]">Security Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full py-3 mt-2"
          >
            Authenticate secure Session
          </Button>

        </form>
      </Card>
    </div>
  );
};

export default Login;
