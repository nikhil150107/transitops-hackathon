package com.transitops.incident.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.transitops.common.exception.ResourceNotFoundException;
import com.transitops.incident.dto.IncidentRequest;
import com.transitops.incident.dto.IncidentResponse;
import com.transitops.incident.entity.Incident;
import com.transitops.incident.mapper.IncidentMapper;
import com.transitops.incident.repository.IncidentRepository;

@Service
public class IncidentService {

    private final IncidentRepository repository;

    public IncidentService(IncidentRepository repository) {
        this.repository = repository;
    }

    // Create
    public IncidentResponse createIncident(IncidentRequest request) {

        Incident incident = IncidentMapper.toEntity(request);

        Incident savedIncident = repository.save(incident);

        return IncidentMapper.toResponse(savedIncident);
    }

    // Get All
    public List<IncidentResponse> getAllIncidents() {

        return repository.findAll()
                .stream()
                .map(IncidentMapper::toResponse)
                .collect(Collectors.toList());

    }

    // Get By Id
    public IncidentResponse getIncidentById(Long id) {

        Incident incident = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found with id : " + id));

        return IncidentMapper.toResponse(incident);

    }

    // Update
    public IncidentResponse updateIncident(Long id, IncidentRequest request) {

        Incident incident = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found with id : " + id));

        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setIncidentType(request.getIncidentType());
        incident.setSeverity(request.getSeverity());
        incident.setLatitude(request.getLatitude());
        incident.setLongitude(request.getLongitude());
        incident.setStatus(request.getStatus());
        incident.setReportedBy(request.getReportedBy());

        Incident updatedIncident = repository.save(incident);

        return IncidentMapper.toResponse(updatedIncident);

    }

    // Delete
    public void deleteIncident(Long id) {

        Incident incident = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found with id : " + id));

        repository.delete(incident);

    }

}