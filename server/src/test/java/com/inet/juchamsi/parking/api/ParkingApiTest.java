package com.inet.juchamsi.parking.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.parking.application.ParkingLotService;
import com.inet.juchamsi.domain.parking.dao.ParkingLotRepository;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import static com.inet.juchamsi.domain.parking.entity.ParkingFlag.EMPTY;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("ParkingApiController 테스트")
public class ParkingApiTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    ParkingLotService parkingLotService;
    @Autowired
    ParkingLotRepository parkingLotRepository;
    @Autowired
    VillaRepository villaRepository;


    @Test
    @DisplayName("주차장 실시간 현황")
    void showParkingLot() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        Villa testVilla = insertTestVilla();
        insertParkingLot(targetVilla, testVilla, 3);

        Long villaId = targetVilla.getId();

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/parking/lot/{villa_id}", villaId));

        // then
        actions.andDo(print());
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

    private Villa insertTestVilla() {
        Villa villa = Villa.builder()
                .name("삼성 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .idNumber("123456")
                .totalCount(6)
                .active(ACTIVE)
                .build();
        return villaRepository.save(villa);
    }

    private void insertParkingLot(Villa villa, Villa testVilla, int parkingLotCol) {
        for(int i = 1; i <= parkingLotCol; i++) {
            ParkingLot parkingLot = ParkingLot.builder()
                    .villa(villa)
                    .seatNumber(i)
                    .parkingFlag(EMPTY)
                    .backNumber(i + parkingLotCol)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);

            parkingLot = ParkingLot.builder()
                    .villa(testVilla)
                    .seatNumber(i)
                    .parkingFlag(EMPTY)
                    .backNumber(i + parkingLotCol)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);

            parkingLot = ParkingLot.builder()
                    .villa(villa)
                    .seatNumber(i + parkingLotCol)
                    .parkingFlag(EMPTY)
                    .frontNumber(i)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);

            parkingLot = ParkingLot.builder()
                    .villa(testVilla)
                    .seatNumber(i + parkingLotCol)
                    .parkingFlag(EMPTY)
                    .frontNumber(i)
                    .active(ACTIVE)
                    .build();
            parkingLotRepository.save(parkingLot);
        }
    }
}
