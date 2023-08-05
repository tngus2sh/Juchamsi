package com.inet.juchamsi.domain.parking.application;

import com.inet.juchamsi.domain.parking.dto.request.EntranceExitRequest;
import com.inet.juchamsi.domain.parking.dto.service.ExitTimeDto;

import javax.transaction.Transactional;

@Transactional
public interface ParkingService {

    // 입차시 입차 정보 넣기
    void createEntrance(EntranceExitRequest request);

    // 뒤 차주에게 현재 앞 차주의 출차시간에 대한 알람 주기
    void notifyToBackNumber(ExitTimeDto exitTimeDto);

    // 출차시 출차 정보 넣기
    void createExit(EntranceExitRequest request);

}
