package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.global.jwt.TokenInfo;

import javax.transaction.Transactional;

@Transactional
public interface AdminService {

    // 회원 상세 조회
    AdminResponse showDetailUser(String loginId);

    // 회원 가입
    Long createUser(CreateOwnerRequest dto);

    // 로그인
    TokenInfo login(String adminId, String password);

    // 로그아웃
    void logout(String adminId);
}