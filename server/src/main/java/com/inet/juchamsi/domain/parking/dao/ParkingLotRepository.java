package com.inet.juchamsi.domain.parking.dao;

import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {
    @Query("select count(*) from ParkingLot p where p.villa=:villa")
    Long countByVilla(@Param("villa") Villa villa);
    List<ParkingLot> findByVilla_Id(Long villaId);

    // 빌라, 자리 번호로 주차장 정보 가져오기
    @Query("select p from ParkingLot p left join p.villa v where v.idNumber=:villaIdNumber and p.seatNumber=:seatNumber and p.active=:active")
    Optional<ParkingLot> findBySeatNumber(@Param("villaIdNumber") String villaIdNumber, @Param("seatNumber") int seatNumber, @Param("active")Active active);

    // 자리 맥 주소로 주차장 정보 가져오기
    @Query("select p from ParkingLot p where p.seatMacAddress=:seatMacAddress and p.active=:active")
    Optional<ParkingLot> findBySeatMacAddress(@Param("seatMacAddress") String seatMacAddress, @Param("active") Active active);
}
