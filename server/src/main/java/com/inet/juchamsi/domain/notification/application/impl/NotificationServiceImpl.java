package com.inet.juchamsi.domain.notification.application.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.notification.application.NotificationService;
import com.inet.juchamsi.domain.notification.dao.UpdateNotificationRepository;
import com.inet.juchamsi.domain.notification.dto.request.CreateNotificationRequest;
import com.inet.juchamsi.domain.notification.dto.request.CreateTimeNotificationRequest;
import com.inet.juchamsi.domain.notification.dto.request.CreateUpdateNotificationRequest;
import com.inet.juchamsi.domain.notification.entity.Notification;
import com.inet.juchamsi.domain.notification.entity.TimeNotification;
import com.inet.juchamsi.domain.notification.entity.UpdateNotification;
import com.inet.juchamsi.global.redis.RedisUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final UpdateNotificationRepository updateNotificationRepository;;
    private final RedisUtils redisUtils;

    // refactor: 앞차, 뒷차 차주 모두 알림 데이터 추가하는 코드 작성해야 함
    @Override
    public String createTimeNotification(CreateTimeNotificationRequest request) throws JsonProcessingException {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("현재 시간: " + now);
        System.out.println("출차 시간: " + request.getOutTime());
        Duration duration = Duration.between(now, request.getOutTime());
        Long seconds = duration.getSeconds() + 120;
        System.out.println("만료 시간: " + seconds);
        seconds = 20l;

        String outTime = request.getOutTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        TimeNotification timeNotification = TimeNotification.builder()
                .loginId(request.getLoginId())
                .outTime(outTime)
                .message(request.getMessage())
                .build();

        String key = "TimeNotification:" + request.getLoginId();
        redisUtils.setRedisValue(key, timeNotification, seconds);
        return key;
    }

    @Override
    public String createNotification(CreateNotificationRequest request) {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("출차 시간: " + request.getOutTime());
        Duration duration = Duration.between(now, request.getOutTime());
        Long seconds = duration.getSeconds() + 120;
        System.out.println("만료 시간: " + seconds);
        seconds = 20l;

//        Notification notification = Notification.builder()
//                .loginId(request.getLoginId())
//                .message(request.getMessage())
//                .build();

        String key = request.getOutTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        for(int i = 0; i < 3; i++) {
            String userId = request.getLoginId() + i;
            redisUtils.setRedisHash(key, userId, request.getMessage(), seconds);
        }

        return null;
    }

    @Override
    public String createUpdateNotification(CreateUpdateNotificationRequest request) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(now, request.getOutTime());
        Long seconds = duration.getSeconds() + 120;
        seconds = 10l;

        UpdateNotification updateNotification = UpdateNotification.builder()
                .id(request.getLoginId())
                .outTime(request.getOutTime())
                .timeToLive(seconds)
                .build();

        UpdateNotification notification = updateNotificationRepository.save(updateNotification);
        return notification.getId();
    }

}
