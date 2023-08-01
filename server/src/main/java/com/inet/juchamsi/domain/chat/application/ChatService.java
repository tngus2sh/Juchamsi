package com.inet.juchamsi.domain.chat.application;

import com.inet.juchamsi.domain.chat.dto.response.ChatRoomResponse;

import java.util.List;

public interface ChatService {

    public List<ChatRoomResponse> showChatRoom(String loginId);

    public ChatRoomResponse showDetailChatRoom(String roomId);

    public ChatRoomResponse createRoom(String name);
}
