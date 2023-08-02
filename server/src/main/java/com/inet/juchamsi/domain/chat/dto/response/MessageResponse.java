package com.inet.juchamsi.domain.chat.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MessageResponse {
    
    // 보낸 사람
    String senderId;
    // 보낸 사람 닉네임(차 번호)
    String senderNickName;
    // 메세지 내용
    String message;
    // 메세지 보낸시간
    String createdDate;

    @Builder
    public MessageResponse(String senderId, String senderNickName, String message, String createdDate) {
        this.senderId = senderId;
        this.senderNickName = senderNickName;
        this.message = message;
        this.createdDate = createdDate;
    }
}
