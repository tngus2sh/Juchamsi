package com.inet.juchamsi.domain.parking.dao;

import com.inet.juchamsi.domain.parking.dto.service.BackUserOutTimeDto;
import com.inet.juchamsi.domain.parking.dto.service.OutTimeFrontNumberDto;
import com.inet.juchamsi.domain.parking.dto.service.ParkingHistoryDetailDto;
import com.inet.juchamsi.domain.parking.dto.service.ParkingNowDto;
import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ParkingHistoryRepository extends JpaRepository<ParkingHistory, Long> {

    /* 조회 */

    // 자리 맥 주소로 주차장에 주차 여부 정보 가져오기
    @Query("select ph.id from ParkingHistory ph left join ph.parkingLot pl where pl.seatMacAddress=:seatMacAddress and ph.active=:active")
    Optional<Long> findParkingHistoryBySeatMacAddress(@Param("seatMacAddress") String seatMacAddress, @Param("active") Active active);

    // 사용자 아이디로 지금 현재 주차 되어있는지 확인
    @Query("select  new com.inet.juchamsi.domain.parking.dto.service.ParkingNowDto(pl.seatNumber, v.idNumber, ph.active)  from ParkingHistory ph left join ph.user u left join ph.parkingLot pl left join pl.villa v where u.loginId=:loginId and ph.outTime is null and ph.createdDate in (select max(ph.createdDate) from ParkingHistory ph left join ph.user u group by u.loginId)")
    Optional<ParkingNowDto> findActiveByLoginId(@Param("loginId") String loginId);

    // 사용자 아이디로 출차시간, 앞차 정보, 빌라 식별키 가져오기
    @Query("select new com.inet.juchamsi.domain.parking.dto.service.OutTimeFrontNumberDto(ph.outTime, pl.frontNumber, pl.villa) from ParkingHistory ph left join ph.user u left join ph.parkingLot pl where u.loginId=:loginId and ph.active=:active and ph.createdDate in (select max(ph.createdDate) from ParkingHistory ph left join ph.user u where u.loginId=:loginId group by u.loginId)")
    Optional<OutTimeFrontNumberDto> findParkingHistoryByLoginId(@Param("loginId") String loginId, @Param("active") Active active);

    // 자리번호와 빌라 식별키로 해당 차가 주차 되어있는지 확인, 해당 사용자 아이디 출력
    @Query("select u.loginId  from ParkingHistory ph left join ph.parkingLot pl left join ph.user u left join pl.villa v where v.idNumber=:villaIdNumber and pl.seatNumber=:seatNumber and ph.active=:active and ph.createdDate in (select max(ph.createdDate) from ParkingHistory ph left join ph.parkingLot pl where pl.seatNumber=:seatNumber group by pl.seatNumber)")
    Optional<String> findLoginIdByVilla(@Param("villaIdNumber") String villaIdNumber, @Param("seatNumber") int seatNumber, @Param("active") Active active);

    // 사용자 맥 주소로 현재 주차되어있는 위치를 가져옴
    @Query("select ph from ParkingHistory ph left join ph.user u where u.macAddress=:macAddress and u.active=:uActive and ph.active=:phActive and ph.createdDate in (select max(ph.createdDate) from ParkingHistory ph left join ph.user u where u.macAddress=:macAddress group by u.macAddress)")
    Optional<ParkingHistory> findActiveByMacAddress(@Param("macAddress") String macAddress, @Param("uActive") Active uActive, @Param("phActive") Active phActive);

    // 사용자 맥 주소로 주차장 정보 가져오기
    @Query("select pl from ParkingHistory ph left join ph.user u left join ph.parkingLot pl where u.macAddress=:macAddress and ph.active=:active and ph.createdDate in (select max(ph.createdDate) from ParkingHistory ph left join ph.user u where u.macAddress=:macAddress group by u.macAddress)")
    Optional<ParkingLot> findParkingLotByMacAddress(@Param("macAddress") String macAddress, @Param("active") Active active);

    // 주차장 식별번호와 자리로 현재 주차 되어있는지 확인
    @Query("select new com.inet.juchamsi.domain.parking.dto.service.BackUserOutTimeDto(u.loginId, u.carNumber, ph.outTime)  from ParkingHistory ph left join ph.parkingLot pl left join ph.user u left join pl.villa v where v.idNumber=:villaIdNumber and pl.seatNumber=:seatNumber and ph.active=:active and ph.createdDate in (select max(ph.createdDate) from ParkingHistory ph left join ph.user u group by u.loginId)")
    Optional<BackUserOutTimeDto> findByParkingHistoryAndActive(@Param("villaIdNumber") String villaIdNumber, @Param("seatNumber") int seatNumber, @Param("active") Active active);

    // 주차장 자리번호와 사용자 아이디로 주차내역 가져오기
    @Query("select ph from ParkingHistory ph left join ph.parkingLot pl left join ph.user u where pl.seatNumber=:seatNumber and u.loginId=:loginId and u.active=:active and ph.createdDate in (select max(ph.createdDate) from ParkingHistory ph left join ph.user u where u.loginId=:loginId group by u.loginId)")
    Optional<ParkingHistory> findAllBySeatNumberAndLoginId(@Param("seatNumber") int seatNumber, @Param("loginId") String loginId, @Param("active") Active active);

    // 빌라 식별번호로 주차내역 제일 최신으로 그룹화해서 보여주기
    @Query("select new com.inet.juchamsi.domain.parking.dto.service.ParkingHistoryDetailDto(u.loginId, pl.seatNumber, ph.outTime, pl.frontNumber,pl.backNumber, ph.active) from ParkingHistory ph left join ph.parkingLot pl left join pl.villa v left join ph.user u where v.idNumber=:villaIdNumber and ph.createdDate in (select max(ph.createdDate) from ParkingHistory ph left join ph.parkingLot pl group by pl.seatNumber)")
    List<ParkingHistoryDetailDto> findAllParkingLotByVillaIdAndLotId(@Param("villaIdNumber") String villaIdNumber);

    // 빌라 식별번호로 주차장 자리번호로 주차내역 가져오기
    @Query("select new com.inet.juchamsi.domain.parking.dto.service.ParkingHistoryDetailDto(u.loginId, pl.seatNumber, ph.outTime, pl.frontNumber, pl.backNumber, ph.active) from ParkingHistory ph left join ph.parkingLot pl left join ph.user u left join pl.villa v where v.idNumber=:villaIdNumber and pl.seatNumber=:seatNumber and ph.createdDate in (select max(ph.createdDate) from ParkingHistory ph left join ph.parkingLot pl group by pl.seatNumber)")
    Optional<ParkingHistoryDetailDto> findParkingLotBySeatNumberAndLoginId(@Param("villaIdNumber") String villaIdNumber, @Param("seatNumber") int seatNumber);

    /* 수정 */

    // 주차장 히스토리 출차시간 업데이트
    @Modifying(clearAutomatically = true)
    @Query("update ParkingHistory ph set ph.outTime=:outTime where ph.id=:id")
    Optional<Void> updateOutTime(@Param("outTime") LocalDateTime OutTime, @Param("id") Long id);

    // 주차 내역 업데이트
    @Modifying(clearAutomatically = true)
    @Query("update ParkingHistory  ph set ph.active=:active where ph.id=:id")
    Optional<Void> updateParkingHistory(@Param("active") Active active, @Param("id") Long id);

}
