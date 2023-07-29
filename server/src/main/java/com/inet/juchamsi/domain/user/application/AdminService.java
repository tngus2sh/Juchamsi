package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CreateAdminRequest;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.entity.Approve;

import javax.transaction.Transactional;

@Transactional
public interface AdminService {

    // 회원 상세 조회
    AdminResponse showDetailUser(String adminId);

    // 회원 가입
    Long createUser(CreateAdminRequest dto);

    // 로그인
    AdminOwnerLoginResponse loginUser(LoginRequest request);

    // 로그아웃
    void logoutUser(String adminId);

    // 회원정보수정
    void modifyUser(CreateAdminRequest dto);

    // 집주인 회원가입 요청 관리
    void manageApprove(String ownerId, Approve approve);

    // 탈퇴
    void removeUser(String adminId);
}