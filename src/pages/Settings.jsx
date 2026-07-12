import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Settings = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure API parameters, refresh telemetry frequencies, and optimize thresholds."
        breadcrumbs={[{ label: 'Settings' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-semibold">
        <Card title="Database Maintenance">
          <p className="text-slate-450 dark:text-slate-400 mb-4 leading-relaxed font-semibold">Restore mock transport telemetry data back to default factory parameters.</p>
          <Button variant="danger" className="w-full">Factory Reset Database</Button>
        </Card>

        <Card title="Interface & Threshold Config" className="lg:col-span-2">
          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Axios API Endpoint URL</label>
              <input type="text" defaultValue="https://api.saarthi.gov.in/v1" className="w-full px-3 py-2 border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl font-mono" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Telemetry Refresh Frequency</label>
              <select className="w-full px-3 py-2 border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <option value="10">Every 10 seconds (Standard)</option>
                <option value="30">Every 30 seconds</option>
              </select>
            </div>
            <Button>Save Settings</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
