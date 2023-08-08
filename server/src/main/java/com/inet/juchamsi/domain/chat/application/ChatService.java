package com.inet.juchamsi.domain.chat.application;

import com.inet.juchamsi.domain.chat.dto.request.ChatMessageRequest;
import com.inet.juchamsi.domain.chat.dto.request.ChatRoomRequest;
import com.inet.juchamsi.domain.chat.dto.request.SystemChatRoomRequest;
import com.inet.juchamsi.domain.chat.dto.request.SystemMessageRequest;
import com.inet.juchamsi.domain.chat.dto.response.ChatRoomResponse;
import com.inet.juchamsi.domain.chat.dto.service.SystemMessageDto;

import java.util.List;

public interface ChatService {

    public List<ChatRoomResponse> showChatRoom(String userId);

    public ChatRoomResponse showDetailChatRoom(String userId, String roomId);
    
    /* 사용자끼리 대화방 */
    // 대화방 생성
    public ChatRoomResponse createRoom(ChatRoomRequest request);

    // 메세지 저장
    public void createChat(ChatMessageRequest request);

    // 채팅방 삭제
    public void removeChatRoom(String macAddress);

    /* 시스템 대화방 */
    // 대화방 생성
    public ChatRoomResponse createSystemRoom(SystemChatRoomRequest request);

    // 시스템 메세지 저장
    public void createSystemChat(SystemMessageDto messageDto);
}
