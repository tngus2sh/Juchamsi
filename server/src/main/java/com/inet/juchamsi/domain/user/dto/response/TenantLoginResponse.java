package com.inet.juchamsi.domain.user.dto.response;

import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.jwt.TokenInfo;
import lombok.Builder;
import lombok.Data;

@Data
public class TenantLoginResponse {
    private TokenInfo tokenInfo;
    private String loginId;
    private String name;
    private Villa villa;


    public TenantLoginResponse() {}

    @Builder
    public TenantLoginResponse(TokenInfo tokenInfo, String loginId, String name, Villa villa) {
        this.tokenInfo = tokenInfo;
        this.loginId = loginId;
        this.name = name;
        this.villa = villa;
    }
}
