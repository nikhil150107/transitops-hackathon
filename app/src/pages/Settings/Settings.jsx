import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Button from '../../components/forms/Button';
import StatusBadge from '../../components/badges/StatusBadge';
import * as Icons from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const INITIAL_RBAC = [
  { role: 'Fleet Manager', fleet: 'Full', driver: 'Full', trip: 'None', fuel: 'None', analytics: 'Full' },
  { role: 'Dispatcher', fleet: 'View', driver: 'None', trip: 'Full', fuel: 'None', analytics: 'None' },
  { role: 'Safety Officer', fleet: 'None', driver: 'Full', trip: 'View', fuel: 'None', analytics: 'None' },
  { role: 'Financial Analyst', fleet: 'View', driver: 'None', trip: 'None', fuel: 'Full', analytics: 'Full' }
];

const INITIAL_AUDITS = [
  { id: 1, user: 'Raven K.', action: 'Dispatched TR007', date: '2026-07-12 11:58', ip: '192.168.1.45', status: 'Success' },
  { id: 2, user: 'John D.', action: 'Attempted Login', date: '2026-07-12 11:15', ip: '192.168.1.92', status: 'Failed' },
  { id: 3, user: 'Admin System', action: 'Updated Role Matrix', date: '2026-07-12 10:30', ip: '192.168.1.1', status: 'Success' }
];

