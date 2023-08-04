package com.inet.juchamsi.domain.notification.entity;

import lombok.Builder;
import lombok.Data;

@Data
public class Notification {

    private String loginId;
    private String message;


    public Notification() {}

    @Builder
    public Notification(String loginId, String message) {
        this.loginId = loginId;
        this.message = message;
    }
}
