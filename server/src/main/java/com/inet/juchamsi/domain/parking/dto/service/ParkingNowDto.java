package com.inet.juchamsi.domain.parking.dto.service;

import com.inet.juchamsi.global.common.Active;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ParkingNowDto {

    private int seatNumber;
    private String villaIdNumber;
    private Active active;

    @Builder
    public ParkingNowDto(int seatNumber, String villaIdNumber, Active active) {
        this.seatNumber = seatNumber;
        this.villaIdNumber = villaIdNumber;
        this.active = active;
    }
}
