package com.inet.juchamsi.domain.parking.dto.service;

import com.inet.juchamsi.domain.villa.entity.Villa;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class OutTimeFrontNumberDto {

    private LocalDateTime outTime;
    private int frontNumber;
    private Villa villa;

    @Builder
    public OutTimeFrontNumberDto(LocalDateTime outTime, int frontNumber, Villa villa) {
        this.outTime = outTime;
        this.frontNumber = frontNumber;
        this.villa = villa;
    }
}
