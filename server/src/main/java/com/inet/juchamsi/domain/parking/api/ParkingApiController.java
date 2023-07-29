package com.inet.juchamsi.domain.parking.api;

import com.inet.juchamsi.domain.parking.application.ParkingLotService;
import com.inet.juchamsi.domain.parking.application.ParkingService;
import com.inet.juchamsi.domain.parking.dto.request.CreateLotRequest;
import com.inet.juchamsi.domain.parking.dto.request.CreateParkingHistoryRequest;
import com.inet.juchamsi.domain.parking.dto.response.ParkingHistoryResponse;
import com.inet.juchamsi.domain.parking.dto.response.ParkingLotResponse;
import com.inet.juchamsi.global.api.ApiResult;
import com.inet.juchamsi.global.error.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.inet.juchamsi.global.api.ApiResult.ERROR;
import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"주차장"})
@RequestMapping("/parking")
public class ParkingApiController {
    private final ParkingLotService parkingLotService;
    private final ParkingService parkingService;

    @ApiOperation(value = "주차장 등록", notes = "집 주인은 회원가입 시 주차장 크기를 입력해 등록합니다")
    @PostMapping("/lot")
    public ApiResult<Void> createParkingLot(@ApiParam(value = "lot-dto") @RequestBody CreateLotRequest createLotRequest) {
        return null;
    }

    @ApiOperation(value = "주차장 실시간 현황", notes = "사용자는 실시간 주차장 주차 현황을 확인합니다")
    @GetMapping("/lot/{villa_id}")
    public ApiResult<List<ParkingLotResponse>> showParkingLot(@ApiParam(value = "villa-id") @PathVariable("villa_id") Long villaId) {
        log.debug("ShowParkingLot={}", villaId);

        try {
            List<ParkingLotResponse> response = parkingLotService.showParkingLot(villaId);
            return OK(response);
        }
        catch(NotFoundException e) {
            return ERROR("해당하는 주차장 정보가 없습니다.", HttpStatus.NO_CONTENT);
        }
    }

    @ApiOperation(value = "주차장 삭제", notes = "사용자는 주차장을 삭제합니다")
    @DeleteMapping("/lot/{villa_id}")
    public ApiResult<Void> removeParkingLot(@ApiParam(value = "villa-id") @PathVariable("villa_id") Long villaId) {
        try {
            parkingLotService.removeParkingLot(villaId);
        }
        catch(NotFoundException e) {
            return ERROR("해당하는 주차장 정보가 없습니다.", HttpStatus.NO_CONTENT);
        }

        return OK(null);
    }

    @ApiOperation(value = "주차정보 등록", notes = "주차장 사용자의 주차 시 정보가 등록됩니다.")
    @PostMapping("")
    public ApiResult<Void> createParkingHistory(@ApiParam(value = "parking-history-dto") @RequestBody CreateParkingHistoryRequest createParkingHistoryRequest) {
        return null;
    }

    @ApiOperation(value = "주차장 실시간 현황 상세 조회", notes = "사용자는 각 주차 칸마다 실시간 현황을 확인합니다")
    @GetMapping("/history/{villa_id}/{lot_id}")
    public ApiResult<ParkingHistoryResponse> showDetailParkingLot(@ApiParam(value = "villa-id") @PathVariable("villa_id") Long villaId, @ApiParam(value = "lot-id") @PathVariable("lot_id") Long lotId) {
        return null;
    }

}
