package com.inet.juchamsi.domain.parking.dao;

import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingHistoryRepository extends JpaRepository<ParkingHistory, Long> {
}
