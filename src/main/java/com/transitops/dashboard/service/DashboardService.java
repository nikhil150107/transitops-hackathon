package com.transitops.dashboard.service;

import org.springframework.stereotype.Service;

import com.transitops.dashboard.dto.DashboardResponse;
import com.transitops.incident.entity.IncidentStatus;
import com.transitops.incident.repository.IncidentRepository;
import com.transitops.user.repository.UserRepository;
import com.transitops.vehicle.repository.VehicleRepository;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final IncidentRepository incidentRepository;

    public DashboardService(UserRepository userRepository,
                            VehicleRepository vehicleRepository,
                            IncidentRepository incidentRepository) {

        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.incidentRepository = incidentRepository;
    }

    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        response.setTotalUsers(userRepository.count());
        response.setTotalVehicles(vehicleRepository.count());
        response.setTotalIncidents(incidentRepository.count());
        response.setActiveIncidents(
                incidentRepository.countByStatus(IncidentStatus.OPEN));

        return response;
    }

}