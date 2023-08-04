package com.inet.juchamsi.domain.notification.application;

import com.inet.juchamsi.domain.notification.dto.request.CreateTimeNotificationRequest;
import com.inet.juchamsi.domain.notification.dto.request.CreateUpdateNotificationRequest;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface NotificationService {
    String createTimeNotification(CreateTimeNotificationRequest request);
    String createUpdateNotification(CreateUpdateNotificationRequest request);
}
