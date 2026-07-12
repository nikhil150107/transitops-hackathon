package com.transitops.vehicle.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transitops.vehicle.dto.VehicleRequest;
import com.transitops.vehicle.dto.VehicleResponse;
import com.transitops.vehicle.entity.Vehicle;
import com.transitops.vehicle.mapper.VehicleMapper;
import com.transitops.vehicle.repository.VehicleRepository;

@Service
public class VehicleService {
	
	public VehicleService(VehicleRepository repository) {
        this.repository = repository;
    }
	
	@Autowired
    private final VehicleRepository repository;

	public VehicleResponse save(VehicleRequest request) {

	    Vehicle vehicle = VehicleMapper.toEntity(request);

	    Vehicle savedVehicle = repository.save(vehicle);

	    return VehicleMapper.toResponse(savedVehicle);
	}

	public List<VehicleResponse> getAll() {

	    return repository.findAll()
	            .stream()
	            .map(VehicleMapper::toResponse)
	            .toList();
	}

    private VehicleResponse map(Vehicle vehicle) {

        VehicleResponse response = new VehicleResponse();

        response.setId(vehicle.getId());
        response.setVehicleNumber(vehicle.getVehicleNumber());
        response.setVehicleType(vehicle.getVehicleType());
        response.setDriverName(vehicle.getDriverName());
        response.setCurrentLatitude(vehicle.getCurrentLatitude());
        response.setCurrentLongitude(vehicle.getCurrentLongitude());
        response.setSpeed(vehicle.getSpeed());
        response.setStatus(vehicle.getStatus());

        return response;
    }

}