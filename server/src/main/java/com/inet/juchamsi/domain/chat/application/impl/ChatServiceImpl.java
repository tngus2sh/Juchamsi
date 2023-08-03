package com.inet.juchamsi.domain.chat.application.impl;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dao.ChatPeopleRepository;
import com.inet.juchamsi.domain.chat.dao.ChatRoomRepository;
import com.inet.juchamsi.domain.chat.dao.MessageRepository;
import com.inet.juchamsi.domain.chat.dto.request.*;
import com.inet.juchamsi.domain.chat.dto.response.ChatRoomResponse;
import com.inet.juchamsi.domain.chat.dto.response.MessageResponse;
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

import javax.swing.text.html.Option;
import java.util.*;
import java.util.stream.Collectors;

import static com.inet.juchamsi.domain.chat.entity.Status.ALIVE;
import static com.inet.juchamsi.domain.chat.entity.Type.GENERAL;
import static com.inet.juchamsi.domain.chat.entity.Type.SYSTEM;
import static com.inet.juchamsi.global.common.Active.ACTIVE;

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
        List<ChatRoom> results = chatRoomRepository.findAllRoomsByLoginIdAndStatus(userId, ACTIVE, ALIVE);
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
        // 이전 채팅방 글 불러오기
        List<MessageChatRoomDto> messageUserDtos = messageRepository.findAllByChatRoomIdAndStatus(roomId, ALIVE);
        
        return ChatRoomResponse.builder()
                .roomId(result.get().getRoomId())
                .roomName(result.get().getRoomName())
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
    public void createChat(String roomId, ChatMessageRequest request) {
        String userId = request.getSenderId();
        String message = request.getMessage();
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

    /* 시스템 채팅방 */
    // 시스템 채팅방 생성
    @Override
    public ChatRoomResponse createSystemRoom(SystemChatRoomRequest request) {
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

        return ChatRoomResponse.builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .build();
    }

    // 시스템 메세지 저장
    @Override
    public void createSystemChat(String roomId, SystemMessageRequest request) {
        String userId = request.getSenderId();
        String message = request.getMessage();
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
