// Mock Data for Saarthi Smart Transport Operations Platform

// Delhi NCR coordinates for realistic Leaflet map rendering
export const MAP_CENTER = [28.6139, 77.2090]; // New Delhi, India

export const MOCK_VEHICLES = [
  {
    id: 'V-101',
    plateNumber: 'DL-1PD-4029',
    type: 'Bus',
    routeName: 'Route 412 (Noida Sec 62 to Dhaula Kuan)',
    status: 'On Time', // On Time, Delayed, Stopped, SOS
    lat: 28.6289,
    lng: 77.2150,
    speed: 42,
    passengers: 32,
    capacity: 50,
    fuelLevel: 78, // percentage or battery for EV
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
    isEV: true, // EV Bus!
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
    fuelLevel: 100, // Metro runs on overhead electricity
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
    id: 'V-105',
    plateNumber: 'DL-1RT-7731',
    type: 'Auto-rickshaw',
    routeName: 'Local Area (New Delhi Railway Station to CP)',
    status: 'On Time',
    lat: 28.6420,
    lng: 77.2190,
    speed: 28,
    passengers: 3,
    capacity: 3,
    fuelLevel: 85, // CNG
    isEV: false,
    driverName: 'Ramu Prasad',
    driverPhone: '+91 95555 44444',
    nextStop: 'CP Outer Circle',
    delayMinutes: 0,
    alerts: []
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
    fuelLevel: 12, // Critical battery
    isEV: true,
    driverName: 'Manpreet Singh',
    driverPhone: '+91 91111 22222',
    nextStop: 'Dhaula Kuan flyover',
    delayMinutes: 25,
    alerts: ['Engine Malfunction', 'Critical Battery', 'SOS Triggered']
  },
  {
    id: 'V-107',
    plateNumber: 'DL-1PD-9021',
    type: 'Bus',
    routeName: 'Route 340 (Mayur Vihar Ph-III to CP)',
    status: 'On Time',
    lat: 28.6180,
    lng: 77.2400,
    speed: 35,
    passengers: 20,
    capacity: 50,
    fuelLevel: 62,
    isEV: true,
    driverName: 'Harish Rawat',
    driverPhone: '+91 98345 67890',
    nextStop: 'Pragati Maidan Metro',
    delayMinutes: 0,
    alerts: []
  }
];

