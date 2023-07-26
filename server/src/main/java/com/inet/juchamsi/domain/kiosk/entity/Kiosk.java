package com.inet.juchamsi.domain.kiosk.entity;

import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class Kiosk extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    // User완료 시 아래 주석까지 제거
//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;

    @Column(name = "locker_number")
    private int lockerNumber;

    @Column(name = "host_pin")
    private int hostPin;

    @Column(name = "guest_pin")
    private int guestPin;

//    public Kiosk(Long id, User user, int lockerNumber, int hostPin, int guestPin) {
//        this.id = id;
//        this.user = user;
//        this.lockerNumber = lockerNumber;
//        this.hostPin = hostPin;
//        this.guestPin = guestPin;
//    }

    public Kiosk() {}
}
