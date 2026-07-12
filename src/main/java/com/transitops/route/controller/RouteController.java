package com.transitops.route.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.transitops.common.dto.ApiResponse;
import com.transitops.route.dto.RouteRequest;
import com.transitops.route.dto.RouteResponse;
import com.transitops.route.service.RouteService;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService service;

    public RouteController(RouteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(
            @RequestBody RouteRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Route Created Successfully",
                        service.createRoute(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes() {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Route List",
                        service.getAllRoutes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Route Found",
                        service.getRouteById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(
            @PathVariable Long id,
            @RequestBody RouteRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Route Updated Successfully",
                        service.updateRoute(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRoute(
            @PathVariable Long id) {

        service.deleteRoute(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Route Deleted Successfully",
                        null));
    }

}