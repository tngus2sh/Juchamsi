package com.inet.juchamsi.domain.notification.dao;

import com.inet.juchamsi.domain.notification.entity.TimeNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeNotificationRepository extends JpaRepository<TimeNotification, Long> {
}
