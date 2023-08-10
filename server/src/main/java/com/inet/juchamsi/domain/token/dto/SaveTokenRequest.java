package com.inet.juchamsi.domain.token.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class SaveTokenRequest {

    private String loginId;
    private String FCMToken;


    public SaveTokenRequest() {}

    @Builder
    public SaveTokenRequest(String loginId, String FCMToken) {
        this.loginId = loginId;
        this.FCMToken = FCMToken;
    }
}
