package com.inet.juchamsi.domain.chat.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SystemMessageRequest {
    public enum MessageType {
        ENTER, TALK
    }

    private MessageType type;

    // 보내는 사람 : 사용자 아이디
    private String senderId;
    // 메세지 내용
    private String message;
}
