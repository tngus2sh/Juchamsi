package com.inet.juchamsi.domain.parking.dto.service;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ExitTimeDto {

    // 주차위치
    private int seatNumber;
    // 출차시간
    private LocalDateTime outTime;
    // 사용자 id
    private String loginId;

    @Builder
    public ExitTimeDto(int seatNumber, LocalDateTime outTime, String loginId) {
        this.seatNumber = seatNumber;
        this.outTime = outTime;
        this.loginId = loginId;
    }
}
