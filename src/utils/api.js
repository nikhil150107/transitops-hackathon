import axios from 'axios';
import { 
  MOCK_VEHICLES, 
  MOCK_INCIDENTS, 
  MOCK_ROUTES, 
  MOCK_NOTIFICATIONS, 
  MOCK_RESPONDERS, 
  MOCK_ANALYTICS 
} from '../data/mockData';

// Setup base Axios instance
const apiInstance = axios.create({
  baseURL: localStorage.getItem('saarthi_api_url') || 'https://api.saarthi.gov.in/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Initialize localStorage mock databases if not present
const initDatabase = () => {
  if (!localStorage.getItem('saarthi_vehicles')) {
    localStorage.setItem('saarthi_vehicles', JSON.stringify(MOCK_VEHICLES));
  }
  if (!localStorage.getItem('saarthi_incidents')) {
    localStorage.setItem('saarthi_incidents', JSON.stringify(MOCK_INCIDENTS));
  }
  if (!localStorage.getItem('saarthi_routes')) {
    localStorage.setItem('saarthi_routes', JSON.stringify(MOCK_ROUTES));
  }
  if (!localStorage.getItem('saarthi_notifications')) {
    localStorage.setItem('saarthi_notifications', JSON.stringify(MOCK_NOTIFICATIONS));
  }
  if (!localStorage.getItem('saarthi_responders')) {
    localStorage.setItem('saarthi_responders', JSON.stringify(MOCK_RESPONDERS));
  }
};

initDatabase();

// Utility for simulated API latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Axios Configuration Helper
  updateBaseURL: (url) => {
    apiInstance.defaults.baseURL = url;
    localStorage.setItem('saarthi_api_url', url);
  },

  getBaseURL: () => {
    return apiInstance.defaults.baseURL;
  },

  // Vehicles Endpoints
  getVehicles: async () => {
    await delay(600);
    const data = localStorage.getItem('saarthi_vehicles');
    return JSON.parse(data);
  },

  updateVehicleStatus: async (id, status, alerts = []) => {
    await delay(400);
    const vehicles = JSON.parse(localStorage.getItem('saarthi_vehicles'));
    const updated = vehicles.map(v => {
      if (v.id === id) {
        return { 
          ...v, 
          status, 
          alerts: alerts,
          speed: status === 'Stopped' || status === 'SOS' ? 0 : v.speed
        };
      }
      return v;
    });
    localStorage.setItem('saarthi_vehicles', JSON.stringify(updated));
    return updated.find(v => v.id === id);
  },

  // Incidents Endpoints
  getIncidents: async () => {
    await delay(700);
    const data = localStorage.getItem('saarthi_incidents');
    return JSON.parse(data);
  },

  reportIncident: async (incident) => {
    await delay(800);
    const incidents = JSON.parse(localStorage.getItem('saarthi_incidents'));
    const newIncident = {
      id: `INC-2026-${String(incidents.length + 1).padStart(3, '0')}`,
      status: 'Reported',
      reportedAt: new Date().toISOString(),
      timeline: [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'Incident submitted to control center' }],
      ...incident
    };
    incidents.unshift(newIncident);
    localStorage.setItem('saarthi_incidents', JSON.stringify(incidents));
    
    // If vehicle ID is specified, update vehicle status to SOS or Stopped
    if (incident.vehicleId && incident.vehicleId !== 'None') {
      const severityStatus = incident.severity === 'Critical' ? 'SOS' : 'Stopped';
      await api.updateVehicleStatus(incident.vehicleId, severityStatus, [incident.type]);
    }

    return newIncident;
  },

  updateIncidentStatus: async (id, status, logMessage) => {
    await delay(500);
    const incidents = JSON.parse(localStorage.getItem('saarthi_incidents'));
    const updated = incidents.map(inc => {
      if (inc.id === id) {
        const timeline = [...inc.timeline];
        if (logMessage) {
          timeline.push({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            event: logMessage
          });
        }
        return { ...inc, status, timeline };
      }
      return inc;
    });
    localStorage.setItem('saarthi_incidents', JSON.stringify(updated));
    return updated.find(inc => inc.id === id);
  },

  // AI Route Optimizer Endpoints
  getRoutes: async () => {
    await delay(600);
    const data = localStorage.getItem('saarthi_routes');
    return JSON.parse(data);
  },

  optimizeRoute: async (id) => {
    await delay(1200); // Simulate complex AI computation
    const routes = JSON.parse(localStorage.getItem('saarthi_routes'));
    const route = routes.find(r => r.id === id);
    if (!route) throw new Error('Route not found');

    // Simulate route optimization application: Swap current details with optimized ones
    const vehicles = JSON.parse(localStorage.getItem('saarthi_vehicles'));
    const updatedVehicles = vehicles.map(v => {
      if (v.routeName.includes(route.name.split(' (')[0])) {
        return {
          ...v,
          delayMinutes: 0,
          status: 'On Time',
          alerts: v.alerts.filter(a => a !== 'High Traffic Area')
        };
      }
      return v;
    });
    localStorage.setItem('saarthi_vehicles', JSON.stringify(updatedVehicles));
    return { ...route, optimized: true };
  },

  // Notifications Endpoints
  getNotifications: async () => {
    await delay(500);
    const data = localStorage.getItem('saarthi_notifications');
    return JSON.parse(data);
  },

  sendNotification: async (notification) => {
    await delay(600);
    const notifications = JSON.parse(localStorage.getItem('saarthi_notifications'));
    const newNotification = {
      id: `NT-${500 + notifications.length + 1}`,
      reads: 0,
      sentAt: notification.status === 'Sent' 
        ? new Date().toISOString() 
        : `Scheduled for ${notification.scheduledTime || 'tomorrow'}`,
      ...notification
    };
    notifications.unshift(newNotification);
    localStorage.setItem('saarthi_notifications', JSON.stringify(notifications));
    return newNotification;
  },

  // Responders Endpoints
  getResponders: async () => {
    await delay(400);
    const data = localStorage.getItem('saarthi_responders');
    return JSON.parse(data);
  },

  dispatchResponder: async (responderId, incidentId) => {
    await delay(600);
    
    // Update responder status
    const responders = JSON.parse(localStorage.getItem('saarthi_responders'));
    const updatedResponders = responders.map(r => {
      if (r.id === responderId) {
        return { ...r, status: 'Dispatched' };
      }
      return r;
    });
    localStorage.setItem('saarthi_responders', JSON.stringify(updatedResponders));

    // Update incident log timeline
    const responder = responders.find(r => r.id === responderId);
    if (responder && incidentId) {
      await api.updateIncidentStatus(
        incidentId, 
        'Dispatched', 
        `Unit "${responder.name}" dispatched to site.`
      );
    }

    return updatedResponders;
  },

  // Analytics Endpoints
  getAnalytics: async () => {
    await delay(600);
    return MOCK_ANALYTICS;
  },

  // Reset helper
  resetSystemData: () => {
    localStorage.removeItem('saarthi_vehicles');
    localStorage.removeItem('saarthi_incidents');
    localStorage.removeItem('saarthi_routes');
    localStorage.removeItem('saarthi_notifications');
    localStorage.removeItem('saarthi_responders');
    initDatabase();
  }
};
