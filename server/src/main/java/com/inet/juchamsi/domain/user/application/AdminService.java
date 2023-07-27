package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.global.jwt.TokenInfo;

import javax.transaction.Transactional;

@Transactional
public interface AdminService {

    // 회원 상세 조회
    AdminResponse showDetailUser(String loginId);

    // 회원 가입
    Long createUser(CreateOwnerRequest dto);

    // 로그인
    AdminOwnerLoginResponse login(String adminId, String password);

    // 로그아웃
    void logout(String adminId);

    // 회원정보수정
    Long modifyUser(CreateOwnerRequest dto);

    // 집주인 회원가입 요청 관리
    Long manageApprove(String ownerId, Approve approve);

    // 탈퇴
    Long removeUser(String adminId);
}