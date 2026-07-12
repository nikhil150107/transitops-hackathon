package com.transitops.incident.mapper;

import com.transitops.incident.dto.IncidentRequest;
import com.transitops.incident.dto.IncidentResponse;
import com.transitops.incident.entity.Incident;

public class IncidentMapper {

    public static Incident toEntity(IncidentRequest request) {

        Incident incident = new Incident();

        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setIncidentType(request.getIncidentType());
        incident.setSeverity(request.getSeverity());
        incident.setLatitude(request.getLatitude());
        incident.setLongitude(request.getLongitude());
        incident.setStatus(request.getStatus());
        incident.setReportedBy(request.getReportedBy());

        return incident;
    }

    public static IncidentResponse toResponse(Incident incident) {

        IncidentResponse response = new IncidentResponse();

        response.setId(incident.getId());
        response.setTitle(incident.getTitle());
        response.setDescription(incident.getDescription());
        response.setIncidentType(incident.getIncidentType());
        response.setSeverity(incident.getSeverity());
        response.setLatitude(incident.getLatitude());
        response.setLongitude(incident.getLongitude());
        response.setStatus(incident.getStatus());
        response.setReportedBy(incident.getReportedBy());
        response.setCreatedAt(incident.getCreatedAt());

        return response;
    }
}