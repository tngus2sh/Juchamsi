package com.inet.juchamsi.domain.parking.entity;

import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Getter;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter
public class ParkingHistory extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @JoinColumn(name = "parking_lot_id", nullable = false)
    @ManyToOne
    private ParkingLot parkingLot;

    @Column(name = "active")
    private String active;

    @Column(name = "in_time")
    private Timestamp inTime;

    @Column(name = "out_time")
    private Timestamp outTime;

    public ParkingHistory(Long id, ParkingLot parkingLot, String active, Timestamp inTime, Timestamp outTime) {
        this.id = id;
        this.parkingLot = parkingLot;
        this.active = active;
        this.inTime = inTime;
        this.outTime = outTime;
    }

    public ParkingHistory() {}
}
