package com.inet.juchamsi.domain.parking.dto.service;

import lombok.Builder;
import lombok.Data;

@Data
public class ExitTimeDto {

    // 빌라식별번호
    private String villaIdNumber;
    // 주차위치
    private int seatNumber;
    // 출차시간
    private String outTime;
    // 사용자 id
    private String loginId;

    @Builder
    public ExitTimeDto(String villaIdNumber, int seatNumber, String outTime, String loginId) {
        this.villaIdNumber = villaIdNumber;
        this.seatNumber = seatNumber;
        this.outTime = outTime;
        this.loginId = loginId;
    }
}
