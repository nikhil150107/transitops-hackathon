package com.transitops.route.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.transitops.route.entity.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {

}