import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import SearchBar from '../components/ui/SearchBar';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

const LiveTracking = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Vehicle Tracking"
        description="Geospatial mapping and active telemetry logs for public fleets."
        breadcrumbs={[{ label: 'Live Tracking' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        {/* Left Search Sidebar Column */}
        <Card className="flex flex-col h-full" noPadding>
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/50">
            <SearchBar 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search fleet IDs, tags..." 
            />
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <EmptyState 
              icon="Compass" 
              title="No Fleet Selected" 
              description="Type search terms or select an item from the map to track." 
            />
          </div>
        </Card>

        {/* Right Map Canvas Column (2/3 width) */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-center relative overflow-hidden">
          <div className="text-center p-6">
            <EmptyState 
              icon="Map" 
              title="Geospatial Map Shell" 
              description="React Leaflet integration will render here." 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
