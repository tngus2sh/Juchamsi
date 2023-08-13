package com.inet.juchamsi.domain.chat.entity;

import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

import static com.inet.juchamsi.domain.chat.entity.Status.ALIVE;
import static javax.persistence.EnumType.STRING;
import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@ToString
@RequiredArgsConstructor
public class ChatRoom extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column()
    private Long id;

    @Enumerated(STRING)
    @Column(nullable = false, length = 100)
    private Status status;
    
    @Enumerated(STRING)
    @Column(nullable = false, length = 100)
    private Type type;
    
    @Column(name = "room_id", nullable = false)
    private String roomId;

    @Column(name = "room_name", nullable = false)
    private String roomName;

    @Builder
    public ChatRoom(Long id, Status status, Type type, String roomId, String roomName) {
        this.id = id;
        this.status = status;
        this.type = type;
        this.roomId = roomId;
        this.roomName = roomName;
    }

    public static ChatRoom create(String roomName, Type type) {
        String roomId = UUID.randomUUID().toString();
        return ChatRoom.builder()
                .status(ALIVE)
                .type(type)
                .roomId(roomId)
                .roomName(roomName)
                .build();
    }
}
