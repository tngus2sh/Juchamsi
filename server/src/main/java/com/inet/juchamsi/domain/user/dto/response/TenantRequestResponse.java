package com.inet.juchamsi.domain.user.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class TenantRequestResponse {

    private Long id;
    private Long villaId;
    private String phoneNumber;
    private String loginId;
    private String name;
    private String carNumber;
    private int villaNumber;


    public TenantRequestResponse() {}

    @Builder
    public TenantRequestResponse(Long id, Long villaId, String phoneNumber, String loginId, String name, String carNumber, int villaNumber) {
        this.id = id;
        this.villaId = villaId;
        this.phoneNumber = phoneNumber;
        this.loginId = loginId;
        this.name = name;
        this.carNumber = carNumber;
        this.villaNumber = villaNumber;
    }
}
