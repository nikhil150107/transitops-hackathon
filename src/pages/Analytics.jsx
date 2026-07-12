import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transit Analytics Hub"
        description="Comprehensive reports on fleet operations, occupancy spikes, and carbon emissions."
        breadcrumbs={[{ label: 'Analytics' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Ridership Timeline Metrics">
          <EmptyState icon="BarChart3" title="Timeline Chart" description="Recharts ridership line charts will render here." />
        </Card>
        <Card title="Daily Occupancy Breakdown">
          <EmptyState icon="PieChart" title="Pie Distribution" description="Recharts occupancy percentages will render here." />
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
