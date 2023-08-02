package com.inet.juchamsi.domain.chat.dto.response;

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
    private List<MessageResponse> messageList;

    @Builder
    public ChatRoomResponse(String roomId, String roomName, List<MessageResponse> messageList) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.messageList = messageList;
    }
}
