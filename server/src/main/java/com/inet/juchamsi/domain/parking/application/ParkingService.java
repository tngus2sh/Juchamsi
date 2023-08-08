package com.inet.juchamsi.domain.parking.application;

import com.inet.juchamsi.domain.parking.dto.response.ParkingHistoryResponse;
import com.inet.juchamsi.domain.parking.dto.response.ParkingNowResponse;
import com.inet.juchamsi.domain.parking.dto.request.EntranceRequest;
import com.inet.juchamsi.domain.parking.dto.request.EntranceOutTimeRequest;
import com.inet.juchamsi.domain.parking.dto.request.ExitRequest;
import com.inet.juchamsi.domain.parking.dto.response.ParkingHistoryDetailResponse;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface ParkingService {

    // 입차시 입차 정보 넣기
    void createEntrance(EntranceRequest request);

    // 해당 사용자 아이디로 지금 주차가 되어있는지 확인
    ParkingNowResponse isParkingNow(String userId); 

    // 현재 차주의 출차시간 저장하기
    void createOutTime(EntranceOutTimeRequest request);

    // 차주의 출차시간 정보 변경하기
    void modifyOutTime(EntranceOutTimeRequest request);

    // 출차시 출차 정보 넣기
    void createExit(ExitRequest request);

    // 주차장 정보
    List<ParkingHistoryResponse> showParkingLot(String villaIdNumber);

    // 각 주차장 자리마다 세부 정보 출력
    ParkingHistoryDetailResponse showDetailParkingLot(String villaIdNumber, int seatNumber);

}
