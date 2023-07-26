package com.inet.juchamsi.domain.chat.entity;

import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.*;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Getter
public class ChatPeople extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    // UserMerge후 주석 제거 필요
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;

//    public ChatPeople(Long id, ChatRoom chatRoom, User user) {
//        this.id = id;
//        this.chatRoom = chatRoom;
//        this.user = user;
//    }

    public ChatPeople() {}
}
