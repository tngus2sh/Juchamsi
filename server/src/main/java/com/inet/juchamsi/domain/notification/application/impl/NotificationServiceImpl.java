package com.inet.juchamsi.domain.notification.application.impl;

import com.inet.juchamsi.domain.notification.application.NotificationService;
import com.inet.juchamsi.domain.notification.dto.request.CreateNotificationRequest;
import com.inet.juchamsi.global.redis.RedisUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final RedisUtils redisUtils;


    // refactor: 앞차, 뒷차 차주 모두 알림 데이터 추가하는 코드 작성해야 함
    @Override
    public String createNotification(CreateNotificationRequest request) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(now, request.getOutTime());
        Long seconds = duration.getSeconds() + 120;
        System.out.println("만료 시간: " + seconds);
        seconds = 20l;

        String key = request.getOutTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        redisUtils.setRedisHash(key, request.getLoginId(), request.getMessage(), seconds);

        return key;
    }

}
