import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Button from '../../components/forms/Button';
import StatusBadge from '../../components/badges/StatusBadge';
import * as Icons from 'lucide-react';

const INITIAL_TRIPS = [
  { tripId: 'TR001', vehicle: 'VAN-05', driver: 'Alex', source: 'Gandhinagar Depot', destination: 'Ahmedabad Hub', status: 'Dispatched', eta: '45 min', distance: 38, weight: 450 },
  { tripId: 'TR004', vehicle: 'TRUCK-04', driver: 'Suresh', source: 'Vatva Industrial Area', destination: 'Sanand Warehouse', status: 'Draft', eta: 'Awaiting driver', distance: 55, weight: 320 },
  { tripId: 'TR006', vehicle: 'Unassigned', driver: 'Unassigned', source: 'Mansa', destination: 'Kalol Depot', status: 'Cancelled', eta: 'Vehicle went to shop', distance: 22, weight: 0 }
];

const Trips = () => {
  // Sync databases from local storage
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('pravaah_registry_vehicles');
    return saved ? JSON.parse(saved) : [];
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('pravaah_drivers');
    return saved ? JSON.parse(saved) : [];
  });

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('pravaah_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  // Form states
  const [source, setSource] = useState('Gandhinagar Depot');
  const [destination, setDestination] = useState('Ahmedabad Hub');
  const [selectedVehicleReg, setSelectedVehicleReg] = useState('');
  const [selectedDriverLicense, setSelectedDriverLicense] = useState('');
  const [cargoWeight, setCargoWeight] = useState('700');
  const [plannedDistance, setPlannedDistance] = useState('38');

  // Load available vehicles and drivers
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Available' && !d.expiry.toLowerCase().includes('expired'));

  // Set default selects
  useEffect(() => {
    if (availableVehicles.length > 0 && !selectedVehicleReg) {
      setSelectedVehicleReg(availableVehicles[0].regNo);
    }
  }, [availableVehicles, selectedVehicleReg]);

  useEffect(() => {
    if (availableDrivers.length > 0 && !selectedDriverLicense) {
      setSelectedDriverLicense(availableDrivers[0].licenseNo);
    }
  }, [availableDrivers, selectedDriverLicense]);

  // Persist trips
  useEffect(() => {
    localStorage.setItem('pravaah_trips', JSON.stringify(trips));
  }, [trips]);

  // Calculate capacity validation
  const activeVehicleObj = vehicles.find(v => v.regNo === selectedVehicleReg);
  const activeDriverObj = drivers.find(d => d.licenseNo === selectedDriverLicense);

  const getVehicleCapacityNum = (capStr) => {
    if (!capStr) return 0;
    const num = parseInt(capStr.replace(/[^0-9]/g, ''));
    if (capStr.toLowerCase().includes('ton')) return num * 1000;
    return num;
  };

  const vehicleCapacityKg = activeVehicleObj ? getVehicleCapacityNum(activeVehicleObj.capacity) : 500;
  const cargoWeightNum = Number(cargoWeight) || 0;
  const isCapacityExceeded = cargoWeightNum > vehicleCapacityKg;
  const excessWeight = isCapacityExceeded ? cargoWeightNum - vehicleCapacityKg : 0;

  // Reset form
  const handleCancelForm = () => {
    setSource('');
    setDestination('');
    setCargoWeight('');
    setPlannedDistance('');
    if (availableVehicles.length > 0) setSelectedVehicleReg(availableVehicles[0].regNo);
    if (availableDrivers.length > 0) setSelectedDriverLicense(availableDrivers[0].licenseNo);
  };

  // Dispatch action
  const handleDispatchTrip = (e) => {
    e.preventDefault();
    if (isCapacityExceeded || !activeVehicleObj || !activeDriverObj) return;

    const newTripId = `TR${String(trips.length + 1).padStart(3, '0')}`;
    const newTrip = {
      tripId: newTripId,
      vehicle: activeVehicleObj.name,
      driver: activeDriverObj.name,
      source: source || 'Depot',
      destination: destination || 'Hub',
      status: 'Dispatched',
      eta: '45 min',
      distance: Number(plannedDistance) || 30,
      weight: cargoWeightNum
    };

    // Update vehicle and driver status to 'On Trip' in local storage
    const updatedVehicles = vehicles.map(v => 
      v.regNo === activeVehicleObj.regNo ? { ...v, status: 'On Trip' } : v
    );
    const updatedDrivers = drivers.map(d => 
      d.licenseNo === activeDriverObj.licenseNo ? { ...d, status: 'On Trip' } : d
    );

    setVehicles(updatedVehicles);
    setDrivers(updatedDrivers);
    localStorage.setItem('pravaah_registry_vehicles', JSON.stringify(updatedVehicles));
    localStorage.setItem('pravaah_drivers', JSON.stringify(updatedDrivers));

    setTrips([newTrip, ...trips]);
    handleCancelForm();
  };

  // Complete Trip simulation
  const handleCompleteTrip = (tripId) => {
    const trip = trips.find(t => t.tripId === tripId);
    if (!trip) return;

    // Find and update vehicle back to Available, and add odometer distance
    const updatedVehicles = vehicles.map(v => {
      if (v.name === trip.vehicle) {
        return {
          ...v,
          status: 'Available',
          odometer: v.odometer + (trip.distance || 0)
        };
      }
      return v;
    });

    // Find and update driver back to Available
    const updatedDrivers = drivers.map(d => {
      if (d.name === trip.driver) {
        return { ...d, status: 'Available' };
      }
      return d;
    });

    // Update trip status to Completed
    const updatedTrips = trips.map(t => 
      t.tripId === tripId ? { ...t, status: 'Completed', eta: '—' } : t
    );

    setVehicles(updatedVehicles);
    setDrivers(updatedDrivers);
    setTrips(updatedTrips);

    localStorage.setItem('pravaah_registry_vehicles', JSON.stringify(updatedVehicles));
    localStorage.setItem('pravaah_drivers', JSON.stringify(updatedDrivers));
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Trip Dispatcher"
        description="Plan routes, allocate available drivers and vehicles, and monitor cargo weights."
        breadcrumbs={[{ label: 'Trips' }]}
      />

      {/* 2. SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] items-start">
        
        {/* LEFT COLUMN: CREATE TRIP FORM (5/12 width) */}
        <Card className="lg:col-span-5 flex flex-col justify-between h-full overflow-y-auto" title="Create Trip">
          
          {/* Stepper lifecycle */}
          <div className="border-b border-slate-100 dark:border-slate-700/50 pb-5 mb-4">
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-3">Trip Lifecycle Status</p>
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col items-center">
                <span className="h-4 w-4 rounded-full bg-emerald-500 border border-white dark:border-slate-800 shadow flex items-center justify-center text-[8px] text-white">✓</span>
                <span className="text-[9px] font-bold text-emerald-500 mt-1">Draft</span>
              </div>
              <div className="flex-1 h-0.5 bg-blue-500 mx-2"></div>
              <div className="flex flex-col items-center">
                <span className="h-4 w-4 rounded-full bg-blue-500 border border-white dark:border-slate-800 shadow"></span>
                <span className="text-[9px] font-bold text-blue-500 mt-1">Dispatched</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2"></div>
              <div className="flex flex-col items-center">
                <span className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 border border-white dark:border-slate-800 shadow"></span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">Completed</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2"></div>
              <div className="flex flex-col items-center">
                <span className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 border border-white dark:border-slate-800 shadow"></span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleDispatchTrip} className="space-y-4 text-xs font-semibold">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Source Depot</label>
                <input
                  type="text"
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Gandhinagar Depot"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Destination Hub</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Ahmedabad Hub"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
                />
              </div>
            </div>

            {/* Available Vehicles Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Vehicle (Available Only)</label>
              <select
                value={selectedVehicleReg}
                onChange={(e) => setSelectedVehicleReg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855 font-mono"
              >
                {availableVehicles.length > 0 ? (
                  availableVehicles.map(v => (
                    <option key={v.regNo} value={v.regNo}>
                      {v.name} ({v.regNo} - {v.capacity} cap)
                    </option>
                  ))
                ) : (
                  <option value="">No Available Vehicles in Registry</option>
                )}
              </select>
            </div>

            {/* Available Drivers Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Driver (Available Only)</label>
              <select
                value={selectedDriverLicense}
                onChange={(e) => setSelectedDriverLicense(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
              >
                {availableDrivers.length > 0 ? (
                  availableDrivers.map(d => (
                    <option key={d.licenseNo} value={d.licenseNo}>
                      {d.name} ({d.category} - Lic: {d.licenseNo})
                    </option>
                  ))
                ) : (
                  <option value="">No Available Drivers in Roster</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Cargo Weight (kg)</label>
                <input
                  type="number"
                  required
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase text-[9px]">Planned Distance (km)</label>
                <input
                  type="number"
                  required
                  value={plannedDistance}
                  onChange={(e) => setPlannedDistance(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
                />
              </div>
            </div>

            {/* ❌ CAPACITY WARNING BANNER */}
            {isCapacityExceeded && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/35 rounded-2xl flex flex-col space-y-1 font-semibold text-rose-600 dark:text-rose-455">
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider font-bold">
                  <Icons.AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 animate-pulse" />
                  <span>Weight Exception Warning</span>
                </div>
                <div className="text-[11px] leading-relaxed pt-1 space-y-0.5">
                  <p>Vehicle Capacity: <b>{vehicleCapacityKg} kg</b></p>
                  <p>Cargo Weight: <b>{cargoWeightNum} kg</b></p>
                  <p className="font-extrabold text-rose-700 dark:text-rose-400 mt-1">
                    ❌ Capacity exceeded by {excessWeight} kg — dispatch blocked
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex space-x-3">
              <Button 
                variant="secondary" 
                className="w-1/2" 
                onClick={handleCancelForm}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isCapacityExceeded || availableVehicles.length === 0 || availableDrivers.length === 0}
                className="w-1/2 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-bold"
              >
                Dispatch Trip
              </Button>
            </div>

          </form>

        </Card>

        {/* RIGHT COLUMN: LIVE BOARD LIST (7/12 width) */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-y-auto space-y-4">
          <h3 className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider px-1">Live Board Dispatch Ticker</h3>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {trips.map((t) => (
              <div 
                key={t.tripId} 
                className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left accent color coded by status */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  t.status === 'Dispatched' ? 'bg-blue-500' :
                  t.status === 'Completed' ? 'bg-emerald-500' :
                  t.status === 'Cancelled' ? 'bg-rose-500' :
                  'bg-slate-450'
                }`}></div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 dark:text-slate-105 text-sm">{t.tripId}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      • {t.vehicle} / {t.driver}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                    <Icons.MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>{t.source} Depot &rarr; {t.destination} Hub</span>
                  </div>

                  {t.weight > 0 && (
                    <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                      <span>Cargo: <b>{t.weight} kg</b></span>
                      <span>•</span>
                      <span>Distance: <b>{t.distance} km</b></span>
                    </div>
                  )}
                </div>

                {/* Status Badges & Controls */}
                <div className="flex flex-col items-end gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <StatusBadge>{t.status}</StatusBadge>
                    <span className="text-[10px] font-bold text-slate-500">{t.eta}</span>
                  </div>
                  {t.status === 'Dispatched' && (
                    <Button 
                      variant="outline" 
                      size="xs" 
                      onClick={() => handleCompleteTrip(t.tripId)}
                      className="mt-1"
                    >
                      Complete Trip
                    </Button>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Business Rule info banner */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-3 text-[10px] text-slate-405 font-bold uppercase tracking-wider text-center">
            🚦 On Complete: odometer &rarr; fuel log &rarr; expenses &rarr; Vehicle & Driver Available
          </div>

        </div>

      </div>

    </div>
  );
};

export default Trips;
