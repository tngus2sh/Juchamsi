package com.inet.juchamsi.domain.token.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class SaveTokenRequest {

    private String loginId;

    private String fcmToken;


    public SaveTokenRequest() {}

    @Builder
    public SaveTokenRequest(String loginId, String fcmToken) {
        this.loginId = loginId;
        this.fcmToken = fcmToken;
    }
}
