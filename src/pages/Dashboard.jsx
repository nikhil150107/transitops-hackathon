import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import * as Icons from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Command Center"
        description="Real-time transit dashboard and control parameters for Saarthi."
        breadcrumbs={[]}
        action={
          <Button variant="outline" size="sm" iconLeft="RefreshCw">
            Sync Telemetry
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Active Transit Fleet" accentColor="blue">
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">7 / 8</p>
          <p className="text-xs text-slate-400 mt-1">Vehicles sending active telemetry streams.</p>
        </Card>
        <Card title="Unresolved Incidents" accentColor="yellow">
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">3</p>
          <p className="text-xs text-slate-400 mt-1">Requires active dispatch intervention.</p>
        </Card>
        <Card title="System Fleet Uptime" accentColor="green">
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">99.8%</p>
          <p className="text-xs text-slate-400 mt-1">Operational API servers health status.</p>
        </Card>
      </div>

      <Card title="Platform Workspace" subtitle="Starter workspace view">
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
          <Icons.LayoutDashboard className="w-12 h-12 stroke-[1.5] text-slate-350 mb-3" />
          <p className="text-xs font-semibold">Saarthi Dashboard Shell. Ready for visualization features.</p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
