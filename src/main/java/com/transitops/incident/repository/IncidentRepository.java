package com.transitops.incident.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.transitops.incident.entity.Incident;
import com.transitops.incident.entity.IncidentStatus;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
	long countByStatus(IncidentStatus status);
	
}