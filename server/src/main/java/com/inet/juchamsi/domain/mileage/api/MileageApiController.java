package com.inet.juchamsi.domain.mileage.api;

import com.inet.juchamsi.domain.mileage.application.MileageService;
import com.inet.juchamsi.domain.mileage.dto.response.MileageResponse;
import com.inet.juchamsi.domain.mileage.entity.Mileage;
import com.inet.juchamsi.global.api.ApiResult;
import com.inet.juchamsi.global.error.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.inet.juchamsi.global.api.ApiResult.ERROR;
import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequestMapping("/mileage")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"마일리지"})
public class MileageApiController {

    private final MileageService mileageService;

    @ApiOperation(value = "마일리지 조회", notes = "내 마일리지 내역을 조회할 수 있습니다.")
    @GetMapping("/{id}")
    public ApiResult<List<MileageResponse>> showMileage(@ApiParam(value = "tenant-id") @PathVariable("id") Long userId) {
        try {
            List<MileageResponse> response = mileageService.showMileage(userId);
            return OK(response);
        }
        catch (NotFoundException e) {
            return ERROR("해당 회원이 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        }
    }

}
