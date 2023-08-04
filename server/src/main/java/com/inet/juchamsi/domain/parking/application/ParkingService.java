package com.inet.juchamsi.domain.parking.application;

import com.inet.juchamsi.domain.parking.dto.request.EntranceRequest;

import javax.transaction.Transactional;

@Transactional
public interface ParkingService {

    // 입차시 입차 정보 넣기
    void createEntrance(EntranceRequest request);

}
