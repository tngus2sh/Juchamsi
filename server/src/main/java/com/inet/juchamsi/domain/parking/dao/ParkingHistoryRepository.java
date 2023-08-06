package com.inet.juchamsi.domain.parking.dao;

import com.inet.juchamsi.domain.parking.dto.service.BackUserOutTimeDto;
import com.inet.juchamsi.domain.parking.dto.service.OutTimeFrontNumberDto;
import com.inet.juchamsi.domain.parking.dto.service.ParkingHistoryDetailDto;
import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ParkingHistoryRepository extends JpaRepository<ParkingHistory, Long> {
    // 주차장 식별키와 자리로 현재 주차 되어있는지 확인
    @Query("select new com.inet.juchamsi.domain.parking.dto.service.BackUserOutTimeDto(u.loginId, ph.outTime)  from ParkingHistory ph left join ph.parkingLot pl left join ph.user u left join pl.villa v where v.id=:villaId and pl.seatNumber=:seatNumber and ph.active=:active")
    Optional<BackUserOutTimeDto> findByParkingHistoryAndActive(@Param("villaId") Long villaId, @Param("seatNumber")int seatNumber, @Param("active") Active active);

    // 주차장 맥 주소와 주차내역에서 현재 주차 되어 있다고 뜨는 목록 제일 최신 순으로 하나 가져오기
    @Query("select ph from ParkingHistory ph left join ph.parkingLot pl where pl.seatMacAddress=:seatMacAddress and ph.active=:active order by ph.createdDate desc")
    Optional<ParkingHistory> findBySeatMacAddressAndActive(@Param("seatMacAddress") String seatMacAddress, @Param("active") Active active);

    // 주차장 자리번호와 사용자 아이디로 주차내역 가져오기
    @Query("select ph from ParkingHistory ph left join ph.parkingLot pl left join ph.user u left join pl.villa v where v.idNumber=:idNumber and pl.seatNumber=:seatNumber and u.loginId=:loginId and u.active=:active")
    Optional<ParkingHistory> findAllBySeatNumberAndLoginId(@Param("idNumber") String idNumber, @Param("seatNumber") int seatNumber, @Param("loginId") String loginId, @Param("active") Active active);

    // 사용자 아이디로 출차시간, 앞차 정보, 빌라 식별키 가져오기
    @Query("select new com.inet.juchamsi.domain.parking.dto.service.OutTimeFrontNumberDto(ph.outTime, pl.frontNumber, pl.villa) from ParkingHistory ph left join ph.user u left join ph.parkingLot pl where u.loginId=:loginId and ph.active=:active")
    Optional<OutTimeFrontNumberDto> findParkingHistoryByLoginId(@Param("loginId") String loginId, @Param("active") Active active);

    // 자리번호와 빌라 식별키로 해당 차가 주차 되어있는지 확인, 해당 사용자 아이디 출력
    @Query("select u.loginId  from ParkingHistory ph left join ph.parkingLot pl left join ph.user u where pl.villa=:villa and pl.seatNumber=:seatNumber and ph.active=:active")
    Optional<String> findLoginIdByVilla(@Param("villa") Villa villa, @Param("seatNumber") int seatNumber, @Param("active") Active active);

    // 빌라 아이디와 주차장 아이디로 주차내역 제일 최신으로 그룹화해서 보여주기
    @Query("select new com.inet.juchamsi.domain.parking.dto.service.ParkingHistoryDetailDto(u.loginId, max (ph.outTime), pl.frontNumber, pl.backNumber) from ParkingHistory ph left join ph.parkingLot pl left join pl.villa v left join ph.user u where v.id=:villaId and pl.id=:lotId group by pl.seatNumber")
    List<ParkingHistoryDetailDto> findAllParkingLotByVillaIdAndLotId(@Param("villaId") Long villaId, @Param("lotId") Long lotId);

    // 빌라 식별키와 주차장 자리번호와 사용자 아이디로 주차내역 가져오기
    @Query("select new com.inet.juchamsi.domain.parking.dto.service.ParkingHistoryDetailDto(u.loginId, max (ph.outTime), pl.frontNumber, pl.backNumber) from ParkingHistory ph left join ph.parkingLot pl left join ph.user u where pl.id=:lotId and pl.seatNumber=:seatNumber group by pl.seatNumber")
    Optional<ParkingHistoryDetailDto> findParkingLotBySeatNumberAndLoginId(@Param("lotId") Long lotId, @Param("seatNumber") int seatNumber);

    // 주차 내역 업데이트
    @Modifying(clearAutomatically = true)
    @Query("update ParkingHistory  ph set ph.active=:active where ph.id=:id")
    Optional<Void> updateParkingHistory(@Param("active") Active active, @Param("id") Long id);

    // 주차장 히스토리 출차시간 업데이트
    @Modifying(clearAutomatically = true)
    @Query("update ParkingHistory ph set ph.outTime=:outTime where ph.id=:id")
    Optional<Void> updateOutTime(@Param("outTime") LocalDateTime OutTime, @Param("id") Long id);
}
