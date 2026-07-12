import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const Notifications = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Passenger Notifications"
        description="Broadcast emergency notifications and delay logs directly to commuter devices."
        breadcrumbs={[{ label: 'Notifications' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Alert Composer">
          <form className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Title</label>
              <input type="text" className="w-full px-3 py-2 border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Message</label>
              <textarea rows="3" className="w-full px-3 py-2 border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl resize-none"></textarea>
            </div>
            <Button className="w-full">Dispatch Alert</Button>
          </form>
        </Card>

        <Card className="lg:col-span-2" title="Notification Log Archives">
          <EmptyState 
            icon="History" 
            title="Empty Alerts Feed" 
            description="Broadcast archives will list here." 
          />
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
