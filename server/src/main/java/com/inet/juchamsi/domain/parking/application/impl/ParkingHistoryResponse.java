package com.inet.juchamsi.domain.parking.application.impl;


import lombok.Builder;
import lombok.Data;

@Data
public class ParkingHistoryResponse {
    
    private String userId;
    private String outTime;
    private String active; 
    
    @Builder
    public ParkingHistoryResponse(String userId, String outTime, String active) {
        this.userId = userId;
        this.outTime = outTime;
        this.active = active;
    }
}
