package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CheckUserRequest;

public interface SmsService {

    // 핸드폰 인증
    String sendSmsToCheckUser(CheckUserRequest request);

    // 임시 비밀번호 발급
    void sendSmsToFindPassword(CheckUserRequest request);

}
