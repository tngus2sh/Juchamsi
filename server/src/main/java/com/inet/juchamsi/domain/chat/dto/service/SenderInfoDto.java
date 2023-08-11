package com.inet.juchamsi.domain.chat.dto.service;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SenderInfoDto {
    private String senderId; // 보내는 사람: 사용자 아이디
    private String message; // 메세지
    private String roomId; // 방 id
}
