import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const Incidents = () => {
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const mockIncidents = [
    { id: 'INC-2026-001', type: 'Accident', location: 'AIIMS Ring Road Flyover', severity: 'High', status: 'In Progress' },
    { id: 'INC-2026-002', type: 'Breakdown', location: 'Dhaula Kuan flyover', severity: 'Critical', status: 'Dispatched' },
    { id: 'INC-2026-003', type: 'Congestion', location: 'Gurugram-Delhi Border Toll', severity: 'Medium', status: 'Reported' },
  ];

  const headers = ['Code', 'Type', 'Location', 'Severity', 'Status', 'Actions'];

  const renderRow = (inc, idx) => (
    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{inc.id}</td>
      <td className="p-4 font-semibold">{inc.type}</td>
      <td className="p-4 truncate max-w-[150px]">{inc.location}</td>
      <td className="p-4">
        <StatusBadge>{inc.severity}</StatusBadge>
      </td>
      <td className="p-4">
        <StatusBadge>{inc.status}</StatusBadge>
      </td>
      <td className="p-4">
        <Button variant="outline" size="xs">Inspect</Button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Logs"
        description="Review breakdown files, traffic bottlenecks, and dispatch rescue teams."
        breadcrumbs={[{ label: 'Incidents' }]}
        action={
          <Button onClick={() => setReportModalOpen(true)} size="sm" iconLeft="Plus">
            Report Incident
          </Button>
        }
      />

      <Card noPadding>
        <Table
          headers={headers}
          data={mockIncidents}
          renderRow={renderRow}
        />
      </Card>

      {/* Report Modal Shell */}
      <Modal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report New Incident"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setReportModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setReportModalOpen(false)}>Submit</Button>
          </>
        }
      >
        <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">Starter form parameters can be mapped here.</p>
      </Modal>
    </div>
  );
};

export default Incidents;
