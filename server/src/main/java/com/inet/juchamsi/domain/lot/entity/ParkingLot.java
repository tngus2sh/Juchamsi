package com.inet.juchamsi.domain.lot.entity;

import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Getter;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter
public class ParkingLot extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

//    @ManyToOne
//    @JoinColumn(name = "villa_id", nullable = false)
//    private Villa villa;

    @Column(name="seat_number")
    private int seatNumber;

    @Column(name = "active")
    private String active;

    @Column(name = "front_number")
    private int frontNumber;

    @Column(name = "back_number")
    private int backNumber;

//    public ParkingLot(Long id, Villa villa, int seatNumber, String active, int frontNumber, int backNumber) {
//        this.id = id;
//        this.villa = villa;
//        this.seatNumber = seatNumber;
//        this.active = active;
//        this.frontNumber = frontNumber;
//        this.backNumber = backNumber;
//    }

    public ParkingLot() {}
}
