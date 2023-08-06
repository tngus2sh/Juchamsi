package com.inet.juchamsi.domain.parking.dao;

import com.inet.juchamsi.domain.parking.dto.service.BackUserOutTimeDto;
import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.sql.Timestamp;
import java.util.Optional;

public interface ParkingHistoryRepository extends JpaRepository<ParkingHistory, Long> {
    // 주차장 식별키와 자리로 현재 주차 되어있는지 확인
    @Query("select new com.inet.juchamsi.domain.parking.dto.service.BackUserOutTimeDto(u.loginId, ph.outTime)  from ParkingHistory ph left join ph.parkingLot pl left join ph.user u where pl.villa=:villa and pl.seatNumber=:seatNumber and ph.active=:active")
    Optional<BackUserOutTimeDto> findByParkingHistoryAndActive(@Param("vila") Villa vill, @Param("seatNumber")int seatNumber, @Param("active") Active active);

    // 주차장 맥 주소와 주차내역에서 현재 주차 되어 있다고 뜨는 목록 제일 최신 순으로 하나 가져오기
    @Query("select ph from ParkingHistory ph left join ph.parkingLot pl where pl.seatMacAddress=:seatMacAddress and ph.active=:active order by ph.createdDate desc")
    Optional<ParkingHistory> findBySeatMacAddressAndActive(@Param("seatMacAddress") String seatMacAddress, @Param("active") Active active);

    // 주차장 자리번호와 사용자 아이디로 주차내역 가져오기
    @Query("select ph from ParkingHistory ph left join ph.parkingLot pl left join ph.user u where pl.seatNumber=:seatNumber and u.loginId=:loginId and u.active=:active")
    Optional<ParkingHistory> findAllBySeatNumberAndLoginId(@Param("seatNumber") int seatNumber, @Param("loginId") String loginId, @Param("active") Active active);

    // 주차장 히스토리 업데이트
    @Modifying(clearAutomatically = true)
    @Query("update ParkingHistory  ph set ph.active=:active where ph.id=:id")
    Optional<Void> updateParkingHistory(@Param("active") Active active, @Param("id") Long id);

    // 주차장 히스토리 출차시간 업데이트
    @Modifying(clearAutomatically = true)
    @Query("update ParkingHistory ph set ph.outTime=:outTime where ph.id=:id")
    Optional<Void> updateOutTime(@Param("outTime") Timestamp OutTime, @Param("id") Long id);
}
