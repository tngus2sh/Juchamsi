package com.inet.juchamsi.domain.villa.api;

import com.inet.juchamsi.domain.villa.dto.request.CreateVillaRequest;
import com.inet.juchamsi.domain.villa.dto.request.ModifyVillaRequest;
import com.inet.juchamsi.domain.villa.dto.response.VillaResponse;
import com.inet.juchamsi.domain.villa.application.VillaService;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import static com.inet.juchamsi.global.api.ApiResult.OK;


@RestController
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"빌라"})
@RequestMapping("/villa")
public class VillaApiController {

    private final VillaService villaService;


    @ApiOperation(value = "빌라 등록", notes = "새로운 빌라를 등록합니다")
    @PostMapping("")
    public ApiResult<Void> createVilla(@ApiParam(value = "villa-dto") @RequestBody CreateVillaRequest request) {
        return null;
    }

    @ApiOperation(value = "빌라 상세 조회", notes = "사용자는 자신의 빌라 상세 정보를 조회합니다")
    @GetMapping("/{villa_id}")
    public ApiResult<VillaResponse> showDetailVilla(@ApiParam(value = "villa-id") @PathVariable("villa_id") Long villaId) {
        VillaResponse response = villaService.showDetailVilla(villaId);
        return OK(response);
    }

    @ApiOperation(value = "빌라 수정", notes = "등록된 빌라 정보를 수정합니다")
    @PutMapping("")
    public ApiResult<Void> modifyVilla(@ApiParam(value = "villa-dto") @RequestBody ModifyVillaRequest request) {
        villaService.modifyVilla(request);
        return OK(null);
    }

    @ApiOperation(value = "빌라 삭제", notes = "등록된 빌라를 삭제합니다")
    @DeleteMapping("/{villa_id}")
    public ApiResult<Void> removeViila(@ApiParam(value = "villa-id") @PathVariable("villa_id") Long villaId) {
        villaService.removeVilla(villaId);
        return OK(null);
    }
}
