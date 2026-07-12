package com.transitops.notification.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.transitops.common.dto.ApiResponse;
import com.transitops.notification.dto.NotificationRequest;
import com.transitops.notification.dto.NotificationResponse;
import com.transitops.notification.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
            @RequestBody NotificationRequest request) {

        NotificationResponse response = service.createNotification(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Notification Created Successfully",
                        response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getAllNotifications() {

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Notification List",
                        service.getAllNotifications()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotificationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Notification Found",
                        service.getNotificationById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationResponse>> updateNotification(
            @PathVariable Long id,
            @RequestBody NotificationRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Notification Updated Successfully",
                        service.updateNotification(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(
            @PathVariable Long id) {

        service.deleteNotification(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Notification Deleted Successfully",
                        null));
    }

}