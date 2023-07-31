package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.request.ModifyTenantRequest;
import com.inet.juchamsi.domain.user.dto.response.TenantLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.TenantResponse;
import com.inet.juchamsi.global.jwt.TokenInfo;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface TenantService {
    // 회원가입
    Long createUser(CreateTenantRequest request);

    // 회원정보 전체 조회
    List<TenantResponse> showUser();

    // 회원정보 상세 조회
    TenantResponse showDetailUser(String tenantId);

    // 로그인
    TenantLoginResponse loginUser(LoginRequest request);

    // 로그아웃
    void logoutUser(String tenantId);

    // 회원정보 수정
    void modifyUser(ModifyTenantRequest request);

    // 탈퇴
    void removeUser(String tenantId);
}