// --- SUB-COMPONENT: GENERAL SETTINGS FORM ---
const SettingsForm = ({ config, onChange, onSave, onReset }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4 text-xs font-semibold">
      
      <div className="space-y-1.5">
        <label className="block text-slate-400 uppercase text-[9px]">Depot / Org Name</label>
        <input
          type="text"
          required
          value={config.depotName}
          onChange={(e) => onChange('depotName', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-slate-400 uppercase text-[9px]">Base Currency</label>
        <input
          type="text"
          required
          value={config.currency}
          onChange={(e) => onChange('currency', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-slate-400 uppercase text-[9px]">Distance Unit</label>
        <select
          value={config.distanceUnit}
          onChange={(e) => onChange('distanceUnit', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
        >
          <option value="Kilometers">Kilometers (km)</option>
          <option value="Miles">Miles (mi)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-slate-400 uppercase text-[9px]">Language</label>
          <select
            value={config.language}
            onChange={(e) => onChange('language', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
          >
            <option value="English">English (US)</option>
            <option value="Hindi">Hindi (IN)</option>
            <option value="Gujarati">Gujarati (IN)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-slate-400 uppercase text-[9px]">Timezone</label>
          <select
            value={config.timezone}
            onChange={(e) => onChange('timezone', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
          >
            <option value="IST">IST (UTC+05:30)</option>
            <option value="UTC">UTC (UTC+00:00)</option>
            <option value="EST">EST (UTC-05:00)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex space-x-2 border-t border-slate-100 dark:border-slate-700/50 mt-5">
        <Button variant="outline" className="w-1/2" onClick={onReset}>
          Reset
        </Button>
        <Button type="submit" className="w-1/2 bg-gradient-to-r from-primary-500 to-indigo-650 text-white font-bold">
          Save changes
        </Button>
      </div>

    </form>
  );
};

// --- SUB-COMPONENT: ROLE-BASED ACCESS MATRIX ---
const RoleMatrix = ({ matrix, onCellChange }) => {
  const options = ['Full', 'View', 'None'];
  
  const getSymbol = (val) => {
    if (val === 'Full') return '✓';
    if (val === 'View') return 'View';
    return '—';
  };

  return (
    <div className="overflow-x-auto w-full border border-slate-150 dark:border-slate-800 rounded-2xl">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50/70 dark:bg-slate-900/30 border-b border-slate-155 dark:border-slate-755 text-slate-400 font-bold uppercase tracking-wider">
            <th className="p-3.5">Role</th>
            <th className="p-3.5">Fleet</th>
            <th className="p-3.5">Driver</th>
            <th className="p-3.5">Trip</th>
            <th className="p-3.5">Fuel/Exp.</th>
            <th className="p-3.5">Analytics</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40 text-slate-700 dark:text-slate-350">
          {matrix.map((row, idx) => (
            <tr key={row.role} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors font-semibold">
              <td className="p-3.5 font-bold text-slate-800 dark:text-slate-100">{row.role}</td>
              
              <td className="p-2">
                <select
                  value={row.fleet}
                  onChange={(e) => onCellChange(idx, 'fleet', e.target.value)}
                  className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-700 text-[11px] font-bold"
                >
                  {options.map(opt => <option key={opt} value={opt}>{getSymbol(opt)}</option>)}
                </select>
              </td>

              <td className="p-2">
                <select
                  value={row.driver}
                  onChange={(e) => onCellChange(idx, 'driver', e.target.value)}
                  className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-700 text-[11px] font-bold"
                >
                  {options.map(opt => <option key={opt} value={opt}>{getSymbol(opt)}</option>)}
                </select>
              </td>

              <td className="p-2">
                <select
                  value={row.trip}
                  onChange={(e) => onCellChange(idx, 'trip', e.target.value)}
                  className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-700 text-[11px] font-bold"
                >
                  {options.map(opt => <option key={opt} value={opt}>{getSymbol(opt)}</option>)}
                </select>
              </td>

              <td className="p-2">
                <select
                  value={row.fuel}
                  onChange={(e) => onCellChange(idx, 'fuel', e.target.value)}
                  className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-700 text-[11px] font-bold"
                >
                  {options.map(opt => <option key={opt} value={opt}>{getSymbol(opt)}</option>)}
                </select>
              </td>

              <td className="p-2">
                <select
                  value={row.analytics}
                  onChange={(e) => onCellChange(idx, 'analytics', e.target.value)}
                  className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-700 text-[11px] font-bold"
                >
                  {options.map(opt => <option key={opt} value={opt}>{getSymbol(opt)}</option>)}
                </select>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- SUB-COMPONENT: AUDIT TABLE ---
const AuditTable = ({ audits }) => {
  return (
    <div className="overflow-x-auto w-full border border-slate-100 dark:border-slate-800 rounded-2xl">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50/70 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
            <th className="p-3.5">Operator</th>
            <th className="p-3.5">Action Executed</th>
            <th className="p-3.5">Timestamp</th>
            <th className="p-3.5">IP Address</th>
            <th className="p-3.5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40 text-slate-700 dark:text-slate-350">
          {audits.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors font-semibold">
              <td className="p-3.5 font-bold text-slate-800 dark:text-slate-105">{a.user}</td>
              <td className="p-3.5 text-slate-655 dark:text-slate-300">{a.action}</td>
              <td className="p-3.5 font-mono text-slate-455">{a.date}</td>
              <td className="p-3.5 font-mono text-slate-455">{a.ip}</td>
              <td className="p-3.5">
                <StatusBadge variant={a.status === 'Success' ? 'green' : 'red'}>
                  {a.status}
                </StatusBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- MAIN CONFIGURATION CONTAINER ---
const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  
  // Tab states
  const [activeTab, setActiveTab] = useState('General'); 

  // General Config states
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('pravaah_general_config');
    return saved ? JSON.parse(saved) : {
      depotName: 'Gandhinagar Depot GJT4',
      currency: 'INR (Rs)',
      distanceUnit: 'Kilometers',
      language: 'English',
      timezone: 'IST'
    };
  });

  // RBAC State
  const [rbacMatrix, setRbacMatrix] = useState(() => {
    const saved = localStorage.getItem('pravaah_rbac_matrix');
    return saved ? JSON.parse(saved) : INITIAL_RBAC;
  });

  // Audit state
  const [audits, setAudits] = useState(INITIAL_AUDITS);

  // Security Form settings
  const [passwordMin, setPasswordMin] = useState(8);
  const [timeoutMin, setTimeoutMin] = useState(30);
  const [enable2FA, setEnable2FA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Appearance settings
  const [compactMode, setCompactMode] = useState(false);
  const [accentColor, setAccentColor] = useState('Blue');
  const [sidebarStyle, setSidebarStyle] = useState('Expanded Default');

  const handleConfigChange = (key, val) => {
    setConfig({ ...config, [key]: val });
  };

  const handleSaveGeneral = () => {
    localStorage.setItem('pravaah_general_config', JSON.stringify(config));
    alert('General settings configurations updated successfully!');
  };

  const handleResetGeneral = () => {
    setConfig({
      depotName: 'Gandhinagar Depot GJT4',
      currency: 'INR (Rs)',
      distanceUnit: 'Kilometers',
      language: 'English',
      timezone: 'IST'
    });
  };

  // RBAC Matrix Cell edit
  const handleMatrixCellEdit = (rowIdx, moduleKey, newVal) => {
    const updated = rbacMatrix.map((row, rIdx) => 
      rIdx === rowIdx ? { ...row, [moduleKey]: newVal } : row
    );
    setRbacMatrix(updated);
    localStorage.setItem('pravaah_rbac_matrix', JSON.stringify(updated));

    // Append to audits
    const newAudit = {
      id: audits.length + 1,
      user: 'Admin System',
      action: `Modified permission cell: ${rbacMatrix[rowIdx].role} -> ${moduleKey} = ${newVal}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ip: '192.168.1.1',
      status: 'Success'
    };
    setAudits([newAudit, ...audits]);
  };

  const tabs = [
    { name: 'General', label: 'General & RBAC', icon: 'Settings' },
    { name: 'Security', label: 'Security Controls', icon: 'Lock' },
    { name: 'Appearance', label: 'Theme & Aesthetics', icon: 'Palette' },
    { name: 'Audit Logs', label: 'System Audit Trail', icon: 'Activity' }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="System Settings"
        description="Configure organization specifications, role permissions, theme variables, and view audit files."
        breadcrumbs={[{ label: 'Settings' }]}
      />

      {/* 2. TABS NAVIGATION */}
      <div className="flex border-b border-slate-205 dark:border-slate-700/60 pb-1 flex-wrap gap-2 text-xs font-semibold">
        {tabs.map((tab) => {
          const IconComp = Icons[tab.icon] || Icons.Settings;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center space-x-2 px-4.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                activeTab === tab.name
                  ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 border-slate-200 dark:border-slate-700 font-extrabold shadow-sm'
                  : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-205 border-transparent'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. DYNAMIC CONTENT CARD */}
      <div className="transition-all duration-300">
        
        {/* Tab: General & RBAC */}
        {activeTab === 'General' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: General Form */}
            <div className="lg:col-span-5">
              <Card title="General config Settings">
                <SettingsForm
                  config={config}
                  onChange={handleConfigChange}
                  onSave={handleSaveGeneral}
                  onReset={handleResetGeneral}
                />
              </Card>
            </div>

            {/* Right: RBAC Permission Matrix */}
            <div className="lg:col-span-7">
              <Card title="Role-Based Access Control (RBAC)" subtitle="Full, View, or None access levels">
                <RoleMatrix 
                  matrix={rbacMatrix} 
                  onCellChange={handleMatrixCellEdit} 
                />
              </Card>
            </div>

          </div>
        )}

        {/* Tab: Security Controls */}
        {activeTab === 'Security' && (
          <div className="max-w-2xl mx-auto">
            <Card title="Security Parameters" subtitle="Enforce operator protection policies">
              <div className="space-y-5 text-xs font-semibold py-2">
                
                {/* Min Password Length */}
                <div className="flex justify-between items-center border-b pb-3.5">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Password Policy</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Define minimum character limits for credentials.</p>
                  </div>
                  <input
                    type="number"
                    value={passwordMin}
                    onChange={(e) => setPasswordMin(Number(e.target.value))}
                    className="w-16 px-2.5 py-1.5 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-205 dark:border-slate-700 text-center font-mono font-bold"
                  />
                </div>

                {/* Session Timeout */}
                <div className="flex justify-between items-center border-b pb-3.5">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Session Timeout (Minutes)</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Disconnect operator terminal automatically when idle.</p>
                  </div>
                  <input
                    type="number"
                    value={timeoutMin}
                    onChange={(e) => setTimeoutMin(Number(e.target.value))}
                    className="w-16 px-2.5 py-1.5 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-205 dark:border-slate-700 text-center font-mono font-bold"
                  />
                </div>

                {/* Two-Factor Authentication (2FA) */}
                <div className="flex justify-between items-center border-b pb-3.5">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">2-Factor Authentication (2FA)</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Enforce mobile token verification checks during sign in.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enable2FA}
                      onChange={(e) => setEnable2FA(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-205 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                {/* Login Alerts */}
                <div className="flex justify-between items-center pb-1">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Login Activity Alerts</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-505 font-semibold mt-0.5">Send alert emails for successful connections from foreign IPs.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={loginAlerts}
                      onChange={(e) => setLoginAlerts(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-205 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button onClick={() => alert('Security configs saved!')}>Save Security Parameters</Button>
                </div>

              </div>
            </Card>
          </div>
        )}

        {/* Tab: Appearance */}
        {activeTab === 'Appearance' && (
          <div className="max-w-2xl mx-auto">
            <Card title="Aesthetics & Theme selector" subtitle="Configure system accents and sidebar states">
              <div className="space-y-5 text-xs font-semibold py-2">
                
                <div className="flex justify-between items-center border-b pb-3.5">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Dark Mode Interface</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-505 font-semibold mt-0.5">Toggle interface mode manually.</p>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className="px-4 py-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-205 dark:border-slate-700 transition-colors font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1.5"
                  >
                    <span>{theme === 'dark' ? 'Dark theme active' : 'Light theme active'}</span>
                  </button>
                </div>

                <div className="flex justify-between items-center border-b pb-3.5">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Compact Layout Mode</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-505 font-semibold mt-0.5">Reduce padding parameters inside tables and cards.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={compactMode}
                      onChange={(e) => setCompactMode(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-205 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center border-b pb-3.5">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">System Accent Highlight</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-505 font-semibold mt-0.5">Select accent highlights for badges and borders.</p>
                  </div>
                  <select
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="px-3.5 py-1.5 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-205 dark:border-slate-700 font-bold"
                  >
                    <option value="Blue">Royal Blue (Default)</option>
                    <option value="Indigo">Linear Indigo</option>
                    <option value="Emerald">Odoo Emerald</option>
                    <option value="Amber">Warning Amber</option>
                  </select>
                </div>

                <div className="flex justify-between items-center pb-1">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Sidebar Default state</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-505 font-semibold mt-0.5">Select initial width style for navigation.</p>
                  </div>
                  <select
                    value={sidebarStyle}
                    onChange={(e) => setSidebarStyle(e.target.value)}
                    className="px-3.5 py-1.5 border rounded-xl bg-slate-55 dark:bg-slate-900 border-slate-205 dark:border-slate-700 font-bold"
                  >
                    <option value="Expanded Default">Expanded (Full labels)</option>
                    <option value="Collapsed Icons">Collapsed (Icons only)</option>
                  </select>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button onClick={() => alert('Appearance settings updated!')}>Save Aesthetics</Button>
                </div>

              </div>
            </Card>
          </div>
        )}

        {/* Tab: System Audit Trail */}
        {activeTab === 'Audit Logs' && (
          <Card title="Recent Activity log" subtitle="Audit trails for operations dashboard changes">
            <AuditTable audits={audits} />
          </Card>
        )}

      </div>

    </div>
  );
};

export default Settings;
export { SettingsForm, RoleMatrix, AuditTable };
