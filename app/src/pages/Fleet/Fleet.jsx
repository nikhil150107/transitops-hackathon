import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Table from '../../components/tables/Table';
import StatusBadge from '../../components/badges/StatusBadge';
import Button from '../../components/forms/Button';
import Modal from '../../components/dialogs/Modal';
import SearchBar from '../../components/forms/SearchBar';
import * as Icons from 'lucide-react';

const INITIAL_REGISTRY = [
  { regNo: 'GJ01AB452', name: 'VAN-05', type: 'Van', capacity: '500 kg', odometer: 74000, acqCost: 620000, status: 'Available' },
  { regNo: 'GJ01AB998', name: 'TRUCK-11', type: 'Truck', capacity: '5 Ton', odometer: 182000, acqCost: 2450000, status: 'On Trip' },
  { regNo: 'GJ01AB1120', name: 'MINI-03', type: 'Mini', capacity: '1 Ton', odometer: 66000, acqCost: 410000, status: 'In Shop' },
  { regNo: 'GJ01AB0008', name: 'VAN-09', type: 'Van', capacity: '750 kg', odometer: 241900, acqCost: 590000, status: 'Retired' }
];

const Fleet = () => {
  // Local storage binding
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('pravaah_registry_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRY;
  });

  // Filter & Search states
  const [searchReg, setSearchReg] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal open triggers
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Active object references
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Form states (Add/Edit)
  const [formRegNo, setFormRegNo] = useState('');
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Van');
  const [formCapacity, setFormCapacity] = useState('');
  const [formOdometer, setFormOdometer] = useState('');
  const [formAcqCost, setFormAcqCost] = useState('');
  const [formStatus, setFormStatus] = useState('Available');
  const [formError, setFormError] = useState('');

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('pravaah_registry_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  // Filtering logic
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.regNo.toLowerCase().includes(searchReg.toLowerCase());
    const matchesType = filterType === 'All' || v.type === filterType;
    const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Form submit handler (Add)
  const handleAddVehicle = (e) => {
    e.preventDefault();
    setFormError('');

    // Unique Reg Number Check
    const exists = vehicles.some(v => v.regNo.toLowerCase() === formRegNo.trim().toLowerCase());
    if (exists) {
      setFormError(`Registration number "${formRegNo}" is already registered. Must be unique.`);
      return;
    }

    const newVehicle = {
      regNo: formRegNo.trim().toUpperCase(),
      name: formName.trim() || `UNIT-${Math.floor(10 + Math.random() * 90)}`,
      type: formType,
      capacity: formCapacity || '500 kg',
      odometer: Number(formOdometer) || 0,
      acqCost: Number(formAcqCost) || 0,
      status: formStatus
    };

    setVehicles([...vehicles, newVehicle]);
    setAddModalOpen(false);
    resetForm();
  };

  // Form submit handler (Edit)
  const handleEditVehicle = (e) => {
    e.preventDefault();
    setFormError('');

    // Unique Reg Number Check (excluding the vehicle itself)
    const exists = vehicles.some(
      v => v.regNo.toLowerCase() === formRegNo.trim().toLowerCase() && v.regNo !== vehicleToEdit.regNo
    );
    if (exists) {
      setFormError(`Registration number "${formRegNo}" is already in use by another vehicle.`);
      return;
    }

    const updatedVehicles = vehicles.map((v) => {
      if (v.regNo === vehicleToEdit.regNo) {
        return {
          ...v,
          regNo: formRegNo.trim().toUpperCase(),
          name: formName.trim(),
          type: formType,
          capacity: formCapacity,
          odometer: Number(formOdometer),
          acqCost: Number(formAcqCost),
          status: formStatus
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    setEditModalOpen(false);
    resetForm();
  };

  // Delete handler
  const handleDeleteConfirm = () => {
    if (vehicleToDelete) {
      setVehicles(vehicles.filter(v => v.regNo !== vehicleToDelete.regNo));
      setDeleteModalOpen(false);
      setVehicleToDelete(null);
    }
  };

  const resetForm = () => {
    setFormRegNo('');
    setFormName('');
    setFormType('Van');
    setFormCapacity('');
    setFormOdometer('');
    setFormAcqCost('');
    setFormStatus('Available');
    setFormError('');
  };

  const openEditModal = (vehicle) => {
    setVehicleToEdit(vehicle);
    setFormRegNo(vehicle.regNo);
    setFormName(vehicle.name);
    setFormType(vehicle.type);
    setFormCapacity(vehicle.capacity);
    setFormOdometer(vehicle.odometer);
    setFormAcqCost(vehicle.acqCost);
    setFormStatus(vehicle.status);
    setEditModalOpen(true);
  };

  const openViewModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setViewModalOpen(true);
  };

  const openDeleteModal = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteModalOpen(true);
  };

  // Table Column definitions
  const headers = ['Reg. No. (Unique)', 'Name/Model', 'Type', 'Capacity', 'Odometer (km)', 'Acq. Cost (₹)', 'Status', 'Actions'];

  // Table Row Renderer
  const renderRow = (v, idx) => (
    <tr key={v.regNo} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors text-xs font-semibold text-slate-750 dark:text-slate-350">
      <td className="p-4 font-bold text-slate-800 dark:text-slate-105">{v.regNo}</td>
      <td className="p-4">{v.name}</td>
      <td className="p-4">{v.type}</td>
      <td className="p-4">{v.capacity}</td>
      <td className="p-4 font-mono">{v.odometer.toLocaleString()}</td>
      <td className="p-4 font-mono">{v.acqCost.toLocaleString()}</td>
      <td className="p-4">
        <StatusBadge>{v.status}</StatusBadge>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          
          {/* View Icon */}
          <button 
            onClick={() => openViewModal(v)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded text-slate-400 hover:text-primary-500 transition-colors"
            title="Inspect"
          >
            <Icons.Eye className="w-4 h-4" />
          </button>
          
          {/* Edit Icon */}
          <button 
            onClick={() => openEditModal(v)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded text-slate-400 hover:text-amber-500 transition-colors"
            title="Edit"
          >
            <Icons.Edit3 className="w-4 h-4" />
          </button>
          
          {/* Delete Icon */}
          <button 
            onClick={() => openDeleteModal(v)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded text-slate-400 hover:text-rose-500 transition-colors"
            title="Delete"
          >
            <Icons.Trash2 className="w-4 h-4" />
          </button>

        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Vehicle Registry"
        description="Verify vehicle logs, status parameters, odometer reports, and fleet acquisition assets."
        breadcrumbs={[{ label: 'Fleet', path: '/fleet' }, { label: 'Registry' }]}
        action={
          <Button onClick={() => { resetForm(); setAddModalOpen(true); }} size="sm" iconLeft="Plus">
            Add Vehicle
          </Button>
        }
      />

      {/* 2. TOP TOOLBAR FILTERS */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-150 dark:border-slate-700/60 shadow-sm flex flex-wrap gap-4 items-center">
        
        {/* Search Reg Number */}
        <div className="w-full md:w-64">
          <SearchBar
            value={searchReg}
            onChange={(e) => setSearchReg(e.target.value)}
            placeholder="Search reg. no..."
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold focus:outline-none"
        >
          <option value="All">Type: All</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
          <option value="Mini">Mini</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold focus:outline-none"
        >
          <option value="All">Status: All</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="In Shop">In Shop</option>
          <option value="Retired">Retired</option>
        </select>

      </div>

      {/* 3. TABLE BLOCK */}
      <Card noPadding className="relative">
        <Table
          headers={headers}
          data={filteredVehicles}
          renderRow={renderRow}
          emptyMessage="No vehicles match the selected search or filter parameters."
        />
      </Card>

      {/* 4. RED/ORANGE RULE MESSAGE BAR */}
      <div className="flex items-center space-x-2 px-2 text-xs font-semibold text-amber-600 dark:text-amber-500 animate-pulse">
        <Icons.AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Rule: Registration number must be unique. Vehicles marked In Shop or Retired cannot be dispatched.</span>
      </div>

      {/* 5. ADD VEHICLE MODAL */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Registry Vehicle"
      >
        {formError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
            <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}
        <form onSubmit={handleAddVehicle} className="space-y-4 text-xs font-semibold">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Registration Number</label>
              <input
                type="text"
                required
                placeholder="e.g. GJ01AB452"
                value={formRegNo}
                onChange={(e) => setFormRegNo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Name/Model</label>
              <input
                type="text"
                required
                placeholder="e.g. VAN-05"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Vehicle Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
              >
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Mini">Mini</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Capacity</label>
              <input
                type="text"
                required
                placeholder="e.g. 500 kg or 5 Ton"
                value={formCapacity}
                onChange={(e) => setFormCapacity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Odometer (km)</label>
              <input
                type="number"
                required
                placeholder="74000"
                value={formOdometer}
                onChange={(e) => setFormOdometer(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Acquisition Cost (₹)</label>
              <input
                type="number"
                required
                placeholder="620000"
                value={formAcqCost}
                onChange={(e) => setFormAcqCost(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 uppercase text-[9px]">Initial Status</label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
            >
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          <div className="pt-2 flex space-x-2">
            <Button variant="outline" className="w-1/2" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="w-1/2">Register Vehicle</Button>
          </div>

        </form>
      </Modal>

      {/* 6. EDIT VEHICLE MODAL */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Registry Vehicle"
      >
        {formError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-455 text-xs font-semibold flex items-center space-x-2">
            <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}
        {vehicleToEdit && (
          <form onSubmit={handleEditVehicle} className="space-y-4 text-xs font-semibold">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Registration Number</label>
                <input
                  type="text"
                  required
                  value={formRegNo}
                  onChange={(e) => setFormRegNo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Name/Model</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Vehicle Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
                >
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Mini">Mini</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Capacity</label>
                <input
                  type="text"
                  required
                  value={formCapacity}
                  onChange={(e) => setFormCapacity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Odometer (km)</label>
                <input
                  type="number"
                  required
                  value={formOdometer}
                  onChange={(e) => setFormOdometer(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Acquisition Cost (₹)</label>
                <input
                  type="number"
                  required
                  value={formAcqCost}
                  onChange={(e) => setFormAcqCost(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div className="pt-2 flex space-x-2">
              <Button variant="outline" className="w-1/2" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="w-1/2">Save Changes</Button>
            </div>

          </form>
        )}
      </Modal>

      {/* 7. VIEW VEHICLE MODAL */}
      <Modal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Vehicle Registry Details"
      >
        {selectedVehicle && (
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Registration Number</p>
                <p className="text-sm font-extrabold text-slate-850 dark:text-slate-100">{selectedVehicle.regNo}</p>
              </div>
              <StatusBadge>{selectedVehicle.status}</StatusBadge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Model Name</p>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5">{selectedVehicle.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Vehicle Type</p>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5">{selectedVehicle.type}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Load Capacity</p>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5">{selectedVehicle.capacity}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Odometer log</p>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5 font-mono">{selectedVehicle.odometer.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Acquisition Cost</p>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5 font-mono">₹ {selectedVehicle.acqCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button className="px-6" onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 8. DELETE CONFIRMATION MODAL */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        {vehicleToDelete && (
          <div className="space-y-4 text-xs font-semibold">
            <p className="text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
              Are you sure you want to permanently delete vehicle <b className="text-slate-800 dark:text-white font-extrabold">{vehicleToDelete.regNo} ({vehicleToDelete.name})</b> from the registries database? This action is irreversible.
            </p>
            <div className="pt-2 flex space-x-2">
              <Button variant="outline" className="w-1/2" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="danger" className="w-1/2" onClick={handleDeleteConfirm}>Confirm Delete</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Fleet;
