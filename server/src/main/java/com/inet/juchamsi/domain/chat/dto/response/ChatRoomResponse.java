package com.inet.juchamsi.domain.chat.dto.response;

import com.inet.juchamsi.domain.chat.dto.request.MessageChatRoomDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ChatRoomResponse {

    private String roomId;
    private String roomName;
    // 채팅 하는 사람 닉네임
    private String nickName;
    private List<MessageChatRoomDto> messageList;

    @Builder
    public ChatRoomResponse(String roomId, String roomName, String nickName, List<MessageChatRoomDto> messageList) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.nickName = nickName;
        this.messageList = messageList;
    }
}
