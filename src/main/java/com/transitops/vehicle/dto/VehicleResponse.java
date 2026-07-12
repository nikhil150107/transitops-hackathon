package com.transitops.vehicle.dto;

import com.transitops.vehicle.entity.VehicleStatus;
import com.transitops.vehicle.entity.VehicleType;

public class VehicleResponse {

    private Long id;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String driverName;
    private Double currentLatitude;
    private Double currentLongitude;
    private Double speed;
    private VehicleStatus status;

    // No-Args Constructor
    public VehicleResponse() {
    }

    // All-Args Constructor
    public VehicleResponse(Long id, String vehicleNumber, VehicleType vehicleType,
                           String driverName, Double currentLatitude,
                           Double currentLongitude, Double speed,
                           VehicleStatus status) {
        this.id = id;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.driverName = driverName;
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
        this.speed = speed;
        this.status = status;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public VehicleType getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public Double getCurrentLatitude() {
        return currentLatitude;
    }

    public void setCurrentLatitude(Double currentLatitude) {
        this.currentLatitude = currentLatitude;
    }

    public Double getCurrentLongitude() {
        return currentLongitude;
    }

    public void setCurrentLongitude(Double currentLongitude) {
        this.currentLongitude = currentLongitude;
    }

    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }
}