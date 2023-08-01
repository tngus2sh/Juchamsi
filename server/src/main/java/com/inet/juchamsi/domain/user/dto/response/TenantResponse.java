package com.inet.juchamsi.domain.user.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class TenantResponse {

    private Long id;
    private Long villaId;
    private String villaIdNumber; // 빌라 식별번호
    private String phoneNumber;
    private String loginId;
    private String name;
    private int totalMileage;
    private String carNumber;
    private int villaNumber;

    public TenantResponse() {}

    @Builder
    public TenantResponse(Long id, Long villaId, String villaIdNumber, String phoneNumber, String loginId, String name, String carNumber, int villaNumber) {
        this.id = id;
        this.villaId = villaId;
        this.villaIdNumber = villaIdNumber;
        this.phoneNumber = phoneNumber;
        this.loginId = loginId;
        this.name = name;
        this.totalMileage = totalMileage;
        this.carNumber = carNumber;
        this.villaNumber = villaNumber;
    }
}
