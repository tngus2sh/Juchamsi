package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.global.jwt.TokenInfo;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface TenantService {
    // 회원가입
    Long createUser(CreateTenantRequest request);

    // 로그인
    TokenInfo loginUser(LoginRequest request);
}