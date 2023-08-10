package com.inet.juchamsi.domain.parking.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
public class ParkingHistoryResponse {
    
    private String userId;
    private int seatNumber;
    private String carNumber;
    private String outTime;
    private String active; // ACTIVE : 주차가 됐다, DISABLED : 비어있는 상태
    
    @Builder
    public ParkingHistoryResponse(String userId, int seatNumber, String carNumber, String outTime, String active) {
        this.userId = userId;
        this.seatNumber = seatNumber;
        this.carNumber = carNumber;
        this.outTime = outTime;
        this.active = active;
    }
}
