package com.inet.juchamsi.domain.parking.dao;

import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ParkingHistoryRepository extends JpaRepository<ParkingHistory, Long> {
    // 주차장 식별키와 자리로 현재 주차 되어있는지 확인
    @Query("select ph.id from ParkingHistory ph left join ph.parkingLot pl where pl.seatNumber=:seatNumber and ph.active=:active")
    Optional<Long> existByParkingHistoryAndActive(@Param("seatNumber")int seatNumber, @Param("active") Active active); 
    
}
