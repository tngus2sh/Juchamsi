package com.inet.juchamsi.domain.parking.dto.service;

import com.inet.juchamsi.global.common.Active;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ParkingHistoryDetailDto {

    private String userId;
    private int seatNumber;
    private LocalDateTime outTime;
    private int frontNumber;
    private int backNumber;
    private Active active;

    @Builder
    public ParkingHistoryDetailDto(String userId, int seatNumber, LocalDateTime outTime, int frontNumber, int backNumber, Active active) {
        this.userId = userId;
        this.seatNumber = seatNumber;
        this.outTime = outTime;
        this.frontNumber = frontNumber;
        this.backNumber = backNumber;
        this.active = active;
    }
}
