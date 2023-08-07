package com.inet.juchamsi.domain.parking.dto.service;

import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
public class BackUserOutTimeDto {

    private String userId;
    private String carNumber;
    private LocalDateTime outTime;

    @Builder
    public BackUserOutTimeDto(String userId, String carNumber, LocalDateTime outTime) {
        this.userId = userId;
        this.carNumber = carNumber;
        this.outTime = outTime;
    }
}
