package com.transitops.notification.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.transitops.common.exception.ResourceNotFoundException;
import com.transitops.notification.dto.NotificationRequest;
import com.transitops.notification.dto.NotificationResponse;
import com.transitops.notification.entity.Notification;
import com.transitops.notification.mapper.NotificationMapper;
import com.transitops.notification.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    // Create
    public NotificationResponse createNotification(NotificationRequest request) {

        Notification notification = NotificationMapper.toEntity(request);

        Notification savedNotification = repository.save(notification);

        return NotificationMapper.toResponse(savedNotification);
    }

    // Get All
    public List<NotificationResponse> getAllNotifications() {

        return repository.findAll()
                .stream()
                .map(NotificationMapper::toResponse)
                .collect(Collectors.toList());

    }

    // Get By Id
    public NotificationResponse getNotificationById(Long id) {

        Notification notification = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found with id : " + id));

        return NotificationMapper.toResponse(notification);

    }

    // Update
    public NotificationResponse updateNotification(Long id, NotificationRequest request) {

        Notification notification = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found with id : " + id));

        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setReceiver(request.getReceiver());

        Notification updatedNotification = repository.save(notification);

        return NotificationMapper.toResponse(updatedNotification);

    }

    // Delete
    public void deleteNotification(Long id) {

        Notification notification = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found with id : " + id));

        repository.delete(notification);

    }

}