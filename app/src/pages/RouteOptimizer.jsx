import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const RouteOptimizer = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Route Optimizer"
        description="Predict congestions, construct alternative paths, and verify fuel metrics."
        breadcrumbs={[{ label: 'Route Optimizer' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[480px]">
        <div className="space-y-4 overflow-y-auto pr-1">
          <Card title="Sector 62 to CP (Route 412)" accentColor="indigo">
            <p className="text-xs text-slate-500 mb-4">Heavy delays. AI suggests re-routing via Barapullah Bypass.</p>
            <Button size="xs" variant="primary" iconLeft="Sparkles">Optimize Route</Button>
          </Card>
        </div>

        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-center relative overflow-hidden">
          <EmptyState 
            icon="Cpu" 
            title="Alternative Route Map Canvas" 
            description="Active routing overlays will render here." 
          />
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizer;
