package com.transitops.vehicle.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.transitops.vehicle.dto.VehicleRequest;
import com.transitops.vehicle.dto.VehicleResponse;
import com.transitops.vehicle.service.VehicleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    @PostMapping
    public VehicleResponse createVehicle(@Valid @RequestBody VehicleRequest request) {
        return service.save(request);
    }

    @GetMapping
    public List<VehicleResponse> getAllVehicles() {
        return service.getAll();
    }
}