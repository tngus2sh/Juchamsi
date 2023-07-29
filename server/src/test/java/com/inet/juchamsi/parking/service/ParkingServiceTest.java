package com.inet.juchamsi.parking.service;

import com.inet.juchamsi.domain.parking.application.ParkingLotService;
import com.inet.juchamsi.domain.parking.dao.ParkingLotRepository;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
@Transactional
public class ParkingServiceTest {

    @Autowired
    ParkingLotService parkingService;
    @Autowired
    ParkingLotRepository parkingLotRepository;
    @Autowired
    VillaRepository villaRepository;


    @Test
    @DisplayName("주차장 등록")
    void createParkingLot() {
        // given
        Villa targetVilla = insertVilla();
        Long villaId = targetVilla.getId();
        int parkingLotCol = 3;

        // when
        parkingService.createParkingLot(villaId, parkingLotCol);

        // then
        Long count = parkingLotRepository.countByVilla(targetVilla);
        assertThat(count).isEqualTo(parkingLotCol * 2);
    }


    private Villa insertVilla() {
        Villa villa = Villa.builder()
                .name("삼성 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .idNumber("62218271")
                .totalCount(6)
                .active(ACTIVE)
                .build();
        return villaRepository.save(villa);
    }
}