export const MOCK_INCIDENTS = [
  {
    id: 'INC-2026-001',
    type: 'Accident', // Accident, Breakdown, Congestion, Medical, Weather
    vehicleId: 'V-102',
    location: 'AIIMS Ring Road Flyover',
    route: 'Route 520',
    severity: 'High', // Low, Medium, High, Critical
    status: 'In Progress', // Reported, In Progress, Dispatched, Resolved
    reportedAt: '2026-07-12T10:15:00+05:30',
    assignee: 'Inspector Neeraj Singh',
    description: 'Minor collision between Bus DL-1PD-8891 and an SUV. No severe injuries, but blocking one lane of the flyover causing severe tailbacks.',
    timeline: [
      { time: '10:15 AM', event: 'Incident reported by driver Sanjay Singh' },
      { time: '10:18 AM', event: 'Operator assigned Incident to Traffic Control Unit' },
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
    description: 'EV Taxi DL-3C-EV-1234 suffered complete battery failure and power steering lock on the flyover peak. Passengers are stranded. Driver triggered SOS.',
    timeline: [
      { time: '10:45 AM', event: 'SOS alert received from Vehicle V-106' },
      { time: '10:47 AM', event: 'Operator made phone contact with driver Manpreet. Stranded passengers confirmed.' },
      { time: '10:50 AM', event: 'Flatbed tow-truck and backup EV Taxi dispatched from Dwarka depot' }
    ]
  },
  {
    id: 'INC-2026-003',
    type: 'Traffic Congestion',
    vehicleId: 'None',
    location: 'Gurugram-Delhi Border Toll Plaza',
    route: 'NH-48 Corridor',
    severity: 'Medium',
    status: 'Reported',
    reportedAt: '2026-07-12T11:02:00+05:30',
    assignee: 'AI System Autopilot',
    description: 'Heavy congestion due to sudden vehicle checks by Border Police. Queue length exceeds 1.8km. Average speed dropped to 8 km/h.',
    timeline: [
      { time: '11:02 AM', event: 'AI system detected abnormal speed drops' },
      { time: '11:05 AM', event: 'Commuters flagged congestion on Saarthi App portal' }
    ]
  },
  {
    id: 'INC-2026-004',
    type: 'Medical Emergency',
    vehicleId: 'V-103',
    location: 'Rajiv Chowk Metro Station Platform 2',
    route: 'Blue Line Metro',
    severity: 'High',
    status: 'Resolved',
    reportedAt: '2026-07-12T09:20:00+05:30',
    assignee: 'Rajiv Chowk Station Manager',
    description: 'Senior citizen passenger complained of acute chest pain. Fellow passengers alerted train driver, who notified Rajiv Chowk controllers.',
    timeline: [
      { time: '09:20 AM', event: 'Train operator alerted control room' },
      { time: '09:23 AM', event: 'Station medical room staff reached the platform with a stretcher' },
      { time: '09:35 AM', event: 'Ambulance team took patient to RML Hospital. Condition stabilized.' },
      { time: '09:50 AM', event: 'Incident closed as resolved' }
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
    congestionCurrent: 75, // percentage
    congestionOptimized: 30,
    fuelSavedPercent: 18,
    co2SavedKg: 4.8,
    reason: 'Heavy bottleneck at Pragati Maidan. AI suggests re-routing via Barapullah Flyover.',
    currentPath: [
      [28.6289, 77.3750], // Noida Sec 62
      [28.6180, 77.2800], // Mayur Vihar
      [28.6139, 77.2400], // Pragati Maidan (Heavy Congestion)
      [28.6200, 77.2150], // CP
      [28.5912, 77.1650]  // Dhaula Kuan
    ],
    optimizedPath: [
      [28.6289, 77.3750], // Noida Sec 62
      [28.6180, 77.2800], // Mayur Vihar
      [28.5800, 77.2600], // Sarai Kale Khan
      [28.5750, 77.2200], // Barapullah Bypass (Free Flowing)
      [28.5912, 77.1650]  // Dhaula Kuan
    ]
  },
  {
    id: 'R-OPT-02',
    name: 'Janakpuri to CP (Route 879)',
    distanceCurrent: 18.2,
    distanceOptimized: 19.5, // Slightly longer but much faster!
    timeCurrent: 60,
    timeOptimized: 40,
    congestionCurrent: 88,
    congestionOptimized: 15,
    fuelSavedPercent: 22,
    co2SavedKg: 3.9,
    reason: 'Accident blocks Ring Road at Patel Nagar. Suggest using outer link road through Kirti Nagar.',
    currentPath: [
      [28.6210, 77.0870], // Janakpuri
      [28.6410, 77.1250], // Rajouri Garden
      [28.6500, 77.1550], // Patel Nagar (ACCIDENT)
      [28.6430, 77.1850], // Karol Bagh
      [28.6300, 77.2150]  // CP
    ],
    optimizedPath: [
      [28.6210, 77.0870], // Janakpuri
      [28.6410, 77.1250], // Rajouri Garden
      [28.6250, 77.1350], // Kirti Nagar industrial area
      [28.6100, 77.1750], // Pusa Road
      [28.6300, 77.2150]  // CP
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'NT-501',
    title: 'Waterlogging Delay on Route 520',
    message: 'Due to heavy monsoon rainfall and waterlogging at AIIMS underpass, Route 520 is facing delays of up to 20 minutes. Commuters are advised to take Blue Line Metro where possible.',
    channel: 'All Channels (SMS, App, Station)',
    target: 'Route 520 Commuters',
    status: 'Sent',
    sentAt: '2026-07-12T10:30:00+05:30',
    reads: 4890
  },
  {
    id: 'NT-502',
    title: 'Track Maintenance Blue Line',
    message: 'Scheduled track maintenance on the Blue Line Metro between Dwarka Sec 12 and Sec 21 on Sunday (July 19) from 00:00 to 04:00 AM. Service will run normally post 5:00 AM.',
    channel: 'App & Station Display',
    target: 'Blue Line Regulars',
    status: 'Scheduled',
    sentAt: 'Scheduled for 2026-07-18T18:00:00+05:30',
    reads: 0
  },
  {
    id: 'NT-503',
    title: 'Dhaula Kuan SOS Alert',
    message: 'Emergency responders are active on Dhaula Kuan Flyover. Traffic is reduced to single lane. Expect congestion. Secondary dispatch units on route.',
    channel: 'App Push Notification',
    target: '5km Radius of Dhaula Kuan',
    status: 'Sent',
    sentAt: '2026-07-12T10:52:00+05:30',
    reads: 12900
  },
  {
    id: 'NT-504',
    title: 'Independence Day Special Schedules',
    message: 'Please note extra train operations will be active on August 15th to support flag hoisting event attendees. Free rides for school children with ID cards.',
    channel: 'Station Display Only',
    target: 'All Metro Stations',
    status: 'Draft',
    sentAt: 'Not Sent Yet',
    reads: 0
  }
];

export const MOCK_RESPONDERS = [
  { id: 'RSP-01', name: 'Delhi Traffic Police Unit 4', type: 'Police', status: 'On Scene', contact: '+91 100', lat: 28.6010, lng: 77.1880 },
  { id: 'RSP-02', name: 'CAT Ambulance Service #09', type: 'Ambulance', status: 'Dispatched', contact: '+91 102', lat: 28.6110, lng: 77.1790 },
  { id: 'RSP-03', name: 'Fire Engine Station Connaught Place', type: 'Fire', status: 'Available', contact: '+91 101', lat: 28.6300, lng: 77.2150 },
  { id: 'RSP-04', name: 'Saarthi Heavy Tow & Flatbed Flat 4', type: 'Assistance', status: 'Dispatched', contact: '+91 1800-SAARTHI', lat: 28.6000, lng: 77.1690 }
];

export const MOCK_ANALYTICS = {
  ridershipTrends: [
    { name: 'Mon', bus: 12000, metro: 45000, cabs: 3400 },
    { name: 'Tue', bus: 14000, metro: 48000, cabs: 3900 },
    { name: 'Wed', bus: 13500, metro: 49000, cabs: 4100 },
    { name: 'Thu', bus: 15000, metro: 51000, cabs: 4200 },
    { name: 'Fri', bus: 16200, metro: 54000, cabs: 4800 },
    { name: 'Sat', bus: 9800, metro: 32000, cabs: 2900 },
    { name: 'Sun', bus: 7500, metro: 25000, cabs: 2100 }
  ],
  peakHours: [
    { time: '06:00', busOccupancy: 20, metroOccupancy: 30 },
    { time: '08:00', busOccupancy: 68, metroOccupancy: 85 },
    { time: '10:00', busOccupancy: 85, metroOccupancy: 95 },
    { time: '12:00', busOccupancy: 45, metroOccupancy: 60 },
    { time: '14:00', busOccupancy: 40, metroOccupancy: 55 },
    { time: '16:00', busOccupancy: 55, metroOccupancy: 70 },
    { time: '18:00', busOccupancy: 90, metroOccupancy: 98 },
    { time: '20:00', busOccupancy: 70, metroOccupancy: 80 },
    { time: '22:00', busOccupancy: 35, metroOccupancy: 40 }
  ],
  carbonReduction: [
    { month: 'Jan', traditionalCo2: 1200, evCo2Saved: 340 },
    { month: 'Feb', traditionalCo2: 1180, evCo2Saved: 380 },
    { month: 'Mar', traditionalCo2: 1250, evCo2Saved: 420 },
    { month: 'Apr', traditionalCo2: 1300, evCo2Saved: 490 },
    { month: 'May', traditionalCo2: 1320, evCo2Saved: 550 },
    { month: 'Jun', traditionalCo2: 1280, evCo2Saved: 590 }
  ],
  operationalUptime: [
    { name: 'Bus Fleet', value: 98.4 },
    { name: 'Metro Lines', value: 99.9 },
    { name: 'EV Taxi', value: 97.2 },
    { name: 'Command API', value: 99.9 }
  ]
};
