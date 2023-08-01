package com.inet.juchamsi.domain.user.dto.response;

import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.jwt.TokenInfo;
import lombok.Builder;
import lombok.Data;

@Data
public class TenantLoginResponse {
    private TokenInfo tokenInfo;
    private String phoneNumber;
    private String loginId;
    private String name;
    private int totalMileage;
    private String carNumber;
    private int villaNumber;
    private String approved;
    private Villa villa;


    public TenantLoginResponse() {}

    @Builder
    public TenantLoginResponse(TokenInfo tokenInfo, String phoneNumber, String loginId, String name, int totalMileage, String carNumber, int villaNumber, String approved, Villa villa) {
        this.tokenInfo = tokenInfo;
        this.phoneNumber = phoneNumber;
        this.loginId = loginId;
        this.name = name;
        this.totalMileage = totalMileage;
        this.carNumber = carNumber;
        this.villaNumber = villaNumber;
        this.approved = approved;
        this.villa = villa;
    }
}
