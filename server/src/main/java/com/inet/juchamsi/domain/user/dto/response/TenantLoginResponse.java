package com.inet.juchamsi.domain.user.dto.response;

import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.jwt.TokenInfo;
import lombok.Builder;
import lombok.Data;

@Data
public class TenantLoginResponse {
    private TokenInfo tokenInfo;
    private Long id;
    private String phoneNumber;
    private String loginId;
    private String name;
    private int totalMileage;
    private String carNumber;
    private int villaNumber;
    private String approved;
    private Villa villa;
    private String FCMToken;


    public TenantLoginResponse() {}

    @Builder
    public TenantLoginResponse(TokenInfo tokenInfo, Long id, String phoneNumber, String loginId, String name, int totalMileage, String carNumber, int villaNumber, String approved, Villa villa, String FCMToken) {
        this.tokenInfo = tokenInfo;
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.loginId = loginId;
        this.name = name;
        this.totalMileage = totalMileage;
        this.carNumber = carNumber;
        this.villaNumber = villaNumber;
        this.approved = approved;
        this.villa = villa;
        this.FCMToken = FCMToken;
    }
}
