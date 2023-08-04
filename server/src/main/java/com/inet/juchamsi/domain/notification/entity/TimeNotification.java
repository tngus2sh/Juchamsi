package com.inet.juchamsi.domain.notification.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TimeNotification {

    private String loginId;
    private String outTime;
    private String message;


    @Builder
    public TimeNotification(String loginId, String outTime, String message) {
        this.loginId = loginId;
        this.outTime = outTime;
        this.message = message;
    }
}
