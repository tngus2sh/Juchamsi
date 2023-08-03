package com.inet.juchamsi.domain.parking.application.impl;

import com.inet.juchamsi.domain.parking.application.ParkingService;
import com.inet.juchamsi.domain.parking.dao.ParkingHistoryRepository;
import com.inet.juchamsi.domain.parking.dao.ParkingLotRepository;
import com.inet.juchamsi.domain.parking.dto.request.EntranceRequest;
import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;

import static com.inet.juchamsi.global.common.Active.ACTIVE;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {

    private final ParkingLotRepository parkingLotRepository;
    private final ParkingHistoryRepository parkingHistoryRepository;
    private final UserRepository userRepository;

    // 입차 위치 정보 저장
    @Override
    public void createEntrance(EntranceRequest request) {
        // 주차 위치로 주차장 정보 가져오기
        int seatNumber = request.getZone();
        Optional<ParkingLot> parkingLot =  parkingLotRepository.findBySeatNumber(seatNumber, ACTIVE);
        if (parkingLot.isEmpty()) {
            throw new NotFoundException(ParkingLot.class, seatNumber);
        }
        // mac 주소로 사용자 내역 가져오기
        String macAddress = request.getMacAddress();
        Optional<User> user = userRepository.findUserByMacAddress(macAddress, ACTIVE);
        if (user.isEmpty()) {
            throw new NotFoundException(User.class, macAddress);
        }
        // 현재 시간 출력
        Timestamp inTime = new Timestamp(System.currentTimeMillis());
        // 주차 히스토리 저장
        parkingHistoryRepository.save(ParkingHistory.builder()
                        .user(user.get())
                        .parkingLot(parkingLot.get())
                        .active(ACTIVE)
                        .inTime(inTime)
                        .outTime(null)
                        .build());
    }
}
