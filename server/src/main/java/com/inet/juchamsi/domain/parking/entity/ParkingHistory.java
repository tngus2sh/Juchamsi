package com.inet.juchamsi.domain.parking.entity;

import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static javax.persistence.EnumType.STRING;

@Entity
@Getter
@NoArgsConstructor
public class ParkingHistory extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne
    private User user;

    @JoinColumn(name = "parking_lot_id", nullable = false)
    @ManyToOne
    private ParkingLot parkingLot;

    @Enumerated(STRING)
    @Column(name = "active")
    private Active active;

    @Column(name = "in_time")
    private Timestamp inTime;

    @Column(name = "out_time")
    private Timestamp outTime;

    @Builder
    public ParkingHistory(Long id, User user, ParkingLot parkingLot, Active active, Timestamp inTime, Timestamp outTime) {
        this.id = id;
        this.user = user;
        this.parkingLot = parkingLot;
        this.active = active;
        this.inTime = inTime;
        this.outTime = outTime;
    }
}
