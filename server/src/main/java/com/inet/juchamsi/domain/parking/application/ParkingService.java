package com.inet.juchamsi.domain.parking.application;

import com.inet.juchamsi.domain.parking.dto.request.EntranceExitRequest;
import com.inet.juchamsi.domain.parking.dto.request.EntranceOutTimeRequest;
import com.inet.juchamsi.domain.parking.dto.response.ParkingHistoryResponse;
import com.inet.juchamsi.domain.parking.dto.service.ExitTimeDto;
import com.inet.juchamsi.domain.parking.dto.service.ParkingHistoryDetailDto;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface ParkingService {

    // 입차시 입차 정보 넣기
    void createEntrance(EntranceExitRequest request);

    // 현재 차주의 출차시간 저장하기
    void createOutTime(EntranceOutTimeRequest request);

    // 차주의 출차시간 정보 변경하기
    void modifyOutTime(EntranceOutTimeRequest request);

    // 출차시 출차 정보 넣기
    void createExit(EntranceExitRequest request);

    // 주차장 정보
    List<ParkingHistoryResponse> showParkingLot(Long villaId, Long lotId);

    // 각 주차장 자리마다 세부 정보 출력
    ParkingHistoryResponse showDetailParkingLot(Long villaId, Long lotId, int seatNumber);

}
