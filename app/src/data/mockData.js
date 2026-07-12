// Mock Databases for Pravaah Smart Transport Operations Platform

// Delhi NCR coordinates for realistic Leaflet map rendering
export const MAP_CENTER = [28.6139, 77.2090]; // New Delhi, India

// --- LOGISTICS ERP WIREFRAME DATA ---
export const MOCK_KPI_STATS = {
  activeVehicles: 53,
  availableVehicles: 42,
  vehiclesInMaintenance: 5,
  activeTrips: 18,
  pendingTrips: 9,
  driversOnDuty: 26,
  fleetUtilization: 81
};

export const MOCK_VEHICLE_STATUS_ANALYTICS = [
  { status: 'Available', count: 42, color: 'bg-emerald-500', max: 53 },
  { status: 'On Trip', count: 18, color: 'bg-blue-500', max: 53 },
  { status: 'In Shop', count: 5, color: 'bg-amber-500', max: 53 },
  { status: 'Retired', count: 2, color: 'bg-rose-500', max: 53 }
];

export const MOCK_TRIPS = [
  {
    tripId: 'TR001',
    vehicle: 'VAN-05',
    vehicleType: 'Van',
    driver: 'Alex',
    status: 'On Trip', // On Trip, Completed, Dispatched, Draft
    eta: '45 min',
    region: 'North',
    date: '2026-07-12'
  },
  {
    tripId: 'TR002',
    vehicle: 'TRK-12',
    vehicleType: 'Truck',
    driver: 'John',
    status: 'Completed',
    eta: '—',
    region: 'South',
    date: '2026-07-12'
  },
  {
    tripId: 'TR003',
    vehicle: 'MINI-08',
    vehicleType: 'Mini-van',
    driver: 'Priya',
    status: 'Dispatched',
    eta: '1h 10m',
    region: 'East',
    date: '2026-07-12'
  },
  {
    tripId: 'TR004',
    vehicle: '—',
    vehicleType: '—',
    driver: '—',
    status: 'Draft',
    eta: 'Awaiting vehicle',
    region: 'West',
    date: '2026-07-12'
  },
  {
    tripId: 'TR005',
    vehicle: 'VAN-11',
    vehicleType: 'Van',
    driver: 'Robert',
    status: 'On Trip',
    eta: '20 min',
    region: 'North',
    date: '2026-07-12'
  },
  {
    tripId: 'TR006',
    vehicle: 'TRK-09',
    vehicleType: 'Truck',
    driver: 'Meera',
    status: 'In Shop',
    eta: 'In Maintenance',
    region: 'South',
    date: '2026-07-12'
  },
  {
    tripId: 'TR007',
    vehicle: 'MINI-02',
    vehicleType: 'Mini-van',
    driver: 'Dev',
    status: 'Available',
    eta: '—',
    region: 'West',
    date: '2026-07-12'
  }
];

export const FILTER_OPTIONS = {
  vehicleTypes: ['All', 'Van', 'Truck', 'Mini-van'],
  vehicleStatuses: ['All', 'On Trip', 'Completed', 'Dispatched', 'Draft', 'Available', 'In Shop', 'Retired'],
  regions: ['All', 'North', 'South', 'East', 'West']
};

// --- PRESET VEHICLES & INCIDENTS DATABASE FOR API INTEGRATION ---
export const MOCK_VEHICLES = [
  {
    id: 'V-101',
    plateNumber: 'DL-1PD-4029',
    type: 'Bus',
    routeName: 'Route 412 (Noida Sec 62 to Dhaula Kuan)',
    status: 'On Time',
    lat: 28.6289,
    lng: 77.2150,
    speed: 42,
    passengers: 32,
    capacity: 50,
    fuelLevel: 78,
    isEV: false,
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98765 43210',
    nextStop: 'Connaught Place',
    delayMinutes: 0,
    alerts: []
  },
  {
    id: 'V-102',
    plateNumber: 'DL-1PD-8891',
    type: 'Bus',
    routeName: 'Route 520 (Munirka to Anand Vihar)',
    status: 'Delayed',
    lat: 28.6015,
    lng: 77.1890,
    speed: 15,
    passengers: 48,
    capacity: 50,
    fuelLevel: 45,
    isEV: true,
    driverName: 'Sanjay Singh',
    driverPhone: '+91 98123 45678',
    nextStop: 'AIIMS Gate 1',
    delayMinutes: 18,
    alerts: ['High Traffic Area', 'Battery Warning']
  },
  {
    id: 'V-103',
    plateNumber: 'DL-2C-AA-0921',
    type: 'Metro',
    routeName: 'Blue Line (Dwarka to Noida Electronic City)',
    status: 'On Time',
    lat: 28.6304,
    lng: 77.2277,
    speed: 72,
    passengers: 820,
    capacity: 1000,
    fuelLevel: 100,
    isEV: true,
    driverName: 'Amit Sharma',
    driverPhone: '+91 99999 88888',
    nextStop: 'Rajiv Chowk',
    delayMinutes: 0,
    alerts: []
  },
  {
    id: 'V-104',
    plateNumber: 'DL-2C-AA-0542',
    type: 'Metro',
    routeName: 'Yellow Line (Samaypur Badli to Huda City Centre)',
    status: 'Stopped',
    lat: 28.5850,
    lng: 77.2120,
    speed: 0,
    passengers: 230,
    capacity: 1000,
    fuelLevel: 98,
    isEV: true,
    driverName: 'Vikram Malhotra',
    driverPhone: '+91 97777 66666',
    nextStop: 'Jor Bagh (Signal Waiting)',
    delayMinutes: 5,
    alerts: ['Signal Latency']
  },
  {
    id: 'V-106',
    plateNumber: 'DL-3C-EV-1234',
    type: 'EV Taxi',
    routeName: 'Airport Shuttle (IGI Airport to CP)',
    status: 'SOS',
    lat: 28.5912,
    lng: 77.1650,
    speed: 0,
    passengers: 2,
    capacity: 4,
    fuelLevel: 12,
    isEV: true,
    driverName: 'Manpreet Singh',
    driverPhone: '+91 91111 22222',
    nextStop: 'Dhaula Kuan flyover',
    delayMinutes: 25,
    alerts: ['Engine Malfunction', 'Critical Battery', 'SOS Triggered']
  }
];

