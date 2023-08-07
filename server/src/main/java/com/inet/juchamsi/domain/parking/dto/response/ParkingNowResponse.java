package com.inet.juchamsi.domain.parking.dto.response;

import lombok.Builder;

public class ParkingNowResponse {
    private String parkingNowFlag; // TRUE: 이제 막 주차를 했는데 출차시간을 적지 않은 상태, FALSE:  출차시간을 적은 상태
    private int seatNumber;
    private String villaIdNumber;
    
    @Builder
    public ParkingNowResponse(String parkingNowFlag, int seatNumber, String villaIdNumber) {
        this.parkingNowFlag = parkingNowFlag;
        this.seatNumber = seatNumber;
        this.villaIdNumber = villaIdNumber;
    }
}
