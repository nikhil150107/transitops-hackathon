import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Button from '../../components/forms/Button';
import SearchBar from '../../components/forms/SearchBar';
import Modal from '../../components/dialogs/Modal';
import StatusBadge from '../../components/badges/StatusBadge';
import * as Icons from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

const INITIAL_FUEL_LOGS = [
  { id: 'FL-01', vehicle: 'VAN-05', date: '2026-07-05', liters: 42, cost: 3150, station: 'Indian Oil Sec 62', mileage: 12.4 },
  { id: 'FL-02', vehicle: 'TRUCK-11', date: '2026-07-06', liters: 110, cost: 8400, station: 'HP Petrol CP', mileage: 6.8 },
  { id: 'FL-03', vehicle: 'MINI-08', date: '2026-07-06', liters: 28, cost: 2050, station: 'Reliance Energy', mileage: 15.2 }
];

const INITIAL_EXPENSES = [
  { id: 'EXP-01', trip: 'TR001', vehicle: 'VAN-05', toll: 120, other: 0, maintenance: 0, total: 120, status: 'Approved' },
  { id: 'EXP-02', trip: 'TR002', vehicle: 'TRK-12', toll: 340, other: 150, maintenance: 18000, total: 18490, status: 'Approved' },
  { id: 'EXP-03', trip: 'TR003', vehicle: 'MINI-03', toll: 80, other: 250, maintenance: 6200, total: 6530, status: 'Pending' }
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

// --- SUB-COMPONENT: FUEL LOGS TABLE ---
const FuelTable = ({ data, onDelete }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filtered = data.filter(
    (l) => l.vehicle.toLowerCase().includes(search.toLowerCase()) || 
           l.station.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fuel Logs Ledger</span>
        <div className="w-48">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fuel logs..." />
        </div>
      </div>

      <div className="overflow-x-auto w-full border border-slate-100 dark:border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-3">Vehicle</th>
              <th className="p-3">Date</th>
              <th className="p-3">Liters</th>
              <th className="p-3">Cost (₹)</th>
              <th className="p-3">Fuel Station</th>
              <th className="p-3">Mileage</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40 text-slate-700 dark:text-slate-350">
            {paginated.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors font-semibold">
                <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-100">{log.vehicle}</td>
                <td className="p-3 text-slate-455 font-mono">{log.date}</td>
                <td className="p-3 font-mono">{log.liters} L</td>
                <td className="p-3 font-mono">{log.cost.toLocaleString()}</td>
                <td className="p-3">{log.station}</td>
                <td className="p-3 font-mono">{log.mileage} km/l</td>
                <td className="p-3 text-right">
                  <button onClick={() => onDelete(log.id)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-955/15 p-1 rounded">
                    <Icons.Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-455">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex space-x-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: OTHER EXPENSES TABLE ---
const ExpenseTable = ({ data, onDelete }) => {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Other Expenditures Ledger</span>
      
      <div className="overflow-x-auto w-full border border-slate-100 dark:border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-3">Trip</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Toll (₹)</th>
              <th className="p-3">Misc (₹)</th>
              <th className="p-3">Maint. (Linked)</th>
              <th className="p-3">Total (₹)</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40 text-slate-700 dark:text-slate-350">
            {data.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors font-semibold">
                <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{exp.trip}</td>
                <td className="p-3 font-mono">{exp.vehicle}</td>
                <td className="p-3 font-mono">{exp.toll.toLocaleString()}</td>
                <td className="p-3 font-mono">{exp.other.toLocaleString()}</td>
                <td className="p-3 font-mono text-slate-455">{exp.maintenance.toLocaleString()}</td>
                <td className="p-3 font-mono text-primary-600 dark:text-primary-400 font-extrabold">{exp.total.toLocaleString()}</td>
                <td className="p-3">
                  <StatusBadge>{exp.status}</StatusBadge>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => onDelete(exp.id)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-955/15 p-1 rounded">
                    <Icons.Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: OPERATIONAL COST SUMMARY CARDS ---
const CostSummary = ({ fuelTotal, maintTotal, otherTotal, grandTotal }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      
      <Card noPadding className="p-4.5 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/10 to-transparent">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider block">Refuel Expenditures</span>
        <h3 className="text-2xl font-black mt-2 text-slate-800 dark:text-slate-100 font-mono">₹ {fuelTotal.toLocaleString()}</h3>
      </Card>

      <Card noPadding className="p-4.5 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/10 to-transparent">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider block">Maintenance linked</span>
        <h3 className="text-2xl font-black mt-2 text-slate-800 dark:text-slate-100 font-mono">₹ {maintTotal.toLocaleString()}</h3>
      </Card>

      <Card noPadding className="p-4.5 border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/10 to-transparent">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider block">Tolls & Other Costs</span>
        <h3 className="text-2xl font-black mt-2 text-slate-800 dark:text-slate-100 font-mono">₹ {otherTotal.toLocaleString()}</h3>
      </Card>

      <Card noPadding className="p-4.5 border-l-4 border-l-indigo-600 bg-gradient-to-br from-indigo-50/20 to-indigo-500/5 shadow-md shadow-indigo-500/5">
        <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">Grand Operational Cost</span>
        <h3 className="text-2xl font-black mt-2 text-indigo-650 dark:text-indigo-400 font-mono animate-pulse">₹ {grandTotal.toLocaleString()}</h3>
      </Card>

    </div>
  );
};

// --- SUB-COMPONENT: RECHARTS FUEL CHARTS PANEL ---
const FuelCharts = ({ fuelLogs, expenses }) => {
  const fuelCost = fuelLogs.reduce((sum, l) => sum + l.cost, 0);
  const tollCost = expenses.reduce((sum, e) => sum + e.toll, 0);
  const maintCost = expenses.reduce((sum, e) => sum + e.maintenance, 0);
  const miscCost = expenses.reduce((sum, e) => sum + e.other, 0);

  const pieData = [
    { name: 'Fuel', value: fuelCost },
    { name: 'Maintenance', value: maintCost },
    { name: 'Tolls', value: tollCost },
    { name: 'Misc Other', value: miscCost }
  ];

  const vehicleFuelMap = fuelLogs.reduce((acc, log) => {
    acc[log.vehicle] = (acc[log.vehicle] || 0) + log.cost;
    return acc;
  }, {});

  const barData = Object.keys(vehicleFuelMap).map(vehicle => ({
    name: vehicle,
    cost: vehicleFuelMap[vehicle]
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Category Pie Chart */}
      <Card title="Expense Category Mix" subtitle="Operational cost ratios">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Vehicle Fuel usage Bar Chart */}
      <Card title="Vehicle Refuel Expenditure" subtitle="Cost profile by logistics asset">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="cost" fill="#2563eb" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
};

// --- MAIN FUEL & EXPENSES COMPONENT ---
const FuelExpense = () => {
  const [fuelLogs, setFuelLogs] = useState(() => {
    const saved = localStorage.getItem('pravaah_fuel_logs');
    return saved ? JSON.parse(saved) : INITIAL_FUEL_LOGS;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('pravaah_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  // Modal control triggers
  const [fuelModalOpen, setFuelModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Form states (Add Fuel)
  const [fuelVehicle, setFuelVehicle] = useState('VAN-05');
  const [fuelDate, setFuelDate] = useState('2026-07-12');
  const [fuelLiters, setFuelLiters] = useState('42');
  const [fuelCost, setFuelCost] = useState('3150');
  const [fuelStation, setFuelStation] = useState('Indian Oil Sec 62');
  const [fuelMileage, setFuelMileage] = useState('12.4');

  // Form states (Add Expense)
  const [expTrip, setExpTrip] = useState('TR001');
  const [expVehicle, setExpVehicle] = useState('VAN-05');
  const [expToll, setExpToll] = useState('120');
  const [expOther, setExpOther] = useState('0');
  const [expMaint, setExpMaint] = useState('0');
  const [expStatus, setExpStatus] = useState('Approved');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pravaah_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('pravaah_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Actions: Add Fuel Log
  const handleAddFuelLog = (e) => {
    e.preventDefault();
    const newLog = {
      id: `FL-${Math.floor(10 + Math.random() * 90)}`,
      vehicle: fuelVehicle,
      date: fuelDate,
      liters: Number(fuelLiters) || 0,
      cost: Number(fuelCost) || 0,
      station: fuelStation,
      mileage: Number(fuelMileage) || 0
    };
    setFuelLogs([newLog, ...fuelLogs]);
    setFuelModalOpen(false);
    resetFuelForm();
  };

  // Actions: Add Expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    const tollVal = Number(expToll) || 0;
    const otherVal = Number(expOther) || 0;
    const maintVal = Number(expMaint) || 0;

    const newExpense = {
      id: `EXP-${Math.floor(10 + Math.random() * 90)}`,
      trip: expTrip,
      vehicle: expVehicle,
      toll: tollVal,
      other: otherVal,
      maintenance: maintVal,
      total: tollVal + otherVal + maintVal,
      status: expStatus
    };
    setExpenses([newExpense, ...expenses]);
    setExpenseModalOpen(false);
    resetExpenseForm();
  };

  const resetFuelForm = () => {
    setFuelVehicle('VAN-05');
    setFuelDate('2026-07-12');
    setFuelLiters('42');
    setFuelCost('3150');
    setFuelStation('Indian Oil Sec 62');
    setFuelMileage('12.4');
  };

  const resetExpenseForm = () => {
    setExpTrip('TR001');
    setExpVehicle('VAN-05');
    setExpToll('120');
    setExpOther('0');
    setExpMaint('0');
    setExpStatus('Approved');
  };

  // Calculations for KPI summaries
  const fuelTotalSum = fuelLogs.reduce((sum, l) => sum + l.cost, 0);
  const maintTotalSum = expenses.reduce((sum, e) => sum + e.maintenance, 0);
  const otherTotalSum = expenses.reduce((sum, e) => sum + e.toll + e.other, 0);
  const grandTotalSum = fuelTotalSum + maintTotalSum + otherTotalSum;

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Fuel & Expense Management"
        description="Verify refuel logs, cargo shipment tolls, maintenance cost audits, and charts."
        breadcrumbs={[{ label: 'Fuel & Expenses' }]}
        action={
          <div className="flex space-x-2">
            <Button onClick={() => setFuelModalOpen(true)} size="sm" iconLeft="Plus">
              Log Fuel
            </Button>
            <Button onClick={() => setExpenseModalOpen(true)} size="sm" iconLeft="Plus" variant="outline">
              Add Expense
            </Button>
          </div>
        }
      />

      {/* 2. COST SUMMARY KPI PANEL */}
      <CostSummary
        fuelTotal={fuelTotalSum}
        maintTotal={maintTotalSum}
        otherTotal={otherTotalSum}
        grandTotal={grandTotalSum}
      />

      {/* 3. SECTION 1: FUEL LOGS TABLE CARD */}
      <Card noPadding className="p-5">
        <FuelTable 
          data={fuelLogs} 
          onDelete={(id) => setFuelLogs(fuelLogs.filter(l => l.id !== id))} 
        />
      </Card>

      {/* 4. SECTION 2: EXPENSES TABLE CARD */}
      <Card noPadding className="p-5">
        <ExpenseTable 
          data={expenses} 
          onDelete={(id) => setExpenses(expenses.filter(e => e.id !== id))} 
        />
      </Card>

      {/* 5. BOTTOM SECTION: CHARTS PANEL */}
      <FuelCharts 
        fuelLogs={fuelLogs} 
        expenses={expenses} 
      />

      {/* 6. LOG FUEL MODAL */}
      <Modal open={fuelModalOpen} onClose={() => setFuelModalOpen(false)} title="Log Fuel Purchase">
        <form onSubmit={handleAddFuelLog} className="space-y-4 text-xs font-semibold">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Vehicle</label>
              <input
                type="text"
                required
                value={fuelVehicle}
                onChange={(e) => setFuelVehicle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Date</label>
              <input
                type="date"
                required
                value={fuelDate}
                onChange={(e) => setFuelDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Liters</label>
              <input
                type="number"
                required
                value={fuelLiters}
                onChange={(e) => setFuelLiters(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Cost (₹)</label>
              <input
                type="number"
                required
                value={fuelCost}
                onChange={(e) => setFuelCost(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Fuel Station</label>
              <input
                type="text"
                required
                value={fuelStation}
                onChange={(e) => setFuelStation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Current Mileage (km/l)</label>
              <input
                type="number"
                step="0.1"
                required
                value={fuelMileage}
                onChange={(e) => setFuelMileage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="pt-2 flex space-x-2">
            <Button variant="outline" className="w-1/2" onClick={() => setFuelModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="w-1/2">Log Purchase</Button>
          </div>

        </form>
      </Modal>

      {/* 7. ADD EXPENSE MODAL */}
      <Modal open={expenseModalOpen} onClose={() => setExpenseModalOpen(false)} title="Log Operational Expense">
        <form onSubmit={handleAddExpense} className="space-y-4 text-xs font-semibold">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Linked Trip ID</label>
              <input
                type="text"
                required
                value={expTrip}
                onChange={(e) => setExpTrip(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Vehicle</label>
              <input
                type="text"
                required
                value={expVehicle}
                onChange={(e) => setExpVehicle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Toll Cost (₹)</label>
              <input
                type="number"
                value={expToll}
                onChange={(e) => setExpToll(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Misc Cost (₹)</label>
              <input
                type="number"
                value={expOther}
                onChange={(e) => setExpOther(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase text-[9px]">Maint. linked</label>
              <input
                type="number"
                value={expMaint}
                onChange={(e) => setExpMaint(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 uppercase text-[9px]">Audit Status</label>
            <select
              value={expStatus}
              onChange={(e) => setExpStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-855"
            >
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="pt-2 flex space-x-2">
            <Button variant="outline" className="w-1/2" onClick={() => setExpenseModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="w-1/2">Save Expense</Button>
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default FuelExpense;
