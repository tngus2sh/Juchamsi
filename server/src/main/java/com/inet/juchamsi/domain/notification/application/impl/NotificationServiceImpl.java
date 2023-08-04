package com.inet.juchamsi.domain.notification.application.impl;

import com.inet.juchamsi.domain.notification.application.NotificationService;
import com.inet.juchamsi.domain.notification.dao.TimeNotificationRepository;
import com.inet.juchamsi.domain.notification.dao.UpdateNotificationRepository;
import com.inet.juchamsi.domain.notification.dto.request.CreateTimeNotificationRequest;
import com.inet.juchamsi.domain.notification.dto.request.CreateUpdateNotificationRequest;
import com.inet.juchamsi.domain.notification.entity.TimeNotification;
import com.inet.juchamsi.domain.notification.entity.UpdateNotification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final TimeNotificationRepository timeNotificationRepository;
    private final UpdateNotificationRepository updateNotificationRepository;


    // refactor: 앞차, 뒷차 차주 모두 알림 데이터 추가하는 코드 작성해야 함
    @Override
    public String createTimeNotification(CreateTimeNotificationRequest request) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(now, request.getOutTime());
        Long seconds = duration.getSeconds() + 120;

        TimeNotification timeNotification = TimeNotification.builder()
                .loginId(request.getLoginId())
                .outTime(request.getOutTime())
                .message("출차 시간이 되었습니다.")
                .timeToLive(seconds)
                .build();

        TimeNotification notification = timeNotificationRepository.save(timeNotification);
        return notification.getId();
    }

    @Override
    public String createUpdateNotification(CreateUpdateNotificationRequest request) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(now, request.getOutTime());
        Long seconds = duration.getSeconds() + 120;

        UpdateNotification updateNotification = UpdateNotification.builder()
                .loginId(request.getLoginId())
                .outTime(request.getOutTime())
                .timeToLive(seconds)
                .build();

        UpdateNotification notification = updateNotificationRepository.save(updateNotification);
        return notification.getId();
    }
}
