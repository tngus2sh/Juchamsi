package com.inet.juchamsi.domain.parking.entity;

import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.*;

import javax.persistence.*;

import static javax.persistence.EnumType.STRING;

@Entity
@Getter
@ToString
@NoArgsConstructor
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

    @Column(name = "seat_mac_address", nullable = false)
    private String seatMacAddress;

    @Column(name = "front_number")
    private int frontNumber;

    @Column(name = "back_number")
    private int backNumber;

    @Enumerated(STRING)
    @Column(nullable = false)
    @Setter
    private Active active;


    @Builder
    public ParkingLot(Long id, Villa villa, int seatNumber, String seatMacAddress, int frontNumber, int backNumber, Active active) {
        this.id = id;
        this.villa = villa;
        this.seatNumber = seatNumber;
        this.seatMacAddress = seatMacAddress;
        this.frontNumber = frontNumber;
        this.backNumber = backNumber;
        this.active = active;
    }


    /*
        연관관계 편의 메서드
     */
    public static ParkingLot createFrontParkingLot(Villa villa, int seatNumber, String seatMacAddress, int backNumber, Active active) {
        return ParkingLot.builder()
                .villa(villa)
                .seatNumber(seatNumber)
                .seatMacAddress(seatMacAddress)
                .backNumber(backNumber)
                .active(active)
                .build();
    }

    public static ParkingLot createBackParkingLot(Villa villa, int seatNumber, String seatMacAddress, int frontNumber, Active active) {
        return ParkingLot.builder()
                .villa(villa)
                .seatNumber(seatNumber)
                .seatMacAddress(seatMacAddress)
                .frontNumber(frontNumber)
                .active(active)
                .build();
    }
}
