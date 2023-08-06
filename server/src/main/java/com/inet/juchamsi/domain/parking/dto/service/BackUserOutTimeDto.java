package com.inet.juchamsi.domain.parking.dto.service;

import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
public class BackUserOutTimeDto {

    private String userId;
    private Timestamp outTime;

    @Builder
    public BackUserOutTimeDto(String userId, Timestamp outTime) {
        this.userId = userId;
        this.outTime = outTime;
    }
}
