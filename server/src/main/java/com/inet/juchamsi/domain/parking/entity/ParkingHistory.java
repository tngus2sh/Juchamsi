package com.inet.juchamsi.domain.parking.entity;

import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static javax.persistence.EnumType.STRING;

@Entity
@Getter
@ToString
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
    @Column(nullable = false)
    private Active active;

    @Column(name = "in_time")
    private LocalDateTime inTime;

    @Column(name = "out_time")
    private LocalDateTime outTime;

    @Builder
    public ParkingHistory(Long id, User user, ParkingLot parkingLot, Active active, LocalDateTime inTime, LocalDateTime outTime) {
        this.id = id;
        this.user = user;
        this.parkingLot = parkingLot;
        this.active = active;
        this.inTime = inTime;
        this.outTime = outTime;
    }
}
