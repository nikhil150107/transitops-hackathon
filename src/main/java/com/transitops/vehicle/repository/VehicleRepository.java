package com.transitops.vehicle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.transitops.vehicle.entity.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

}