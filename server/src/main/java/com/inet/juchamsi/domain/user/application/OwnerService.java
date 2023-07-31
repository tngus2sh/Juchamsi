package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.OwnerResponse;
import com.inet.juchamsi.domain.user.entity.Approve;

import java.util.List;

public interface OwnerService {

    // 회원 전체 조회
    List<OwnerResponse> showUser();
    
    // 회원 상세 조회
    OwnerResponse showDetailUser(String ownerId);

    // 회원 가입
    Long createUser(CreateOwnerRequest dto);

    // 로그인
    AdminOwnerLoginResponse loginUser(LoginRequest request);

    // 로그아웃
    void logoutUser(String ownerId);

    // 회원정보수정
    void modifyUser(CreateOwnerRequest dto);

    // 세입자 회원가입 요청 관리
    void manageApprove(String tenantId, Approve approve);

    // 탈퇴
    void removeUser(String ownerId);
}
