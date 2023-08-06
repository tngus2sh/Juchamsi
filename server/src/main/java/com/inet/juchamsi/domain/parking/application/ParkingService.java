package com.inet.juchamsi.domain.parking.application;

import com.inet.juchamsi.domain.parking.dto.request.EntranceExitRequest;
import com.inet.juchamsi.domain.parking.dto.request.EntranceOutTimeRequest;
import com.inet.juchamsi.domain.parking.dto.service.ExitTimeDto;

import javax.transaction.Transactional;

@Transactional
public interface ParkingService {

    // 입차시 입차 정보 넣기
    void createEntrance(EntranceExitRequest request);

    // 현재 차주의 출차시간 저장하기
    void createOutTime(EntranceOutTimeRequest request);

    // 출차시 출차 정보 넣기
    void createExit(EntranceExitRequest request);

}
