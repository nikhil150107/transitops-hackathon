import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as Icons from 'lucide-react';

// Custom Markers for Terminals
const createTerminalMarker = (label, color) => {
  const html = `
    <div class="flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 shadow-md text-[10px] font-bold text-slate-800 dark:text-slate-200" style="border-color: ${color}">
      ${label}
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-terminal-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const FitMapBounds = ({ currentPath, optimizedPath }) => {
  const map = useMap();

  useEffect(() => {
    if (currentPath && currentPath.length > 0) {
      const bounds = L.latLngBounds([...currentPath, ...optimizedPath]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [currentPath, optimizedPath, map]);

  return null;
};

const RouteMap = ({ route = null }) => {
  const defaultCenter = [28.6139, 77.2090];
  
  if (!route) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <p className="text-slate-400 dark:text-slate-500 font-medium">Select a routing recommendation to visualize pathing maps.</p>
      </div>
    );
  }

  const startPoint = route.currentPath[0];
  const endPoint = route.currentPath[route.currentPath.length - 1];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60 shadow-sm z-10">
      
      <MapContainer 
        center={startPoint || defaultCenter} 
        zoom={12} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Start and End Markers */}
        {startPoint && (
          <Marker position={startPoint} icon={createTerminalMarker('A', '#3b82f6')}>
            <Popup className="custom-popup">
              <div className="p-1 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Terminal A (Origin)</span>
              </div>
            </Popup>
          </Marker>
        )}

        {endPoint && (
          <Marker position={endPoint} icon={createTerminalMarker('B', '#10b981')}>
            <Popup className="custom-popup">
              <div className="p-1 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Terminal B (Destination)</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Current Congested Route Path */}
        <Polyline 
          positions={route.currentPath} 
          pathOptions={{ 
            color: '#ef4444', 
            weight: 5, 
            opacity: 0.65, 
            dashArray: '8, 8' 
          }} 
        />

        {/* Optimized Clean Route Path */}
        <Polyline 
          positions={route.optimizedPath} 
          pathOptions={{ 
            color: '#10b981', 
            weight: 6, 
            opacity: 0.9 
          }} 
        />

        {/* Fit Bounds Automatically */}
        <FitMapBounds currentPath={route.currentPath} optimizedPath={route.optimizedPath} />

      </MapContainer>

      {/* Floating Panel showing overlay values */}
      <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-lg max-w-[220px] space-y-2">
        <h4 className="font-bold border-b border-slate-100 dark:border-slate-700 pb-1 mb-2 text-slate-800 dark:text-slate-200">Overlay Diagnostics</h4>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-rose-500">
            <span className="w-3 h-0.5 border-t-4 border-dashed border-rose-500 mr-2"></span>
            <span>Current Path</span>
          </div>
          <span className="text-[10px] bg-rose-50 dark:bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded">
            {route.congestionCurrent}% Traffic
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-emerald-500">
            <span className="w-3 h-1 bg-emerald-500 mr-2 rounded"></span>
            <span>AI Suggestion</span>
          </div>
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded">
            {route.congestionOptimized}% Traffic
          </span>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span>CO2 Avoided:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{route.co2SavedKg} kg</span>
        </div>
      </div>

    </div>
  );
};

export default RouteMap;
