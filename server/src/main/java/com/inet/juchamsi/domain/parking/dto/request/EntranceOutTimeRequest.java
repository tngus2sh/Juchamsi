package com.inet.juchamsi.domain.parking.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class EntranceOutTimeRequest {

    @NotBlank
    private String userId; // 사용자 id

    private int seatNumber; // 주차 위치
    @NotBlank
    private String outTime; // 출차 시간
}
