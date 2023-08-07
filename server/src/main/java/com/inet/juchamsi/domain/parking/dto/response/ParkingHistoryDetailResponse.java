package com.inet.juchamsi.domain.parking.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class ParkingHistoryDetailResponse {

    private String userId; // 사용자 id
    private String outTime; // 출차시간
    private String frontUserId; // 앞 차 사용자 아이디
    private String backUserId; // 뒤 차 사용자 아이디
    private String frontParkingFlag; // 앞 차 주차 여부 FULL|EMPTY
    private String backParkingFlag; // 뒤 차 주차 여부 FULL|EMPTY
    private String frontOutTime; // 앞 차 출차 시간
    private String backOutTime; // 뒤 차 출차 시간
    private int frontCarNumber; // 앞 차 번호
    private int backCarNumber; // 뒤 차 번호

    @Builder
    public ParkingHistoryDetailResponse(String userId, String outTime, String frontUserId, String backUserId, String frontParkingFlag, String backParkingFlag, String frontOutTime, String backOutTime, int frontCarNumber, int backCarNumber) {
        this.userId = userId;
        this.outTime = outTime;
        this.frontUserId = frontUserId;
        this.backUserId = backUserId;
        this.frontParkingFlag = frontParkingFlag;
        this.backParkingFlag = backParkingFlag;
        this.frontOutTime = frontOutTime;
        this.backOutTime = backOutTime;
        this.frontCarNumber = frontCarNumber;
        this.backCarNumber = backCarNumber;
    }
}
