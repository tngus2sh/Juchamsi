package com.inet.juchamsi.domain.parking.entity;

import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

import static javax.persistence.EnumType.STRING;

@Entity
@Getter
@ToString
public class ParkingLot extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @ManyToOne
    @JoinColumn(name = "villa_id", nullable = false)
    private Villa villa;

    @Column(name="seat_number", nullable = false)
    private int seatNumber;

    @Enumerated(STRING)
    @Column(name = "parking_flag", nullable = false)
    private ParkingFlag parkingFlag;

    @Column(name = "front_number")
    private int frontNumber;

    @Column(name = "back_number")
    private int backNumber;

    @Enumerated(STRING)
    @Column(nullable = false)
    @Setter
    private Active active;


    public ParkingLot() {}

    @Builder
    public ParkingLot(Long id, Villa villa, int seatNumber, ParkingFlag parkingFlag, int frontNumber, int backNumber, Active active) {
        this.id = id;
        this.villa = villa;
        this.seatNumber = seatNumber;
        this.parkingFlag = parkingFlag;
        this.frontNumber = frontNumber;
        this.backNumber = backNumber;
        this.active = active;
    }


    /*
        연관관계 편의 메서드
     */
    public static ParkingLot createFrontParkingLot(Villa villa, int seatNumber, ParkingFlag parkingFlag, int backNumber, Active active) {
        return ParkingLot.builder()
                .villa(villa)
                .seatNumber(seatNumber)
                .parkingFlag(parkingFlag)
                .backNumber(backNumber)
                .active(active)
                .build();
    }

    public static ParkingLot createBackParkingLot(Villa villa, int seatNumber, ParkingFlag parkingFlag, int frontNumber, Active active) {
        return ParkingLot.builder()
                .villa(villa)
                .seatNumber(seatNumber)
                .parkingFlag(parkingFlag)
                .frontNumber(frontNumber)
                .active(active)
                .build();
    }
}
