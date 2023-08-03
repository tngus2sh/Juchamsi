package com.inet.juchamsi.domain.parking.dao;

import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {
    @Query("select count(*) from ParkingLot p where p.villa=:villa")
    Long countByVilla(@Param("villa") Villa villa);
    List<ParkingLot> findByVilla_Id(Long villaId);
    
    // 입차시 입차 위치를 db에 업데이트
}
