package com.inet.juchamsi.domain.chat.dto.service;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
public class MessageChatRoomDto {
    
    // 보낸 사람
    private String loginId;
    // 보낸 사람 닉네임 : 차 번호
    private String carNumber;
    // 보낸 내용
    private String message;
    // 보낸 시간
    private LocalDateTime createdDate;

    public MessageChatRoomDto(String loginId, String carNumber, String message, LocalDateTime createdDate) {
        this.loginId = loginId;
        this.carNumber = carNumber;
        this.message = message;
        this.createdDate = createdDate.plusHours(9);
    }
}
