package com.transitops.incident.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.transitops.common.dto.ApiResponse;
import com.transitops.incident.dto.IncidentRequest;
import com.transitops.incident.dto.IncidentResponse;
import com.transitops.incident.service.IncidentService;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService service;

    public IncidentController(IncidentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IncidentResponse>> createIncident(
            @RequestBody IncidentRequest request) {

        IncidentResponse response = service.createIncident(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Incident Created Successfully", response));

    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<IncidentResponse>>> getAllIncidents() {

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Incident List",
                        service.getAllIncidents()));

    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncidentResponse>> getIncidentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Incident Found",
                        service.getIncidentById(id)));

    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IncidentResponse>> updateIncident(
            @PathVariable Long id,
            @RequestBody IncidentRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Incident Updated",
                        service.updateIncident(id, request)));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteIncident(
            @PathVariable Long id) {

        service.deleteIncident(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Incident Deleted Successfully",
                        null));

    }

}