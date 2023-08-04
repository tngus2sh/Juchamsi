package com.inet.juchamsi.notification.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.inet.juchamsi.domain.notification.application.NotificationService;
import com.inet.juchamsi.domain.notification.dto.request.CreateNotificationRequest;
import com.inet.juchamsi.domain.notification.dto.request.CreateTimeNotificationRequest;
import com.inet.juchamsi.domain.notification.dto.request.CreateUpdateNotificationRequest;
import com.inet.juchamsi.domain.notification.entity.TimeNotification;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.redis.RedisUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Collections;
import java.util.Objects;

import static com.inet.juchamsi.domain.user.entity.Approve.APPROVE;
import static com.inet.juchamsi.domain.user.entity.Grade.USER;
import static com.inet.juchamsi.global.common.Active.ACTIVE;

@SpringBootTest
@Transactional
public class NotificationServiceTest {

    @Autowired
    NotificationService notificationService;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RedisUtils redisUtils;


    @Test
    @DisplayName("시간 알림 등록")
    void createTimeNotification() throws JsonProcessingException {
        // given
        User targetUser = insertUser();
        LocalDateTime outTime = Year.of(2023).atMonth(8).atDay(4).atTime(12, 11);
        CreateTimeNotificationRequest request = CreateTimeNotificationRequest.builder()
                .loginId(targetUser.getLoginId())
                .outTime(outTime)
                .message("출차 예상 시간 15분 전입니다.")
                .build();

        // when
        String key = notificationService.createTimeNotification(request);

        // then
        TimeNotification timeNotification = redisUtils.getRedisValue(key, TimeNotification.class);
        System.out.println(timeNotification);
    }

    @Test
    @DisplayName("시간 알림 등록")
    void createUpdateNotification() throws JsonProcessingException {
        // given
        User targetUser = insertUser();
        LocalDateTime outTime = Year.of(2023).atMonth(8).atDay(4).atTime(12, 11);
        CreateUpdateNotificationRequest request = CreateUpdateNotificationRequest.builder()
                .loginId(targetUser.getLoginId())
                .outTime(outTime)
                .build();

        // when
        String key = notificationService.createUpdateNotification(request);

        // then
//        TimeNotification timeNotification = redisUtils.getRedisValue(key, TimeNotification.class);
//        System.out.println(timeNotification);
    }

    @Test
    @DisplayName("시간 알림 등록")
    void createNotification() throws JsonProcessingException {
        // given
        User targetUser = insertUser();
        LocalDateTime outTime = Year.of(2023).atMonth(8).atDay(4).atTime(12, 11);
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .loginId(targetUser.getLoginId())
                .outTime(outTime)
                .message("테스트")
                .build();

        // when
        String key = notificationService.createNotification(request);

        // then
//        TimeNotification timeNotification = redisUtils.getRedisValue(key, TimeNotification.class);
//        System.out.println(timeNotification);
    }


    private User insertUser() {
        User user = User.builder()
                .loginId("userid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012341234")
                .name("김주참")
                .totalMileage(5000)
                .grade(USER)
                .approve(APPROVE)
                .active(ACTIVE)
                .roles(Collections.singletonList("ADMIN"))
                .build();
        return userRepository.save(user);
    }
}