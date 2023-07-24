package com.inet.juchamsi.domain.kiosk.api;

import com.inet.juchamsi.domain.kiosk.application.impl.KioskService;
import com.inet.juchamsi.domain.kiosk.dto.request.CreateLockerRequest;
import com.inet.juchamsi.domain.kiosk.dto.response.LockerResponse;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"키오스크"})
@RequestMapping("/kiosk")
public class KioskApiController {
    private final KioskService kioskService;

    @ApiOperation(value = "사물함 등록", notes = "새로운 사물함을 등록합니다.")
    @PostMapping("")
    public ApiResult<Void> createLocker(@ApiParam(value = "locker-dto") @RequestBody CreateLockerRequest request){
        return null;
    }

    @ApiOperation(value = "사물함 조회", notes = "사용자는 사물함정보를 조회합니다.")
    @GetMapping("/{locker_id}")
    public ApiResult<LockerResponse> showLocker(@ApiParam(value = "locker-id") @PathVariable("locker_id") Long lockerId) {
        return null;
    }

    @ApiOperation(value = "사물함 정보 삭제", notes = "등록된 사물함 정보를 삭제합니다.")
    @DeleteMapping("/{locker_id")
    public ApiResult<Void> removeLocker(@ApiParam(value = "locker-id") @PathVariable("locker_id") Long lockerId) {
        return null;
    }
}
