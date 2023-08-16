package com.inet.juchamsi.domain.parking.dto.service;

import com.inet.juchamsi.global.common.Active;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ParkingHistoryDetailDto {

    private String userId;
    private int seatNumber;
    private LocalDateTime inTime;
    private LocalDateTime outTime;
    private String carNumber;
    private int frontNumber;
    private int backNumber;
    private Active active;
    private int totalSeatNum;

    @Builder
    public ParkingHistoryDetailDto(String userId, int seatNumber, LocalDateTime inTime, LocalDateTime outTime, String carNumber, int frontNumber, int backNumber, Active active, int totalSeatNum) {
        this.userId = userId;
        this.seatNumber = seatNumber;
        this.inTime = inTime;
        this.outTime = outTime;
        this.carNumber = carNumber;
        this.frontNumber = frontNumber;
        this.backNumber = backNumber;
        this.active = active;
        this.totalSeatNum = totalSeatNum;
    }
}
