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
    // 보내는 사람 : 사용자 닉네임(차 번호)
    private String sender;
    // 보내는 사람 : 사용자 아이디
    private String senderId;
    // 내용
    private String message;
    private String roomId;
}
