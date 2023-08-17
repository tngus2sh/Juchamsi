package com.inet.juchamsi.domain.parking.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
public class ParkingHistoryResponse {
    
    private String userId;
    private int seatNumber;
    private String carNumber;
    private String inTime;
    private String outTime;
    private String active; // ACTIVE : 주차가 됐다, DISABLED : 비어있는 상태
    private int totalSeatNum;
    
    @Builder
    public ParkingHistoryResponse(String userId, int seatNumber, String carNumber, String inTime, String outTime, String active, int totalSeatNum) {
        this.userId = userId;
        this.seatNumber = seatNumber;
        this.carNumber = carNumber;
        this.inTime = inTime;
        this.outTime = outTime;
        this.active = active;
        this.totalSeatNum = totalSeatNum;
    }
}
