package com.transitops.route.mapper;

import com.transitops.route.dto.RouteRequest;
import com.transitops.route.dto.RouteResponse;
import com.transitops.route.entity.Route;

public class RouteMapper {

    public static Route toEntity(RouteRequest request){

        Route route = new Route();

        route.setRouteName(request.getRouteName());
        route.setSource(request.getSource());
        route.setDestination(request.getDestination());
        route.setDistance(request.getDistance());
        route.setEstimatedTime(request.getEstimatedTime());
        route.setStatus(request.getStatus());

        return route;
    }

    public static RouteResponse toResponse(Route route){

        RouteResponse response = new RouteResponse();

        response.setId(route.getId());
        response.setRouteName(route.getRouteName());
        response.setSource(route.getSource());
        response.setDestination(route.getDestination());
        response.setDistance(route.getDistance());
        response.setEstimatedTime(route.getEstimatedTime());
        response.setStatus(route.getStatus());

        return response;
    }

}