package com.inet.juchamsi.domain.parking.api;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.parking.application.ParkingLotService;
import com.inet.juchamsi.domain.parking.application.ParkingService;
import com.inet.juchamsi.domain.parking.dto.request.CreateLotRequest;
import com.inet.juchamsi.domain.parking.dto.request.CreateParkingHistoryRequest;
import com.inet.juchamsi.domain.parking.dto.request.EntranceExitRequest;
import com.inet.juchamsi.domain.parking.dto.request.EntranceOutTimeRequest;
import com.inet.juchamsi.domain.parking.dto.response.ParkingHistoryResponse;
import com.inet.juchamsi.domain.parking.dto.response.ParkingLotResponse;
import com.inet.juchamsi.global.api.ApiResult;
import com.inet.juchamsi.global.error.NotFoundException;
import com.inet.juchamsi.global.notification.application.FirebaseCloudMessageService;
import com.inet.juchamsi.global.notification.dto.request.FCMNotificationRequest;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.inet.juchamsi.global.api.ApiResult.ERROR;
import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@Log4j2
@RequiredArgsConstructor
@Api(tags = {"주차장"})
@RequestMapping("/parking")
public class ParkingApiController {
    private final ParkingLotService parkingLotService;
    private final ParkingService parkingService;
    private final ChatService chatService;

    @ApiOperation(value = "입차 정보 수집", notes = "입차된 주차의 주차위치와 해당 유저의 mac 주소를 받습니다.")
    @PostMapping("/entrance")
    public ApiResult<Void> createEntrance(
            @ApiParam(value = "user-parking-dto")
            EntranceExitRequest request
    ) {
        log.debug("createEntrance={}", request);
        try {
            parkingService.createEntrance(request);
            // 입차 알림
        } catch (NotFoundException e) {
            return ERROR("존재하지 않는 정보입니다.", HttpStatus.NO_CONTENT);
        }
        return OK(null);
    }

    @ApiOperation(value = "출차시간 등록", notes = "입차된 차의 사용자 id와 주차위치로 출차시간을 등록합니다.")
    @PostMapping("/out_time")
    public ApiResult<Void> createOutTime(
            @ApiParam(value = "user-out-time-dto")
            EntranceOutTimeRequest request
    ) {
        log.debug("createOutTime={}", request);
        try {
            parkingService.createOutTime(request);
        } catch (NotFoundException e) {
            return ERROR("존재하지 않는 정보입니다.", HttpStatus.NO_CONTENT);
        }
        return OK(null);
    }

    @ApiOperation(value = "출차 시간 정보 수정", notes = "입차된 차의 사용자 id와 주차위치로 출차시간을 등록합니다.")
    @PutMapping("/out_time")
    public ApiResult<Void> modifyOutTime(
            @ApiParam(value = "user-out-time-dto")
            EntranceOutTimeRequest request
    ) {
        log.debug("modifyOutTime={}", request);
        try {
            parkingService.modifyOutTime(request);
        } catch (NotFoundException e) {
            return ERROR("존재하지 않는 정보입니다.", HttpStatus.NO_CONTENT);
        }
        return OK(null);
    }

    @ApiOperation(value = "출차 정보 등록", notes = "출차된 차의 위치정보와 해당 유저의 mac 주소를 받습니다.")
    @PostMapping("/exit")
    public ApiResult<Void> createExit(
            @ApiParam(value = "user-parking-dto")
            EntranceExitRequest request
    ) {
        log.debug("createExit={}", request);
        System.out.println("request = " + request);
        try {
            parkingService.createExit(request);
            chatService.removeChatRoom(request.getMacAddress()); // 채팅방 없애기
            return OK(null);
        } catch (NotFoundException e) {
            return ERROR("존재하지 않는 정보입니다.", HttpStatus.BAD_REQUEST);
        }
    }

//    @ApiOperation(value = "주차장 등록", notes = "집 주인은 회원가입 시 주차장 크기를 입력해 등록합니다")
//    @PostMapping("/lot")
//    public ApiResult<Void> createParkingLot(@ApiParam(value = "lot-dto") @RequestBody CreateLotRequest createLotRequest) {
//        return null;
//    }

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

    @ApiOperation(value = "주차장 실시간 현황 상세 조회", notes = "사용자는 각 주차 칸마다 실시간 현황을 확인합니다")
    @GetMapping("/history/{villa_id}/{lot_id}/{seat_number}")
    public ApiResult<ParkingHistoryResponse> showDetailParkingLot(
            @ApiParam(value = "villa-id")
            @PathVariable("villa_id") Long villaId,
            @ApiParam(value = "lot-id")
            @PathVariable("lot_id") Long lotId,
            @ApiParam(value = "seat-number")
            @PathVariable("seat_number") int seatNumber
    ) {
        log.debug("showDetailParkingL={}", villaId);
        try {
            ParkingHistoryResponse parkingHistoryResponse = parkingService.showDetailParkingLot(villaId, lotId, seatNumber);
            return OK(parkingHistoryResponse);
        } catch (NotFoundException e) {
            return ERROR("해당하는 정보가 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        }
    }

}
