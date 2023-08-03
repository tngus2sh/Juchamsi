package com.inet.juchamsi.domain.parking.application.impl;

import com.inet.juchamsi.domain.parking.application.ParkingService;
import com.inet.juchamsi.domain.parking.dao.ParkingHistoryRepository;
import com.inet.juchamsi.domain.parking.dto.request.EntranceRequest;
import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {
    
    private final ParkingHistoryRepository parkingHistoryRepository;

    // TODO: 입차 위치 정보 저장
    @Override
    public void createEntrance(EntranceRequest request) {
//        ParkingHistory.createParkingHistory()
//        parkingHistoryRepository.save();
    }
}
