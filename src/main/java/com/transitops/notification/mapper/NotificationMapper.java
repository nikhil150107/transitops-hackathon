package com.transitops.notification.mapper;

import com.transitops.notification.dto.NotificationRequest;
import com.transitops.notification.dto.NotificationResponse;
import com.transitops.notification.entity.Notification;

public class NotificationMapper {

    public static Notification toEntity(NotificationRequest request) {

        Notification notification = new Notification();

        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setReceiver(request.getReceiver());
        notification.setRead(false);

        return notification;
    }

    public static NotificationResponse toResponse(Notification notification) {

        NotificationResponse response = new NotificationResponse();

        response.setId(notification.getId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setReceiver(notification.getReceiver());
        response.setRead(notification.isRead());

        return response;
    }
}