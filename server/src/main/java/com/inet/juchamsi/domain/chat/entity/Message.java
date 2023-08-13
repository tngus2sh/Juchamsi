package com.inet.juchamsi.domain.chat.entity;

import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@NoArgsConstructor
public class Message extends TimeBaseEntity {


    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_people_id", nullable = false)
    private ChatPeople chatPeople;

    @Column(nullable = false)
    private String content;

    @Builder
    public Message(Long id, ChatPeople chatPeople, String content) {
        this.id = id;
        this.chatPeople = chatPeople;
        this.content = content;
    }

}
