package com.inet.juchamsi.domain.notification.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.inet.juchamsi.domain.notification.dto.request.CreateNotificationRequest;
import com.inet.juchamsi.domain.notification.dto.request.CreateTimeNotificationRequest;
import com.inet.juchamsi.domain.notification.dto.request.CreateUpdateNotificationRequest;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface NotificationService {
    String createTimeNotification(CreateTimeNotificationRequest request) throws JsonProcessingException;
    String createUpdateNotification(CreateUpdateNotificationRequest request);
    String createNotification(CreateNotificationRequest request);
}
