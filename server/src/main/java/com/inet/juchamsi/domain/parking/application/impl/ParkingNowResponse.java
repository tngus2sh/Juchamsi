package com.inet.juchamsi.domain.parking.application.impl;

import lombok.Builder;

public class ParkingNowResponse {
    private String parkingNowFlag;
    
    @Builder
    public ParkingNowResponse(String parkingNowFlag) {
        this.parkingNowFlag = parkingNowFlag;
    }
}
