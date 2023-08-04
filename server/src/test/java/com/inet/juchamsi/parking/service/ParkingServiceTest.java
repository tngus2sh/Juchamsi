package com.inet.juchamsi.parking.service;

import com.inet.juchamsi.domain.parking.application.ParkingLotService;
import com.inet.juchamsi.domain.parking.dao.ParkingLotRepository;
import com.inet.juchamsi.domain.parking.dto.response.ParkingLotResponse;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

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

        Long villaId = targetVilla.getId();

        // when
        List<ParkingLotResponse> response =  parkingLotService.showParkingLot(villaId);

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

        Long villaId = targetVilla.getId();

        // when
        parkingLotService.removeParkingLot(villaId);

        // then
        List<ParkingLot> parkingLotList = parkingLotRepository.findByVilla_Id(villaId);
        for(int i = 0; i < parkingLotList.size(); i++) {
            assertThat(parkingLotList.get(i).getActive()).isEqualTo(DISABLED);
        }
    }

    @Test
    @DisplayName("주차장 실시간 현황 상세 조회")
    void showDetailParkingLot() {
        // given

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
            ParkingLot parkingLot = ParkingLot.builder()
                    .villa(villa)
                    .seatNumber(i)
                    .backNumber(i + parkingLotCol)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);

            parkingLot = ParkingLot.builder()
                    .villa(testVilla)
                    .seatNumber(i)
                    .backNumber(i + parkingLotCol)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);

            parkingLot = ParkingLot.builder()
                    .villa(villa)
                    .seatNumber(i + parkingLotCol)
                    .frontNumber(i)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);

            parkingLot = ParkingLot.builder()
                    .villa(testVilla)
                    .seatNumber(i + parkingLotCol)
                    .frontNumber(i)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);
        }
    }
}
