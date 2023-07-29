package com.inet.juchamsi.domain.parking.application;

import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface ParkingLotService {
    void createParkingLot(Long villaId, int parkingLotCol);
}
