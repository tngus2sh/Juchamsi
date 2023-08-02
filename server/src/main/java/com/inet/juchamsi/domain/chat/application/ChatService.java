package com.inet.juchamsi.domain.chat.application;

import com.inet.juchamsi.domain.chat.dto.request.ChatMessageRequest;
import com.inet.juchamsi.domain.chat.dto.request.ChatRoomRequest;
import com.inet.juchamsi.domain.chat.dto.request.SystemChatRoomRequest;
import com.inet.juchamsi.domain.chat.dto.response.ChatRoomResponse;

import java.util.List;

public interface ChatService {

    public List<ChatRoomResponse> showChatRoom(String userId);

    public ChatRoomResponse showDetailChatRoom(String roomId);

    // 메세지 저장
    public void createChat(String roomId, ChatMessageRequest request);

    /* 사용자끼리 대화방 */
    // 대화방 생성
    public ChatRoomResponse createRoom(ChatRoomRequest request);

    /* 시스템 대화방 */
    // 대화방 생성
    public ChatRoomResponse createSystemRoom(SystemChatRoomRequest request);
}
