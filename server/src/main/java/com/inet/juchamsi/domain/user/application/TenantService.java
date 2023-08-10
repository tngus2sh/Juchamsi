package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.KeyPinUserRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.request.ModifyTenantRequest;
import com.inet.juchamsi.domain.user.dto.response.TenantLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.TenantResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface TenantService {
    // 회원가입
    Long createUser(CreateTenantRequest request);

    // 회원정보 상세 조회
    TenantResponse showDetailUser(String tenantId);

    // 빌라 내 회원 조회
    List<TenantResponse> showApproveTenant(Long villaId, Approve approve);

    // 세입자 회원가입 요청 관리
    void manageApprove(String tenantId, Approve approve);

    // 로그인
    TenantLoginResponse loginUser(LoginRequest request);

    // 로그아웃
    void logoutUser(String tenantId);

    // 간편 비밀번호 등록
    void createKeyPin(KeyPinUserRequest request);

    // 회원정보 수정
    void modifyUser(ModifyTenantRequest request);

    // 탈퇴
    void removeUser(String tenantId);
}