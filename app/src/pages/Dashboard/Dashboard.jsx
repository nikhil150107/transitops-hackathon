import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Button from '../../components/forms/Button';
import StatusBadge from '../../components/badges/StatusBadge';
import Table from '../../components/tables/Table';
import * as Icons from 'lucide-react';
import { 
  MOCK_KPI_STATS, 
  MOCK_VEHICLE_STATUS_ANALYTICS, 
  MOCK_TRIPS, 
  FILTER_OPTIONS 
} from '../../data/mockData';

const Dashboard = () => {
  // Filter states
  const [vehicleType, setVehicleType] = useState('All');
  const [vehicleStatus, setVehicleStatus] = useState('All');
  const [region, setRegion] = useState('All');
  
  // Local filtered data
  const [filteredTrips, setFilteredTrips] = useState(MOCK_TRIPS);

  // Sync filters to trips list
  useEffect(() => {
    const filtered = MOCK_TRIPS.filter((t) => {
      const matchType = vehicleType === 'All' || t.vehicleType === vehicleType;
      const matchStatus = vehicleStatus === 'All' || t.status === vehicleStatus;
      const matchRegion = region === 'All' || t.region === region;
      
      return matchType && matchStatus && matchRegion;
    });
    setFilteredTrips(filtered);
  }, [vehicleType, vehicleStatus, region]);

  // Headers for Table
  const tableHeaders = ['Trip ID', 'Vehicle', 'Driver', 'Status', 'ETA'];

  // Table row renderer
  const renderRow = (trip, idx) => (
    <tr key={trip.tripId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors text-xs font-semibold text-slate-750 dark:text-slate-300">
      <td className="p-4 font-bold text-slate-800 dark:text-slate-105">{trip.tripId}</td>
      <td className="p-4 font-mono">{trip.vehicle}</td>
      <td className="p-4">{trip.driver}</td>
      <td className="p-4">
        <StatusBadge>{trip.status}</StatusBadge>
      </td>
      <td className="p-4 text-slate-500 dark:text-slate-400">{trip.eta}</td>
    </tr>
  );

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Command Dashboard"
        description="Real-time logistics dispatch logs, fleet utility levels, and operational metrics."
        breadcrumbs={[]}
        action={
          <Button variant="outline" size="sm" iconLeft="RefreshCw" onClick={() => {
            setVehicleType('All');
            setVehicleStatus('All');
            setRegion('All');
          }}>
            Reset Filters
          </Button>
        }
      />

      {/* 2. TOP FILTERS ROW */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-150 dark:border-slate-700/60 shadow-sm">
        <p className="text-[10px] font-bold uppercase text-slate-450 dark:text-slate-500 tracking-wider mb-2.5">
          Workspace Filters
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          
          {/* Vehicle Type Filter */}
          <div className="flex flex-col space-y-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Vehicle Type</span>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {FILTER_OPTIONS.vehicleTypes.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Status Filter */}
          <div className="flex flex-col space-y-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Vehicle Status</span>
            <select
              value={vehicleStatus}
              onChange={(e) => setVehicleStatus(e.target.value)}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {FILTER_OPTIONS.vehicleStatuses.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex flex-col space-y-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Region Corridor</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {FILTER_OPTIONS.regions.map((r) => (
                <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* 3. KPI CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        
        <Card noPadding accentColor="blue" className="p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Active Vehicles</span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">{MOCK_KPI_STATS.activeVehicles}</h3>
        </Card>

        <Card noPadding accentColor="green" className="p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 leading-none">Available Vehicles</span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">{MOCK_KPI_STATS.availableVehicles}</h3>
        </Card>

        <Card noPadding accentColor="yellow" className="p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 leading-none">In Maintenance</span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">0{MOCK_KPI_STATS.vehiclesInMaintenance}</h3>
        </Card>

        <Card noPadding accentColor="blue" className="p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 leading-none">Active Trips</span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">{MOCK_KPI_STATS.activeTrips}</h3>
        </Card>

        <Card noPadding accentColor="blue" className="p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 leading-none">Pending Trips</span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">0{MOCK_KPI_STATS.pendingTrips}</h3>
        </Card>

        <Card noPadding accentColor="blue" className="p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 leading-none">Drivers On Duty</span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">{MOCK_KPI_STATS.driversOnDuty}</h3>
        </Card>

        <Card noPadding accentColor="green" className="p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 leading-none">Fleet Utilization</span>
          <h3 className="text-2xl font-black text-emerald-500 mt-2">{MOCK_KPI_STATS.fleetUtilization}%</h3>
        </Card>

      </div>

      {/* 4. SPLIT SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Recent Trips Table (2/3 width) */}
        <div className="lg:col-span-2">
          <Card title="Recent Trips Logs" subtitle="Live dispatch coordinates" noPadding>
            <Table
              headers={tableHeaders}
              data={filteredTrips}
              renderRow={renderRow}
              emptyMessage="No active dispatches match the selected filters."
            />
          </Card>
        </div>

        {/* Right Column: Vehicle Status Analytics (1/3 width) */}
        <div>
          <Card title="Vehicle Status Distribution" subtitle="Active fleet allocation metrics">
            <div className="space-y-5 py-2">
              {MOCK_VEHICLE_STATUS_ANALYTICS.map((item, idx) => {
                const percent = Math.round((item.count / item.max) * 100);
                return (
                  <div key={idx} className="space-y-1.5 text-xs font-semibold">
                    <div className="flex justify-between items-center text-slate-650 dark:text-slate-355">
                      <span className="font-bold">{item.status}</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100">{item.count}</span>
                    </div>
                    
                    {/* Horizontal progress bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-3 rounded-full overflow-hidden border border-slate-200/20 shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
