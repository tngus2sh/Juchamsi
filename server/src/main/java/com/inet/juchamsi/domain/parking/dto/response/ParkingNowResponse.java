package com.inet.juchamsi.domain.parking.dto.response;

import lombok.Builder;

public class ParkingNowResponse {
    private String parkingNowFlag;
    
    @Builder
    public ParkingNowResponse(String parkingNowFlag) {
        this.parkingNowFlag = parkingNowFlag;
    }
}
