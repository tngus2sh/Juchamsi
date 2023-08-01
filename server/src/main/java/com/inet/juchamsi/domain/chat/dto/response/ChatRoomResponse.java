package com.inet.juchamsi.domain.chat.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ChatRoomResponse {

    private String roomId;
    private String roomName;

    @Builder
    public ChatRoomResponse(String roomId, String roomName) {
        this.roomId = roomId;
        this.roomName = roomName;
    }
}
