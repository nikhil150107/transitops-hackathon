package com.transitops.vehicle.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.transitops.vehicle.dto.VehicleRequest;
import com.transitops.vehicle.dto.VehicleResponse;
import com.transitops.vehicle.service.VehicleService;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    @PostMapping
    public VehicleResponse createVehicle(@RequestBody VehicleRequest request) {
        return service.save(request);
    }

    @GetMapping
    public List<VehicleResponse> getAllVehicles() {
        return service.getAll();
    }
}