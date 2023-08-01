package com.inet.juchamsi.domain.chat.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {

    public enum MessageType {
        ENTER, TALK
    }

    private MessageType type;
    // 채팅방 ID
    private String roomId;
    // 보내는 사람
    private String sender;
    // 내용
    private String message;
}
