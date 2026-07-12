import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const Emergency = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="SOS Emergency Console"
        description="High-priority alarm dashboard to dispatch emergency police, fire, or ambulances."
        breadcrumbs={[{ label: 'Emergency' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Active SOS Alarms" className="border-l-4 border-l-rose-500">
          <EmptyState 
            icon="Activity" 
            title="All Channels Clear" 
            description="No active emergency alarms triggered from transit units." 
          />
        </Card>

        <Card title="Rescue Dispatch Control" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="danger" iconLeft="ShieldAlert">Dispatch Police Unit</Button>
            <Button variant="danger" iconLeft="Activity">Dispatch Ambulance</Button>
            <Button variant="danger" iconLeft="Flame">Dispatch CP Fire Brigade</Button>
            <Button variant="outline" iconLeft="Wrench">Dispatch Road Assistance</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Emergency;
