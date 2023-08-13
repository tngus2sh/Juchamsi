package com.inet.juchamsi.domain.user.dto.request;

import lombok.Data;

@Data
public class PasswordMessageRequest {
    String to; // 핸드폰 번호
    String userId; // 사용자 아이디
}
