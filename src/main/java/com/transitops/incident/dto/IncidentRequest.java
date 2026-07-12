package com.transitops.incident.dto;

import com.transitops.incident.entity.IncidentStatus;
import com.transitops.incident.entity.IncidentType;
import com.transitops.incident.entity.Severity;

public class IncidentRequest {

    private String title;
    private String description;
    private IncidentType incidentType;
    private Severity severity;
    private Double latitude;
    private Double longitude;
    private IncidentStatus status;
    private String reportedBy;

    public IncidentRequest() {
    }

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public IncidentType getIncidentType() {
		return incidentType;
	}

	public void setIncidentType(IncidentType incidentType) {
		this.incidentType = incidentType;
	}

	public Severity getSeverity() {
		return severity;
	}

	public void setSeverity(Severity severity) {
		this.severity = severity;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public IncidentStatus getStatus() {
		return status;
	}

	public void setStatus(IncidentStatus status) {
		this.status = status;
	}

	public String getReportedBy() {
		return reportedBy;
	}

	public void setReportedBy(String reportedBy) {
		this.reportedBy = reportedBy;
	}
    
    

    // Generate Getters and Setters
}