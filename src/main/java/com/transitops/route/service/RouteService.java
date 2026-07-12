package com.transitops.route.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.transitops.common.exception.ResourceNotFoundException;
import com.transitops.route.dto.RouteRequest;
import com.transitops.route.dto.RouteResponse;
import com.transitops.route.entity.Route;
import com.transitops.route.mapper.RouteMapper;
import com.transitops.route.repository.RouteRepository;

@Service
public class RouteService {

    private final RouteRepository repository;

    public RouteService(RouteRepository repository) {
        this.repository = repository;
    }

    // Create
    public RouteResponse createRoute(RouteRequest request) {

        Route route = RouteMapper.toEntity(request);

        Route savedRoute = repository.save(route);

        return RouteMapper.toResponse(savedRoute);
    }

    // Get All
    public List<RouteResponse> getAllRoutes() {

        return repository.findAll()
                .stream()
                .map(RouteMapper::toResponse)
                .collect(Collectors.toList());

    }

    // Get By Id
    public RouteResponse getRouteById(Long id) {

        Route route = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Route not found with id : " + id));

        return RouteMapper.toResponse(route);

    }

    // Update
    public RouteResponse updateRoute(Long id, RouteRequest request) {

        Route route = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Route not found with id : " + id));

        route.setRouteName(request.getRouteName());
        route.setSource(request.getSource());
        route.setDestination(request.getDestination());
        route.setDistance(request.getDistance());
        route.setEstimatedTime(request.getEstimatedTime());
        route.setStatus(request.getStatus());

        Route updatedRoute = repository.save(route);

        return RouteMapper.toResponse(updatedRoute);

    }

    // Delete
    public void deleteRoute(Long id) {

        Route route = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Route not found with id : " + id));

        repository.delete(route);

    }

}