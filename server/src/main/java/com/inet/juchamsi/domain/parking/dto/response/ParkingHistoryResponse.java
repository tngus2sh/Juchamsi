package com.inet.juchamsi.domain.parking.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
public class ParkingHistoryResponse {
    
    private String userId;
    private int seatNumber;
    private String outTime;
    private String active; 
    
    @Builder
    public ParkingHistoryResponse(String userId, int seatNumber, String outTime, String active) {
        this.userId = userId;
        this.seatNumber = seatNumber;
        this.outTime = outTime;
        this.active = active;
    }
}