export const MOCK_INCIDENTS = [
  {
    id: 'INC-2026-001',
    type: 'Accident',
    vehicleId: 'V-102',
    location: 'AIIMS Ring Road Flyover',
    route: 'Route 520',
    severity: 'High',
    status: 'In Progress',
    reportedAt: '2026-07-12T10:15:00+05:30',
    assignee: 'Inspector Neeraj Singh',
    description: 'Minor collision between Bus DL-1PD-8891 and an SUV.',
    timeline: [
      { time: '10:15 AM', event: 'Incident reported by driver Sanjay Singh' },
      { time: '10:25 AM', event: 'Traffic police units dispatched to location' }
    ]
  },
  {
    id: 'INC-2026-002',
    type: 'Breakdown',
    vehicleId: 'V-106',
    location: 'Dhaula Kuan Flyover Northbound',
    route: 'Airport Shuttle',
    severity: 'Critical',
    status: 'Dispatched',
    reportedAt: '2026-07-12T10:45:00+05:30',
    assignee: 'Emergency Dispatcher Anita',
    description: 'EV Taxi DL-3C-EV-1234 suffered complete battery failure on flyover peak.',
    timeline: [
      { time: '10:45 AM', event: 'SOS alert received from Vehicle V-106' },
      { time: '10:50 AM', event: 'Flatbed tow-truck and backup EV Taxi dispatched' }
    ]
  }
];

export const MOCK_ROUTES = [
  {
    id: 'R-OPT-01',
    name: 'Sector 62 to Dhaula Kuan (Route 412)',
    distanceCurrent: 28.5,
    distanceOptimized: 26.2,
    timeCurrent: 75,
    timeOptimized: 52,
    congestionCurrent: 75,
    congestionOptimized: 30,
    fuelSavedPercent: 18,
    co2SavedKg: 4.8,
    reason: 'Heavy bottleneck at Pragati Maidan. AI suggests re-routing via Barapullah Flyover.',
    currentPath: [
      [28.6289, 77.3750],
      [28.6180, 77.2800],
      [28.6139, 77.2400],
      [28.5912, 77.1650]
    ],
    optimizedPath: [
      [28.6289, 77.3750],
      [28.6180, 77.2800],
      [28.5800, 77.2600],
      [28.5912, 77.1650]
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'NT-501',
    title: 'Waterlogging Delay on Route 520',
    message: 'Due to heavy monsoon rainfall and waterlogging at AIIMS underpass, Route 520 is facing delays.',
    channel: 'All Channels (SMS, App, Station)',
    target: 'Route 520 Commuters',
    status: 'Sent',
    sentAt: '2026-07-12T10:30:00+05:30',
    reads: 4890
  }
];

export const MOCK_RESPONDERS = [
  { id: 'RSP-01', name: 'Delhi Traffic Police Unit 4', type: 'Police', status: 'On Scene', contact: '+91 100', lat: 28.6010, lng: 77.1880 }
];

export const MOCK_ANALYTICS = {
  ridershipTrends: [
    { name: 'Mon', bus: 12000, metro: 45000, cabs: 3400 },
    { name: 'Tue', bus: 14000, metro: 48000, cabs: 3900 }
  ],
  peakHours: [
    { time: '06:00', busOccupancy: 20, metroOccupancy: 30 }
  ],
  carbonReduction: [
    { month: 'Jan', traditionalCo2: 1200, evCo2Saved: 340 }
  ],
  operationalUptime: [
    { name: 'Bus Fleet', value: 98.4 }
  ]
};
