package com.inet.juchamsi.domain.villa.api;

import com.inet.juchamsi.domain.villa.api.request.CreateVillaRequest;
import com.inet.juchamsi.domain.villa.api.response.VillaResponse;
import com.inet.juchamsi.domain.villa.application.VillaService;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@RestController
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"빌라"})
@RequestMapping("/villa")
public class VillaApiController {

    private final VillaService villaService;

    @ApiOperation(value = "빌라 등록", notes = "새로운 빌라를 등록합니다")
    @PostMapping("/")
    public ApiResult<Void> createVilla(@RequestBody CreateVillaRequest request) {
        return null;
    }

    @ApiOperation(value = "빌라 상세 조회", notes = "사용자는 자신의 빌라 상세 정보를 조회합니다")
    @GetMapping("/{villa_id}")
    public ApiResult<VillaResponse> showVillaDetail(@PathVariable("villa_id") Long villaId) {
        return null;
    }

    @ApiOperation(value = "빌라 삭제", notes = "등록된 빌라를 삭제합니다")
    @DeleteMapping("{villa_id}")
    public ApiResult<Void> removeViila(@PathVariable("villa_id") Long villaId) {
        return null;
    }
}
