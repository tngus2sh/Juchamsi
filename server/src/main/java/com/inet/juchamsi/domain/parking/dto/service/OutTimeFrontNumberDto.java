package com.inet.juchamsi.domain.parking.dto.service;

import com.inet.juchamsi.domain.villa.entity.Villa;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class OutTimeFrontNumberDto {

    private LocalDateTime outTime;
    private int frontNumber;
    private String idNumber;

    @Builder
    public OutTimeFrontNumberDto(LocalDateTime outTime, int frontNumber, String idNumber) {
        this.outTime = outTime;
        this.frontNumber = frontNumber;
        this.idNumber = idNumber;
    }
}
