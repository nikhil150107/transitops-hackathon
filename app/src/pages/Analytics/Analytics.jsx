import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Button from '../../components/forms/Button';
import * as Icons from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from 'recharts';

const SPARKLINE_DATA = [
  { value: 10 }, { value: 12 }, { value: 9 }, { value: 15 }, { value: 13 }, { value: 18 }, { value: 16 }
];

const REVENUE_DATA = [
  { name: 'Jan', revenue: 120000 },
  { name: 'Feb', revenue: 145000 },
  { name: 'Mar', revenue: 110000 },
  { name: 'Apr', revenue: 155000 },
  { name: 'May', revenue: 130000 },
  { name: 'Jun', revenue: 175000 },
  { name: 'Jul', revenue: 168000 }
];

const VEHICLE_COSTS = [
  { name: 'TRUCK-11', cost: 26400, fill: '#ef4444' },
  { name: 'MINI-03', cost: 12400, fill: '#f59e0b' },
  { name: 'VAN-05', cost: 5600, fill: '#2563eb' }
];

const HEALTH_DATA = [
  { name: 'Active Fleet', value: 75, color: '#10b981' },
  { name: 'In Workshop', value: 15, color: '#f59e0b' },
  { name: 'Retired', value: 10, color: '#ef4444' }
];

// --- SUB-COMPONENT: FILTERS BAR ---
const FiltersBar = ({ activeTab, onTabChange, onExport }) => {
  const tabs = ['Today', 'Week', 'Month', 'Quarter', 'Year'];
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-150 dark:border-slate-700/60 shadow-sm flex flex-wrap gap-4 items-center justify-between">
      <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === t
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-355'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="xs" iconLeft="FileSpreadsheet" onClick={() => onExport('CSV')}>
          Export CSV
        </Button>
        <Button variant="outline" size="xs" iconLeft="Download" onClick={() => onExport('Excel')}>
          Export Excel
        </Button>
        <Button variant="outline" size="xs" iconLeft="FileText" onClick={() => onExport('PDF')}>
          Export PDF
        </Button>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: ANALYTICS CARDS WITH SPARKLINE ---
const AnalyticsCard = ({ title, value, trend, isPositive, accentColor, sparkData }) => {
  return (
    <Card noPadding accentColor={accentColor} className="p-4 flex flex-col justify-between hover:scale-102 transition-all">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </span>
        <span className={`inline-flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '▲' : '▼'} {trend}%
        </span>
      </div>

      <div className="flex items-end justify-between mt-3">
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono tracking-tight">
          {value}
        </h3>
        <div className="h-8 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor === 'green' ? '#10b981' : '#2563eb'} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={accentColor === 'green' ? '#10b981' : '#2563eb'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={accentColor === 'green' ? '#10b981' : accentColor === 'yellow' ? '#f59e0b' : '#2563eb'} 
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#grad-${title})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

// --- SUB-COMPONENT: MONTHLY REVENUE AREA CHART ---
const RevenueChart = () => {
  return (
    <Card title="Monthly Revenue Streams" subtitle="Area gradient analytics log">
      <div className="h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REVENUE_DATA}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 10, fontWeight: 600 }} formatter={(v) => `₹${v/1000}k`} />
            <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563eb" 
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// --- SUB-COMPONENT: HORIZONTAL COST CHART ---
const CostChart = () => {
  return (
    <Card title="Top Costliest Vehicles" subtitle="Total service + fuel cost analysis">
      <div className="space-y-5 py-3">
        {VEHICLE_COSTS.map((item, idx) => {
          const maxVal = 30000;
          const percent = Math.round((item.cost / maxVal) * 100);
          return (
            <div key={idx} className="space-y-1 text-xs font-semibold">
              <div className="flex justify-between items-center text-slate-655 dark:text-slate-355">
                <span className="font-bold font-mono">{item.name}</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100 font-mono">₹ {item.cost.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-3.5 rounded-full overflow-hidden border border-slate-200/20 shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%`, backgroundColor: item.fill }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// --- SUB-COMPONENT: FLEET HEALTH DONUT ---
const FleetHealthChart = () => {
  return (
    <Card title="Fleet Health Ratio" subtitle="Current status asset allocation">
      <div className="h-64 flex flex-col justify-between items-center">
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={HEALTH_DATA}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {HEALTH_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// --- MAIN ANALYTICS CONTAINER ---
const Analytics = () => {
  const [activeTab, setActiveTab] = useState('Month');
  const [exporting, setExporting] = useState(false);

  const handleExport = (type) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert(`Successfully generated and exported ${type} report payload!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      <PageHeader
        title="Reports & Analytics"
        description="Verify vehicle ROI percentages, monthly revenue gradients, and fleet health donut ratios."
        breadcrumbs={[{ label: 'Analytics' }]}
        action={
          exporting ? (
            <span className="text-xs font-semibold text-slate-405 flex items-center space-x-2">
              <Icons.Loader className="w-4 h-4 animate-spin text-primary-500" />
              <span>Generating document files...</span>
            </span>
          ) : null
        }
      />

      <FiltersBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onExport={handleExport} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <AnalyticsCard
          title="Fuel Efficiency"
          value="8.4 km/l"
          trend="2.4"
          isPositive={true}
          accentColor="blue"
          sparkData={SPARKLINE_DATA}
        />

        <AnalyticsCard
          title="Fleet Utilization"
          value="81%"
          trend="1.8"
          isPositive={true}
          accentColor="green"
          sparkData={SPARKLINE_DATA}
        />

        <AnalyticsCard
          title="Operational Cost"
          value="₹ 34,070"
          trend="8.5"
          isPositive={false}
          accentColor="yellow"
          sparkData={SPARKLINE_DATA}
        />

        <AnalyticsCard
          title="Vehicle ROI"
          value="14.2%"
          trend="4.6"
          isPositive={true}
          accentColor="green"
          sparkData={SPARKLINE_DATA}
        />

      </div>

      <div className="text-[10px] text-slate-455 font-bold uppercase tracking-wider px-2">
        🧮 ROI Formula = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Vehicle Cost Ranking */}
        <div>
          <CostChart />
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <FleetHealthChart />

        <Card title="Activity Parameters" subtitle="Trips Completed vs Maintenance Logs">
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={[
                { name: 'Trips', completed: 18, pending: 9 },
                { name: 'Maint.', completed: 12, pending: 3 }
              ]}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Fuel Consumption Trends" subtitle="Litres used monthly">
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={[
                { name: 'May', liters: 150 },
                { name: 'Jun', liters: 180 },
                { name: 'Jul', liters: 168 }
              ]}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip />
                <Line type="monotone" dataKey="liters" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};

export default Analytics;
export { AnalyticsCard, RevenueChart, CostChart, FleetHealthChart, FiltersBar };
