package com.transitops.vehicle.mapper;

import com.transitops.vehicle.dto.VehicleRequest;
import com.transitops.vehicle.dto.VehicleResponse;
import com.transitops.vehicle.entity.Vehicle;

public class VehicleMapper {

    public static Vehicle toEntity(VehicleRequest request) {

        Vehicle vehicle = new Vehicle();

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setDriverName(request.getDriverName());
        vehicle.setCurrentLatitude(request.getCurrentLatitude());
        vehicle.setCurrentLongitude(request.getCurrentLongitude());
        vehicle.setSpeed(request.getSpeed());
        vehicle.setStatus(request.getStatus());

        return vehicle;
    }

    public static VehicleResponse toResponse(Vehicle vehicle) {

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