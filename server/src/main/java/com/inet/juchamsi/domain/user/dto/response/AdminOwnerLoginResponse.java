package com.inet.juchamsi.domain.user.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.jwt.TokenInfo;
import lombok.Builder;
import lombok.Data;

@Data
public class AdminOwnerLoginResponse {
    private TokenInfo tokenInfo;
    private String grade;
    private String loginId;
    private String name;
    private Villa villa;


    public AdminOwnerLoginResponse() {}

    @Builder
    public AdminOwnerLoginResponse(TokenInfo tokenInfo, String grade, String loginId, String name, Villa villa) {
        this.tokenInfo = tokenInfo;
        this.grade = grade;
        this.loginId = loginId;
        this.name = name;
        this.villa = villa;
    }
}
