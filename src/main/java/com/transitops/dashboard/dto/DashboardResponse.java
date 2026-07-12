package com.transitops.dashboard.dto;

public class DashboardResponse {

    private Long totalUsers;
    private Long totalVehicles;
    private Long totalIncidents;
    private Long activeIncidents;

    public DashboardResponse() {
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalVehicles() {
        return totalVehicles;
    }

    public void setTotalVehicles(Long totalVehicles) {
        this.totalVehicles = totalVehicles;
    }

    public Long getTotalIncidents() {
        return totalIncidents;
    }

    public void setTotalIncidents(Long totalIncidents) {
        this.totalIncidents = totalIncidents;
    }

    public Long getActiveIncidents() {
        return activeIncidents;
    }

    public void setActiveIncidents(Long activeIncidents) {
        this.activeIncidents = activeIncidents;
    }

}