package com.inet.juchamsi.domain.chat.application.impl;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dao.ChatPeopleRepository;
import com.inet.juchamsi.domain.chat.dao.ChatRoomRepository;
import com.inet.juchamsi.domain.chat.dao.MessageRepository;
import com.inet.juchamsi.domain.chat.dto.request.*;
import com.inet.juchamsi.domain.chat.dto.response.ChatRoomResponse;
import com.inet.juchamsi.domain.chat.dto.service.ChatRoomUserDto;
import com.inet.juchamsi.domain.chat.dto.service.MessageChatRoomDto;
import com.inet.juchamsi.domain.chat.dto.service.SystemMessageDto;
import com.inet.juchamsi.domain.chat.entity.ChatPeople;
import com.inet.juchamsi.domain.chat.entity.ChatRoom;
import com.inet.juchamsi.domain.chat.entity.Message;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.inet.juchamsi.domain.chat.entity.Status.ALIVE;
import static com.inet.juchamsi.domain.chat.entity.Type.GENERAL;
import static com.inet.juchamsi.domain.chat.entity.Type.SYSTEM;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static com.inet.juchamsi.global.common.ChatMessage.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    
    private final ChatRoomRepository chatRoomRepository;
    private final ChatPeopleRepository chatPeopleRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    
    // 채팅방 불러오기
    @Override
    public List<ChatRoomResponse> showChatRoom(String userId) {
        List<ChatRoomUserDto> results = chatRoomRepository.findAllRoomsByLoginIdAndStatus(userId, ACTIVE, ALIVE);
        List<ChatRoomResponse> chatRoomResponses = new ArrayList<>();
        for (ChatRoomUserDto result : results) {
            chatRoomResponses.add(ChatRoomResponse.builder()
                            .roomId(result.getRoomId())
                            .roomName(result.getRoomName())
                            .nickName(result.getCarNumber())
                            .build());
        }
        return chatRoomResponses;
    }
    
    // 채팅방 하나 불러오기
    @Override
    public ChatRoomResponse showDetailChatRoom(String userId, String roomId) {
        Optional<User> userOp = userRepository.findByLoginId(userId);
        if (userOp.isEmpty()) {
            throw new NotFoundException(User.class, userId);
        }
        List<ChatRoomUserDto> results = chatRoomRepository.findChatRoomByIdAndLoginIdAndStatus(roomId, ALIVE);
        if (results.isEmpty()) {
            throw new NotFoundException(ChatRoom.class, roomId);
        }
        String nickName = null;
        for (ChatRoomUserDto result : results) {
            if (result.getRoomName().equals("주참시")) continue;
            if (result.getCarNumber().equals(userOp.get().getCarNumber())) continue;
            nickName = result.getCarNumber();
        }
        
        // 이전 채팅방 글 불러오기
        List<MessageChatRoomDto> messageUserDtos = messageRepository.findAllByChatRoomIdAndStatus(roomId, ALIVE);
        
        return ChatRoomResponse.builder()
                .roomId(results.get(0).getRoomId())
                .roomName(results.get(0).getRoomName())
                .nickName(nickName)
                .messageList(messageUserDtos)
                .build();
    }

    /* 유저간 채팅방 */
    // 채팅방 생성
    @Override
    public ChatRoomResponse createRoom(ChatRoomRequest request) {
        String userIdOne = request.getUserIdOne();
        String userIdTwo = request.getUserIdTwo();
        String name = "사용자 대화";
        // userId로 user 정보 가져오기(앞차주, 뒷차주)
        List<User> users = userRepository.findUsersByLoginId(userIdOne, userIdTwo, ACTIVE);
        // user 정보 없으면 -> NotFoundException 발생
        if (users.isEmpty()) {
            throw new NotFoundException(User.class, users);
        }
        // 이미 만들어진 채팅방이 있는지 확인
        Optional<Long> chatRoomId = chatRoomRepository.existChatRoomByUserId(userIdOne, userIdTwo, ACTIVE, GENERAL);
        // 이미 만들어진 채팅방이 있다면 -> AlreadyExistException
        if (chatRoomId.isPresent()) {
            throw new AlreadyExistException(ChatRoom.class, chatRoomId);
        }
        // 채팅방 생성
        ChatRoom room = chatRoomRepository.save(ChatRoom.create( name, GENERAL));
        // chatPeople -> user 정보 넣기
        for (User user: users) {
            chatPeopleRepository.save(ChatPeople.builder()
                    .chatRoom(room)
                    .user(user)
                    .build());
        }

        return ChatRoomResponse.builder() 
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .build();
    }
    
    // 메세지 저장
    @Override
    public void createChat(ChatMessageRequest request) {
        String userId = request.getSenderId();
        String message = request.getMessage();
        String roomId = request.getRoomId();
        // 채팅 참여 식별키를 가져와서 넣어야함
        Optional<ChatPeople> chatPeople = chatPeopleRepository.findIdByRoomIdAndUserId(userId, roomId, ACTIVE, ALIVE);
        if (chatPeople.isEmpty()) {
            throw new NotFoundException(ChatRoom.class, roomId);
        }

        // 메세지 저장
        messageRepository.save(Message.builder()
                .chatPeople(chatPeople.get())
                .content(message)
                .build());
    }

    // 채팅방 삭제
    @Override
    public void removeChatRoom(String macAddress) {
        Optional<User> userOptional = userRepository.findUserByMacAddress(macAddress, ACTIVE);
        if (userOptional.isEmpty()) {
            throw new NotFoundException(User.class, macAddress);
        }
        String userId = userOptional.get().getLoginId();
        // userId로 해당하는 채팅방 삭제
        Optional<Long> chatRoomIdOptional = chatRoomRepository.findIdByloginIdAndActive(userId, ACTIVE, ALIVE);
        if (chatRoomIdOptional.isEmpty()) {
            throw new NotFoundException(ChatRoom.class, userId);
        }

        // chatRoomId에 해당하는 채팅방 비활성화로 바꾸기
        chatRoomRepository.updateStatus(chatRoomIdOptional.get(), ALIVE);
    }

    /* 시스템 채팅방 */
    // 시스템 채팅방 생성
    @Override
    public void createSystemRoom(SystemChatRoomRequest request) {
        String userId = request.getUserId();
        String name = "주참시";
        // chatRoom 생성
        ChatRoom room = chatRoomRepository.save(ChatRoom.create(name, SYSTEM));
        // userId로 user 정보 가져오기
        Optional<User> user = userRepository.findByLoginId(userId);
        // user 정보 없으면 -> NotFoundException 발생
        if (user.isEmpty()) {
            throw new NotFoundException(User.class, userId);
        }

        // chatPeople -> user정보(userId) 넣기
        chatPeopleRepository.save(ChatPeople.builder()
                        .chatRoom(room)
                        .user(user.get())
                        .build());

        Optional<User> system = userRepository.findByLoginId(SYSTEM_ID);
        chatPeopleRepository.save(ChatPeople.builder()
                .chatRoom(room)
                .user(system.get())
                .build());

        ChatRoomResponse.builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .build();
    }

    // 시스템 메세지 저장
    @Override
    public void createSystemChat(SystemMessageDto messageDto) { // TODO parameter modify
        String userId = messageDto.getSenderId();
        String message = messageDto.getMessage();
        String roomId = messageDto.getRoomId();

        // 채팅 참여 식별키를 가져와서 넣어야함
        Optional<ChatPeople> chatPeople = chatPeopleRepository.findIdByRoomIdAndUserId(userId, roomId, ACTIVE, ALIVE);
        if (chatPeople.isEmpty()) {
            throw new NotFoundException(ChatRoom.class, roomId);
        }

        // 메세지 저장
        messageRepository.save(Message.builder()
                .chatPeople(chatPeople.get())
                .content(message)
                .build());
    }
    
}
