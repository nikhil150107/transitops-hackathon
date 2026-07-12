package com.transitops.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.transitops.notification.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

}