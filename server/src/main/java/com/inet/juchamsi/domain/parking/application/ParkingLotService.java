package com.inet.juchamsi.domain.parking.application;

import com.inet.juchamsi.domain.parking.dto.response.ParkingLotResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ParkingLotService {
    void createParkingLot(Long villaId, int parkingLotCol);
    List<ParkingLotResponse> showParkingLot(Long villaId);
}
