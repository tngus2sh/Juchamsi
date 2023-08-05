package com.inet.juchamsi.global.notification.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
public class FCMNotificationRequest {

    private String loginId;
    private String title; // 알림 제목
    private String body; // 알림 내용


    public FCMNotificationRequest() {}

    @Builder
    public FCMNotificationRequest(String loginId, String title, String body) {
        this.loginId = loginId;
        this.title = title;
        this.body = body;
    }
}
