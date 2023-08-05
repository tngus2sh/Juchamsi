package com.inet.juchamsi.domain.chat.dto.service;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SystemMessageDto {

    // 보내는 사람 : 사용자 아이디
    private String senderId;
    // 내용
    private String message;
    private String roomId;

    @Builder
    public SystemMessageDto(String senderId, String message, String roomId) {
        this.senderId = senderId;
        this.message = message;
        this.roomId = roomId;
    }
}
