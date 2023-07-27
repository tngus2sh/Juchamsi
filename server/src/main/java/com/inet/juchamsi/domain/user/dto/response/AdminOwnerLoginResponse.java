package com.inet.juchamsi.domain.user.dto.response;

import com.inet.juchamsi.global.jwt.TokenInfo;
import lombok.Builder;
import lombok.Data;

@Data
public class AdminOwnerLoginResponse {
    TokenInfo tokenInfo;
    String grade;

    @Builder
    public AdminOwnerLoginResponse(TokenInfo tokenInfo, String grade) {
        this.tokenInfo = tokenInfo;
        this.grade = grade;
    }
}
