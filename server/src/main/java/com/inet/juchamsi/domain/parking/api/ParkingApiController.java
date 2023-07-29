package com.inet.juchamsi.domain.parking.api;

import com.inet.juchamsi.domain.parking.application.ParkingLotService;
import com.inet.juchamsi.domain.parking.application.ParkingService;
import com.inet.juchamsi.domain.parking.dto.request.CreateLotRequest;
import com.inet.juchamsi.domain.parking.dto.request.CreateParkingHistoryRequest;
import com.inet.juchamsi.domain.parking.dto.response.LotResponse;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"주차장"})
@RequestMapping("/parking")
public class ParkingApiController {
    private final ParkingLotService lotService;
    private final ParkingService parkingService;

    @ApiOperation(value = "주차장 등록", notes = "집 주인은 회원가입 시 주차장 크기를 입력해 등록합니다")
    @PostMapping("/lot")
    public ApiResult<Void> createParkingLot(@ApiParam(value = "lot-dto") @RequestBody CreateLotRequest createLotRequest) {
        return null;
    }

    @ApiOperation(value = "주차장 실시간 현황", notes = "사용자는 실시간 주차장 주차 현황을 확인합니다")
    @GetMapping("/lot/{villa_id}")
    public ApiResult<List<LotResponse>> showParkingLot(@ApiParam(value = "villa-id") @PathVariable("villa_id") Long villaId) {
        return null;
    }

    @ApiOperation(value = "주차정보 등록", notes = "주차장 사용자의 주차 시 정보가 등록됩니다.")
    @PostMapping("")
    public ApiResult<Void> createParkingHistory(@ApiParam(value = "parking-history-dto") @RequestBody CreateParkingHistoryRequest createParkingHistoryRequest) {
        return null;
    }

}
