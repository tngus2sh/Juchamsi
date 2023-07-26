package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.LoginAdminRequest;
import com.inet.juchamsi.domain.user.dto.request.SignupAdminRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;

import javax.transaction.Transactional;

@Transactional
public interface AdminService {

    // 회원 상세 조회
    AdminResponse showDetailUser(String loginId);

    // 회원 가입
    Long createUser(SignupAdminRequest dto);
}