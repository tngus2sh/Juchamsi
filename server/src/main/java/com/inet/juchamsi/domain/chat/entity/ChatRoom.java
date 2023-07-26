package com.inet.juchamsi.domain.chat.entity;

import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.sql.Timestamp;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Getter
public class ChatRoom extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column()
    private Long id;

    @Column(nullable = false, length = 100)
    String status;

    @Builder
    public ChatRoom(Long id, String status) {
        this.id = id;
        this.status = status;
    }

    public ChatRoom() {}
}
