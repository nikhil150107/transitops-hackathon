import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Table from '../../components/tables/Table';
import StatusBadge from '../../components/badges/StatusBadge';
import Button from '../../components/forms/Button';
import SearchBar from '../../components/forms/SearchBar';
import Modal from '../../components/dialogs/Modal';
import * as Icons from 'lucide-react';

const INITIAL_DRIVERS = [
  { name: 'Alex', licenseNo: 'DL-88213', category: 'LMV', expiry: '12/2028', contact: '9876543210', tripCompletion: 96, safetyScore: 95, status: 'Available' },
  { name: 'John', licenseNo: 'DL-44120', category: 'HMV', expiry: '03/2025 EXPIRED', contact: '9822012345', tripCompletion: 81, safetyScore: 70, status: 'Suspended' },
  { name: 'Priya', licenseNo: 'DL-77031', category: 'LMV', expiry: '08/2029', contact: '9911044321', tripCompletion: 99, safetyScore: 98, status: 'On Trip' },
  { name: 'Rajesh', licenseNo: 'DL-90045', category: 'HMV', expiry: '01/2027', contact: '9744099887', tripCompletion: 88, safetyScore: 90, status: 'Off Duty' }
];

const Drivers = () => {
  // Local storage binding
  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('pravaah_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All'); // All, Available, On Trip, Off Duty, Suspended

  // Modal open states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Form states (Add Driver)
  const [formName, setFormName] = useState('');
  const [formLicenseNo, setFormLicenseNo] = useState('');
  const [formCategory, setFormCategory] = useState('LMV');
  const [formExpiry, setFormExpiry] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formTripCompletion, setFormTripCompletion] = useState('100');
  const [formSafetyScore, setFormSafetyScore] = useState('100');
  const [formStatus, setFormStatus] = useState('Available');
  const [formError, setFormError] = useState('');

  // Persist drivers list
  useEffect(() => {
    localStorage.setItem('pravaah_drivers', JSON.stringify(drivers));
  }, [drivers]);

  // Search and status filter logic
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.licenseNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = activeStatusFilter === 'All' || d.status === activeStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Add Driver handler
  const handleAddDriver = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formName || !formLicenseNo || !formExpiry || !formContact) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const newDriver = {
      name: formName.trim(),
      licenseNo: formLicenseNo.trim().toUpperCase(),
      category: formCategory,
      expiry: formExpiry.trim(),
      contact: formContact.trim(),
      tripCompletion: Number(formTripCompletion) || 100,
      safetyScore: Number(formSafetyScore) || 100,
      status: formStatus
    };

    setDrivers([...drivers, newDriver]);
    setAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormLicenseNo('');
    setFormCategory('LMV');
    setFormExpiry('');
    setFormContact('');
    setFormTripCompletion('100');
    setFormSafetyScore('100');
    setFormStatus('Available');
    setFormError('');
  };

  // Check if a driver has an expired license or is suspended
  const isDriverBlocked = (driver) => {
    const isExpired = driver.expiry.toLowerCase().includes('expired');
    const isSuspended = driver.status === 'Suspended';
    return isExpired || isSuspended;
  };

  const tableHeaders = [
    'Driver Name',
    'License Number',
    'License Category',
    'Expiry Date',
    'Contact Number',
    'Trip Completion %',
    'Safety Score',
    'Current Status',
    'Actions'
  ];

  const renderRow = (d, idx) => (
    <tr 
      key={d.licenseNo} 
      className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors text-xs font-semibold text-slate-750 dark:text-slate-355 ${
        isDriverBlocked(d) ? 'bg-rose-50/10 dark:bg-rose-955/5' : ''
      }`}
    >
      <td className="p-4 font-bold text-slate-800 dark:text-slate-105 flex items-center space-x-2">
        <span>{d.name}</span>
        {isDriverBlocked(d) && (
          <Icons.ShieldAlert className="w-3.5 h-3.5 text-rose-500" title="Blocked from trip assignment" />
        )}
      </td>
      <td className="p-4 font-mono">{d.licenseNo}</td>
      <td className="p-4">{d.category}</td>
      <td className="p-4">
        <span className={d.expiry.toLowerCase().includes('expired') ? 'text-rose-500 font-bold' : ''}>
          {d.expiry}
        </span>
      </td>
      <td className="p-4">{d.contact}</td>
      <td className="p-4 font-mono">{d.tripCompletion}%</td>
      <td className="p-4">
        <span className={`px-2 py-0.5 rounded font-mono ${
          d.safetyScore >= 90 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' :
          d.safetyScore >= 80 ? 'text-blue-600 dark:text-blue-400 bg-blue-55 dark:bg-blue-500/10' :
          'text-rose-600 dark:text-rose-400 bg-rose-55 dark:bg-rose-500/10'
        }`}>
          {d.safetyScore}%
        </span>
      </td>
      <td className="p-4">
        <StatusBadge>{d.status}</StatusBadge>
      </td>
      <td className="p-4">
        <Button 
          variant="outline" 
          size="xs" 
          onClick={() => { setSelectedDriver(d); setViewModalOpen(true); }}
        >
          View File
        </Button>
      </td>
    </tr>
  );

  const statusChips = [
    { label: 'All', value: 'All', color: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-250 border-slate-300' },
    { label: 'Available', value: 'Available', color: 'bg-emerald-500 text-white border-emerald-600' },
    { label: 'On Trip', value: 'On Trip', color: 'bg-blue-500 text-white border-blue-600' },
    { label: 'Off Duty', value: 'Off Duty', color: 'bg-slate-500 text-white border-slate-650' },
    { label: 'Suspended', value: 'Suspended', color: 'bg-amber-500 text-white border-amber-600' }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Drivers & Safety Profiles"
        description="Verify driver license validity, safety indicators, trip statistics, and operational availability status."
        breadcrumbs={[{ label: 'Drivers' }]}
        action={
          <Button onClick={() => { resetForm(); setAddModalOpen(true); }} size="sm" iconLeft="UserPlus">
            Add Driver
          </Button>
        }
      />

      {/* 2. TOP TOOLBAR SEARCH */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-150 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drivers by name, license no..."
          />
        </div>
      </div>

      {/* 3. MAIN TABLE CARD */}
      <Card noPadding>
        <Table
          headers={tableHeaders}
          data={filteredDrivers}
          renderRow={renderRow}
          emptyMessage="No drivers match the active search or status criteria."
        />
      </Card>

      {/* 4. CHIPS TOGGLE ROW */}
      <div className="space-y-2.5">
        <p className="text-[10px] font-bold uppercase text-slate-455 dark:text-slate-500 tracking-wider">
          Filter Status (Toggle Stat)
        </p>
        <div className="flex flex-wrap gap-2">
          {statusChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setActiveStatusFilter(chip.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                activeStatusFilter === chip.value
                  ? `${chip.color} shadow-sm scale-102`
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-205 dark:border-slate-700 hover:bg-slate-55'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. BUSINESS RULE WARNING BANNER */}
      <div className="flex items-center space-x-2 px-2 text-xs font-semibold text-rose-600 dark:text-rose-500 bg-rose-50/20 dark:bg-rose-955/5 p-3.5 rounded-2xl border border-rose-105/30 dark:border-rose-900/10">
        <Icons.ShieldAlert className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 animate-pulse" />
        <span>Rule: Drivers with expired licenses or suspended status cannot be assigned to trips.</span>
      </div>

      {/* 6. ADD DRIVER MODAL */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Driver"
      >
        {formError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-455 text-xs font-semibold flex items-center space-x-2 mb-3">
            <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}
        <form onSubmit={handleAddDriver} className="space-y-4 text-xs font-semibold">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Driver Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">License Number</label>
              <input
                type="text"
                required
                placeholder="e.g. DL-88213"
                value={formLicenseNo}
                onChange={(e) => setFormLicenseNo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">License Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
              >
                <option value="LMV">LMV (Light Motor Vehicle)</option>
                <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                <option value="MCWG">MCWG (Motorcycle with gear)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Expiry Date (MM/YYYY)</label>
              <input
                type="text"
                required
                placeholder="e.g. 12/2028"
                value={formExpiry}
                onChange={(e) => setFormExpiry(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5 col-span-2">
              <label className="block text-slate-400 uppercase text-[9px]">Contact Number</label>
              <input
                type="text"
                required
                placeholder="9876543210"
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Trip Completion (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formTripCompletion}
                onChange={(e) => setFormTripCompletion(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Safety Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formSafetyScore}
                onChange={(e) => setFormSafetyScore(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="pt-2 flex space-x-2">
            <Button variant="outline" className="w-1/2" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="w-1/2">Register Driver</Button>
          </div>

        </form>
      </Modal>

      {/* 7. VIEW DRIVER DETAILS MODAL */}
      <Modal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Driver File Details"
      >
        {selectedDriver && (
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Driver Name</p>
                <p className="text-sm font-extrabold text-slate-850 dark:text-slate-105">{selectedDriver.name}</p>
              </div>
              <StatusBadge>{selectedDriver.status}</StatusBadge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">License Number</p>
                <p className="text-slate-700 dark:text-slate-205 mt-0.5 font-mono">{selectedDriver.licenseNo}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Category</p>
                <p className="text-slate-700 dark:text-slate-205 mt-0.5">{selectedDriver.category}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">License Expiry</p>
                <p className={`mt-0.5 ${selectedDriver.expiry.toLowerCase().includes('expired') ? 'text-rose-500 font-bold' : 'text-slate-705 dark:text-slate-205'}`}>
                  {selectedDriver.expiry}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Contact Number</p>
                <p className="text-slate-700 dark:text-slate-205 mt-0.5">{selectedDriver.contact}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Trip Completion Rate</p>
                <p className="text-slate-755 dark:text-slate-205 mt-0.5 font-mono">{selectedDriver.tripCompletion}%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Safety Rating Score</p>
                <p className="text-slate-755 dark:text-slate-205 mt-0.5 font-mono">{selectedDriver.safetyScore}%</p>
              </div>
            </div>

            {isDriverBlocked(selectedDriver) && (
              <div className="p-3 bg-rose-50 dark:bg-rose-955/25 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 flex items-center space-x-2 text-[11px] leading-relaxed">
                <Icons.ShieldAlert className="w-4.5 h-4.5 flex-shrink-0" />
                <span>Operator Alert: Driver has an expired license or suspended profile and is blocked from active logistics dispatches.</span>
              </div>
            )}

            <div className="pt-4 border-t flex justify-end">
              <Button className="px-6" onClick={() => setViewModalOpen(false)}>Close File</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Drivers;
