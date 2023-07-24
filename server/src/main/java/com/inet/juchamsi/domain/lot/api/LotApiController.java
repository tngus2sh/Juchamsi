package com.inet.juchamsi.domain.lot.api;

import com.inet.juchamsi.domain.lot.dto.request.CreateLotRequest;
import com.inet.juchamsi.domain.lot.dto.response.LotResponse;
import com.inet.juchamsi.domain.lot.application.LotService;
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
@RequestMapping("/lot")
public class LotApiController {

    private final LotService lotService;


    @ApiOperation(value = "주차장 등록", notes = "집 주인은 회원가입 시 주차장 크기를 입력해 등록합니다")
    @PostMapping("")
    public ApiResult<Void> createLot(@ApiParam(value = "lot-dto") @RequestBody CreateLotRequest createLotRequest) {
        return null;
    }

    @ApiOperation(value = "주차장 실시간 현황", notes = "사용자는 실시간 주차장 주차 현황을 확인합니다")
    @GetMapping("/{villa_id}")
    public ApiResult<List<LotResponse>> showLot(@ApiParam(value = "villa-id") @PathVariable("villa_id") Long villaId) {
        return null;
    }
}
