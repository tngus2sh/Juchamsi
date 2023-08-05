package com.inet.juchamsi.domain.chat.dto.service;

import lombok.Getter;

@Getter
public class ChatRoomUserDto {
    
    // 상대방 닉네임(차번호)
    private String carNumber;
    // 방 id
    private String roomId;
    private String roomName;

    public ChatRoomUserDto(String carNumber, String roomId, String roomName) {
        this.carNumber = carNumber;
        this.roomId = roomId;
        this.roomName = roomName;
    }
}
