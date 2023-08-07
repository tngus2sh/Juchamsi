package com.inet.juchamsi.parking.service;

import com.inet.juchamsi.domain.parking.application.ParkingLotService;
import com.inet.juchamsi.domain.parking.application.ParkingService;
import com.inet.juchamsi.domain.parking.dao.ParkingHistoryRepository;
import com.inet.juchamsi.domain.parking.dto.request.EntranceRequest;
import com.inet.juchamsi.domain.parking.dto.response.ParkingHistoryResponse;
import com.inet.juchamsi.domain.parking.dao.ParkingLotRepository;
import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static com.inet.juchamsi.global.common.Active.DISABLED;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class ParkingServiceTest {

    @Autowired
    ParkingLotService parkingLotService;
    @Autowired
    ParkingLotRepository parkingLotRepository;
    @Autowired
    VillaRepository villaRepository;
    @Autowired
    ParkingService parkingService;
    @Autowired
    ParkingHistoryRepository parkingHistoryRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;


    @Test
    @DisplayName("주차장 등록")
    void createParkingLot() {
        // given
        Villa targetVilla = insertVilla("62218271", 6);
        Long villaId = targetVilla.getId();
        int parkingLotCol = 3;

        // when
        parkingLotService.createParkingLot(villaId, parkingLotCol);

        // then
        Long count = parkingLotRepository.countByVilla(targetVilla);
        assertThat(count).isEqualTo(parkingLotCol * 2);
    }

    @Test
    @DisplayName("주차장 실시간 현황")
    void showParkingLot() {
        // given
        Villa targetVilla = insertVilla("62218271", 6);
        Villa testVilla = insertVilla("123456", 6);
        insertParkingLot(targetVilla, testVilla, 3);

        String villaIdNumber = targetVilla.getIdNumber();

        // when
        List<ParkingHistoryResponse> response =  parkingService.showParkingLot(villaIdNumber);

        // then
        assertNotNull(response);
    }

    @Test
    @DisplayName("주차장 삭제")
    void removeParkingLot() {
        // given
        Villa targetVilla = insertVilla("62218271", 6);
        Villa testVilla = insertVilla("123456", 6);
        insertParkingLot(targetVilla, testVilla, 3);

        String villaIdNumber = targetVilla.getIdNumber();

        // when
        parkingLotService.removeParkingLot(villaIdNumber);

        // then
        List<ParkingLot> parkingLotList = parkingLotRepository.findByIdNumber(villaIdNumber);
        for(int i = 0; i < parkingLotList.size(); i++) {
            assertThat(parkingLotList.get(i).getActive()).isEqualTo(DISABLED);
        }
    }

    @Test
    @DisplayName("입차 위치 정보 저장")
    void createEntrance() {
        // given
        tenantUser();
        Villa targetVilla = insertVilla("62218271", 6);
        Villa testVilla = insertVilla("123456", 6);
        insertParkingLot(targetVilla, testVilla, 3);
        EntranceRequest entranceRequest = EntranceRequest.builder()
                .groundAddress("b0:a7:32:db:c8:46 ")
                .macAddress("dc:a6:32:70:b7:ca")
                .build();

        // when
        parkingService.createEntrance(entranceRequest);

        // then
        List<ParkingHistory> parkingHistories = parkingHistoryRepository.findAll();
        assertNotNull(parkingHistories);
    }

    @Test
    @DisplayName("사용자 주차 상태 확인")
    void isParkingNow() {

    }


    private Villa insertVilla(String idNumber, int totalCount) {
        Villa villa = Villa.builder()
                .name("삼성 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .idNumber(idNumber)
                .totalCount(totalCount)
                .active(ACTIVE)
                .build();
        return villaRepository.save(villa);
    }

    private void insertParkingLot(Villa villa, Villa testVilla, int parkingLotCol) {
        for(int i = 1; i <= parkingLotCol; i++) {
            if (i == 1) {
                ParkingLot parkingLot = ParkingLot.builder()
                        .villa(villa)
                        .seatNumber(i)
                        .seatMacAddress("b0:a7:32:db:c8:46 ")
                        .backNumber(i + parkingLotCol)
                        .active(ACTIVE)
                        .build();
                parkingLotRepository.save(parkingLot);
            }
            else {
                ParkingLot parkingLot = ParkingLot.builder()
                        .villa(villa)
                        .seatNumber(i)
                        .seatMacAddress(Integer.toString(i))
                        .backNumber(i + parkingLotCol)
                        .active(ACTIVE)
                        .build();
                parkingLotRepository.save(parkingLot);
            }
            ParkingLot parkingLot = ParkingLot.builder()
                    .villa(testVilla)
                    .seatNumber(i)
                    .seatMacAddress(Integer.toString(i))
                    .backNumber(i + parkingLotCol)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);

            parkingLot = ParkingLot.builder()
                    .villa(villa)
                    .seatNumber(i + parkingLotCol)
                    .seatMacAddress(Integer.toString(i))
                    .frontNumber(i)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);

            parkingLot = ParkingLot.builder()
                    .villa(testVilla)
                    .seatNumber(i + parkingLotCol)
                    .seatMacAddress(Integer.toString(i))
                    .frontNumber(i)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);
        }
    }
    private User tenantUser() {
        Villa villa = Villa.builder()
                .name("삼성 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .idNumber("62218271")
                .totalCount(6)
                .active(ACTIVE)
                .build();
        villaRepository.save(villa);
        return userRepository.save(User.builder()
                .villa(villa)
                .loginId("tenantId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01099998888")
                .name("최입자")
                .macAddress("dc:a6:32:70:b7:ca")
                .grade(Grade.USER)
                .approve(Approve.WAIT)
                .active(Active.ACTIVE)
                .roles(Collections.singletonList("USER"))
                .build());
    }
}
