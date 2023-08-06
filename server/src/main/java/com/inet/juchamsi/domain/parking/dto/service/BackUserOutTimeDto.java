package com.inet.juchamsi.domain.parking.dto.service;

import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
public class BackUserOutTimeDto {

    private String userId;
    private LocalDateTime outTime;

    @Builder
    public BackUserOutTimeDto(String userId, LocalDateTime outTime) {
        this.userId = userId;
        this.outTime = outTime;
    }
}
