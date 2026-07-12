import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Button from '../../components/forms/Button';
import SearchBar from '../../components/forms/SearchBar';
import * as Icons from 'lucide-react';

const INITIAL_LOGS = [
  { id: 'M-501', vehicle: 'VAN-05', service: 'Oil Change', cost: 2500, status: 'In Workshop', date: '2026-07-07' },
  { id: 'M-502', vehicle: 'TRUCK-11', service: 'Engine Repair', cost: 18000, status: 'Completed', date: '2026-07-06' },
  { id: 'M-503', vehicle: 'MINI-03', service: 'Tyre Replace', cost: 6200, status: 'In Workshop', date: '2026-07-05' }
];

// --- SUB-COMPONENT: STATUS BADGE ---
const MaintenanceStatusBadge = ({ status }) => {
  const styles = {
    'Completed': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30',
    'In Workshop': 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30',
    'Scheduled': 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${styles[status] || styles['Scheduled']}`}>
      {status}
    </span>
  );
};

// --- SUB-COMPONENT: TIMELINE GRAPH ---
const MaintenanceTimeline = ({ status }) => {
  const isInWorkshop = status === 'In Workshop';

  return (
    <div className="space-y-4 pt-3.5 border-t border-slate-100 dark:border-slate-700/50">
      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
        Maintenance Lifecycle
      </p>
      
      <div className="space-y-3 px-2 font-semibold text-xs text-slate-650 dark:text-slate-355">
        
        {/* Available -> In Workshop */}
        <div className="flex items-center justify-between">
          <span className="text-emerald-500 font-bold">Available</span>
          <div className="flex-1 flex items-center justify-center mx-3 relative">
            <span className="text-[9px] text-slate-400 absolute -top-3.5">creating active record</span>
            <div className="h-0.5 bg-slate-200 dark:bg-slate-700 w-full flex items-center justify-end">
              <Icons.ChevronRight className="w-3.5 h-3.5 text-slate-305 dark:text-slate-655 translate-x-1" />
            </div>
          </div>
          <span className="text-amber-500 font-bold">In Workshop</span>
        </div>

        {/* In Workshop -> Available */}
        <div className="flex items-center justify-between">
          <span className="text-amber-500 font-bold">In Workshop</span>
          <div className="flex-1 flex items-center justify-center mx-3 relative">
            <span className="text-[9px] text-slate-400 absolute -top-3.5">closing record (set retired)</span>
            <div className="h-0.5 bg-slate-200 dark:bg-slate-700 w-full flex items-center justify-end">
              <Icons.ChevronRight className="w-3.5 h-3.5 text-slate-305 dark:text-slate-655 translate-x-1" />
            </div>
          </div>
          <span className="text-emerald-500 font-bold">Available</span>
        </div>

      </div>

      {/* ⚠️ WORKSHOP DURATION DISPATCH BLOCKED WARNING */}
      {isInWorkshop && (
        <div className="p-3 bg-amber-50 dark:bg-amber-955/20 border border-amber-100 dark:border-amber-900/30 rounded-xl text-[11px] leading-relaxed font-semibold text-amber-700 dark:text-amber-400 flex items-center space-x-2.5 animate-pulse">
          <Icons.ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-500" />
          <span>Note: In Workshop vehicles are removed from the dispatch pool.</span>
        </div>
      )}

    </div>
  );
};

// --- SUB-COMPONENT: LOG FORM ---
const MaintenanceForm = ({ onSave, vehicles }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [serviceType, setServiceType] = useState('Oil Change');
  const [cost, setCost] = useState('2500');
  const [date, setDate] = useState('2026-07-12');
  const [status, setStatus] = useState('In Workshop');

  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0].name);
    }
  }, [vehicles, selectedVehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVehicle || !serviceType) return;

    onSave({
      vehicle: selectedVehicle,
      service: serviceType,
      cost: Number(cost) || 0,
      date,
      status
    });

    // Reset Form fields
    setServiceType('');
    setCost('');
    setDate('2026-07-12');
    setStatus('In Workshop');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
      
      <div className="space-y-1.5">
        <label className="block text-slate-400 uppercase text-[9px]">Vehicle Selection</label>
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
        >
          {vehicles.map(v => (
            <option key={v.regNo} value={v.name}>{v.name} ({v.regNo})</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-slate-400 uppercase text-[9px]">Service Type</label>
        <input
          type="text"
          required
          placeholder="e.g. Oil Change"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-slate-400 uppercase text-[9px]">Estimated Cost (₹)</label>
          <input
            type="number"
            required
            placeholder="2500"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-slate-400 uppercase text-[9px]">Service Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-slate-400 uppercase text-[9px]">Service Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
        >
          <option value="In Workshop">In Workshop</option>
          <option value="Completed">Completed</option>
          <option value="Scheduled">Scheduled</option>
        </select>
      </div>

      <div className="pt-2 flex space-x-2">
        <Button variant="secondary" className="w-1/2" onClick={handleCancelForm => { setServiceType(''); setCost(''); }}>
          Reset
        </Button>
        <Button type="submit" className="w-1/2 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-bold">
          Save Record
        </Button>
      </div>

      <MaintenanceTimeline status={status} />

    </form>
  );
};

// --- SUB-COMPONENT: SERVICE LOGS TABLE ---
const MaintenanceTable = ({ logs, onDelete }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50/70 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
            <th className="p-4">Vehicle</th>
            <th className="p-4">Service</th>
            <th className="p-4">Cost (₹)</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40 text-slate-700 dark:text-slate-350">
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors font-semibold">
                <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-100">{log.vehicle}</td>
                <td className="p-4">{log.service}</td>
                <td className="p-4 font-mono">{log.cost.toLocaleString()}</td>
                <td className="p-4">
                  <MaintenanceStatusBadge status={log.status} />
                </td>
                <td className="p-4 text-slate-400 font-mono">{log.date}</td>
                <td className="p-4">
                  <button 
                    onClick={() => onDelete(log.id)}
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-955/15 p-1 rounded transition-colors"
                  >
                    <Icons.Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-8 text-center text-slate-400 font-semibold">
                No maintenance records match active criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// --- MAIN MAINTENANCE COMPONENT ---
const Maintenance = () => {
  // Sync registry vehicles from local storage
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('pravaah_registry_vehicles');
    return saved ? JSON.parse(saved) : [];
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('pravaah_maintenance_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Filters
  const [search, setSearch] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortByDate, setSortByDate] = useState('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Persist logs
  useEffect(() => {
    localStorage.setItem('pravaah_maintenance_logs', JSON.stringify(logs));
  }, [logs]);

  // Handler: Save Maintenance Record
  const handleSaveRecord = (newLog) => {
    const logId = `M-${Math.floor(100 + Math.random() * 900)}`;
    const fullLog = { id: logId, ...newLog };
    const updatedLogs = [fullLog, ...logs];
    setLogs(updatedLogs);

    // Dynamic Availability update
    const targetStatus = newLog.status === 'In Workshop' ? 'In Shop' : 'Available';
    const updatedVehicles = vehicles.map(v => 
      v.name === newLog.vehicle ? { ...v, status: targetStatus } : v
    );

    setVehicles(updatedVehicles);
    localStorage.setItem('pravaah_registry_vehicles', JSON.stringify(updatedVehicles));
  };

  // Handler: Delete Record
  const handleDeleteRecord = (logId) => {
    const log = logs.find(l => l.id === logId);
    if (!log) return;

    // Reset vehicle status to Available upon removing the shop record
    const updatedVehicles = vehicles.map(v => 
      v.name === log.vehicle ? { ...v, status: 'Available' } : v
    );
    setVehicles(updatedVehicles);
    localStorage.setItem('pravaah_registry_vehicles', JSON.stringify(updatedVehicles));

    setLogs(logs.filter(l => l.id !== logId));
  };

  // Get unique vehicle names for filter dropdown
  const uniqueVehicles = Array.from(new Set(logs.map(l => l.vehicle)));

  // Filter & Sort logs
  const filteredLogs = logs
    .filter((l) => {
      const matchesSearch = l.service.toLowerCase().includes(search.toLowerCase()) || 
                            l.vehicle.toLowerCase().includes(search.toLowerCase());
      const matchesVehicle = filterVehicle === 'All' || l.vehicle === filterVehicle;
      const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
      
      return matchesSearch && matchesVehicle && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortByDate === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Fleet Maintenance Desk"
        description="Verify service logs, repair rosters, and workshop status metrics."
        breadcrumbs={[{ label: 'Maintenance' }]}
      />

      {/* 2. SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Maintenance Form */}
        <div className="lg:col-span-5">
          <Card title="Log Service Record">
            <MaintenanceForm 
              onSave={handleSaveRecord} 
              vehicles={vehicles} 
            />
          </Card>
        </div>

        {/* RIGHT COLUMN: Service Logs Table & Filters */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Toolbar Filters */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-150 dark:border-slate-700/60 shadow-sm flex flex-wrap gap-3 items-center">
            
            <div className="flex-1 min-w-[200px]">
              <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service, vehicle name..."
              />
            </div>

            <select
              value={filterVehicle}
              onChange={(e) => setFilterVehicle(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold focus:outline-none"
            >
              <option value="All">Vehicles: All</option>
              {uniqueVehicles.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold focus:outline-none"
            >
              <option value="All">Statuses: All</option>
              <option value="In Workshop">In Workshop</option>
              <option value="Completed">Completed</option>
              <option value="Scheduled">Scheduled</option>
            </select>

            <button
              onClick={() => setSortByDate(sortByDate === 'desc' ? 'asc' : 'desc')}
              className="p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-105 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
              title="Sort by Date"
            >
              <Icons.SortDesc className="w-3.5 h-3.5" />
              <span>Date: {sortByDate === 'desc' ? 'Desc' : 'Asc'}</span>
            </button>

          </div>

          {/* Table Card */}
          <Card title="Service Logs Board" noPadding>
            <MaintenanceTable 
              logs={paginatedLogs} 
              onDelete={handleDeleteRecord} 
            />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/10">
                <span className="text-xs text-slate-455 font-semibold">
                  Page {currentPage} of {totalPages} ({filteredLogs.length} logs total)
                </span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="xs" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xs" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>

        </div>

      </div>

    </div>
  );
};

export default Maintenance;
