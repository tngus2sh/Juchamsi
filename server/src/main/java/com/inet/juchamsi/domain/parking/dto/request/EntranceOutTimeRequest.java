package com.inet.juchamsi.domain.parking.dto.request;

import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class EntranceOutTimeRequest {

    @NotBlank
    private String villaIdNumber; // 빌라 식별 번호
    @NotBlank
    private String userId; // 사용자 id
    private int seatNumber; // 주차 위치
    @NotBlank
    private String outTime; // 출차 시간

    @Builder
    public EntranceOutTimeRequest(String villaIdNumber, String userId, int seatNumber, String outTime) {
        this.villaIdNumber = villaIdNumber;
        this.userId = userId;
        this.seatNumber = seatNumber;
        this.outTime = outTime;
    }
}
