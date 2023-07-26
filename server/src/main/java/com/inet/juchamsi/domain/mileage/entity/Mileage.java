package com.inet.juchamsi.domain.mileage.entity;

import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class Mileage extends TimeBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

//    @JoinColumn(name = "user_id", nullable = false)
//    @ManyToOne()
//    private User user;

    @Column(name = "point")
    private int point;

    @Column(name = "type")
    private String type;

//    public Mileage(Long id, User user, int point, String type) {
//        this.id = id;
//        this.user = user;
//        this.point = point;
//        this.type = type;
//    }

    public Mileage() {}
}
