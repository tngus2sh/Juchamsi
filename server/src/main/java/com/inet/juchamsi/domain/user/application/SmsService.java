package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CheckUserRequest;

public interface SmsService {

    // 핸드폰 인증
    String sendSmsToCheckUser(CheckUserRequest request);

}
