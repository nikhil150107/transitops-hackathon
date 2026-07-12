import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as Icons from 'lucide-react';

// Custom Marker Generator
const createVehicleMarker = (type, status) => {
  let color = '#3b82f6'; // default primary blue
  let animate = false;

  switch (status) {
    case 'On Time':
      color = '#10b981'; // emerald
      break;
    case 'Delayed':
      color = '#f59e0b'; // amber
      break;
    case 'Stopped':
      color = '#64748b'; // slate gray
      break;
    case 'SOS':
      color = '#ef4444'; // red
      animate = true;
      break;
    default:
      color = '#3b82f6';
  }

  const iconHtml = `
    <div class="relative flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-lg border-2 transition-all duration-300" style="border-color: ${color}">
      ${animate ? `
        <span class="absolute inset-0 rounded-full h-full w-full bg-rose-500 animate-ping opacity-60"></span>
        <span class="absolute -inset-1 rounded-full h-11 w-11 border border-rose-500 animate-pulse opacity-40"></span>
      ` : ''}
      <div class="w-7 h-7 rounded-full flex items-center justify-center text-[15px]" style="background-color: ${color}">
        ${type === 'Bus' ? '🚌' : type === 'Metro' ? '🚇' : type === 'Auto-rickshaw' ? '🛺' : '🚕'}
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-vehicle-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Map helper to auto-pan/fly to selected vehicle coordinates
const MapController = ({ selectedVehicle }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedVehicle) {
      map.flyTo([selectedVehicle.lat, selectedVehicle.lng], 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedVehicle, map]);

  return null;
};

const LiveMap = ({ vehicles = [], selectedVehicle = null, onSelectVehicle = null }) => {
  const defaultCenter = [28.6139, 77.2090]; // Delhi NCR Center
  
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60 shadow-sm z-10">
      
      {/* MAP LAYER */}
      <MapContainer 
        center={selectedVehicle ? [selectedVehicle.lat, selectedVehicle.lng] : defaultCenter} 
        zoom={12} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic Markers */}
        {vehicles.map((v) => (
          <Marker 
            key={v.id} 
            position={[v.lat, v.lng]} 
            icon={createVehicleMarker(v.type, v.status)}
            eventHandlers={{
              click: () => {
                if (onSelectVehicle) onSelectVehicle(v);
              }
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1 w-64 text-slate-800 dark:text-slate-200">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {v.id}
                    </span>
                    <span className="ml-2 font-bold text-xs">{v.plateNumber}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    v.status === 'On Time' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    v.status === 'Delayed' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                    v.status === 'SOS' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse' :
                    'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {v.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs">
                  <p className="font-semibold text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Route:</span> {v.routeName}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 py-1">
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <Icons.Gauge className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>Speed: <b>{v.speed} km/h</b></span>
                    </div>
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <Icons.BatteryCharging className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>Power: <b>{v.fuelLevel}%</b></span>
                    </div>
                  </div>

                  {/* Passenger occupancy bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>Occupancy ({v.passengers}/{v.capacity})</span>
                      <span>{Math.round((v.passengers / v.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          (v.passengers / v.capacity) > 0.85 ? 'bg-rose-500' :
                          (v.passengers / v.capacity) > 0.6 ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min((v.passengers / v.capacity) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-[11px]">
                    <div className="text-slate-500 dark:text-slate-400">
                      Driver: <b>{v.driverName}</b>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500">{v.nextStop.split(' (')[0]}</span>
                  </div>

                </div>

              </div>
            </Popup>
          </Marker>
        ))}

        {/* Map Focus Controller */}
        <MapController selectedVehicle={selectedVehicle} />

      </MapContainer>

      {/* FLOATING LEGEND */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-medium space-y-1.5 shadow-md max-w-[150px]">
        <h4 className="font-bold border-b border-slate-100 dark:border-slate-700 pb-1 mb-1.5 text-slate-700 dark:text-slate-300">Fleet Status</h4>
        <div className="flex items-center text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
          <span>On Time</span>
        </div>
        <div className="flex items-center text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></span>
          <span>Delayed</span>
        </div>
        <div className="flex items-center text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 mr-2"></span>
          <span>Stopped</span>
        </div>
        <div className="flex items-center text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
          <span>Emergency SOS</span>
        </div>
      </div>

    </div>
  );
};

export default LiveMap;
