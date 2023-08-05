package com.inet.juchamsi.domain.notification.application;

import com.inet.juchamsi.domain.notification.dto.request.CreateNotificationRequest;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface NotificationService {
    String createNotification(CreateNotificationRequest request);
}
