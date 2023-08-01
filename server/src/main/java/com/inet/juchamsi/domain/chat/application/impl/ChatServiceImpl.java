package com.inet.juchamsi.domain.chat.application.impl;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dao.ChatRoomRepository;
import com.inet.juchamsi.domain.chat.dto.response.ChatRoomResponse;
import com.inet.juchamsi.domain.chat.entity.ChatRoom;
import com.inet.juchamsi.domain.chat.entity.Type;
import com.inet.juchamsi.global.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.inet.juchamsi.domain.chat.entity.Status.ALIVE;
import static com.inet.juchamsi.domain.chat.entity.Type.GENERAL;
import static com.inet.juchamsi.domain.chat.entity.Type.SYSTEM;
import static com.inet.juchamsi.global.common.Active.ACTIVE;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    
    private final ChatRoomRepository chatRoomRepository;
    
    // 채팅방 불러오기
    @Override
    public List<ChatRoomResponse> showChatRoom(String loginId) {
        List<ChatRoom> results = chatRoomRepository.findAllRoomsByLoginIdAndStatus(loginId, ACTIVE, ALIVE);
        List<ChatRoomResponse> chatRoomResponses = new ArrayList<>();
        for (ChatRoom result : results) {
            chatRoomResponses.add(ChatRoomResponse.builder()
                            .roomId(result.getRoomId())
                            .roomName(result.getRoomName())
                            .build());
        }
        return chatRoomResponses;
    }
    
    // 채팅방 하나 불러오기
    @Override
    public ChatRoomResponse showDetailChatRoom(String roomId) {
        Optional<ChatRoom> result = chatRoomRepository.findChatRoomByIdAndLoginIdAndStatus(roomId, ALIVE);
        if (result.isEmpty()) {
            throw new NotFoundException(ChatRoom.class, roomId);
        }
        
        return ChatRoomResponse.builder()
                .roomId(result.get().getRoomId())
                .roomName(result.get().getRoomName())
                .build();
    }
    
    // 채팅방 생성
    @Override
    public ChatRoomResponse createRoom(String name) {
        ChatRoom room = chatRoomRepository.save(ChatRoom.create(name, GENERAL));
        return ChatRoomResponse.builder() 
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .build();
    }

    // 시스템 채팅방 생성
    @Override
    public ChatRoomResponse createSystemRoom() {
        String name = "주참시";
        ChatRoom room = chatRoomRepository.save(ChatRoom.create(name, SYSTEM));
        return ChatRoomResponse.builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .build();
    }
}
