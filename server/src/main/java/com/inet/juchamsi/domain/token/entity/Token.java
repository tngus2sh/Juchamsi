package com.inet.juchamsi.domain.token.entity;

import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.*;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Getter
public class Token extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column()
    private Long id;

    @OneToOne
    @JoinColumn(name = "login_id", referencedColumnName = "login_id")
    private User user;

    @Column(name = "fcm_token")
    private String FCMToken;


    public Token() {}

    @Builder
    public Token(Long id, User user, String FCMToken) {
        this.id = id;
        this.user = user;
        this.FCMToken = FCMToken;
    }

}
