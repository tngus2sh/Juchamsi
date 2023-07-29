package com.inet.juchamsi.domain.user.api;

import com.inet.juchamsi.domain.user.application.SmsService;
import com.inet.juchamsi.domain.user.dto.request.CheckUserRequest;
import com.inet.juchamsi.global.api.ApiResult;
import com.inet.juchamsi.global.error.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.inet.juchamsi.global.api.ApiResult.ERROR;
import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequestMapping("/sms")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"인증번호 보내기"})
public class SmsApiController {

    private final SmsService smsService;

    @ApiOperation(value = "회원가입시 본인인증 보내기", notes = "핸드폰으로 본인인증 번호를 보냅니다.")
    @PostMapping("/check")
    public ApiResult<String> sendSmsToCheckUser(
            @ApiParam(value = "check-user-dto")
            @RequestBody CheckUserRequest request) {
        log.debug("CheckUserRequest={}", request);
        try {
            String cerNum = smsService.sendSmsToCheckUser(request);
            return OK(cerNum);
        } catch (NotFoundException e) {
            return ERROR("회원이 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        }
    }

    @ApiOperation(value = "비밀번호 찾기", notes = "핸드폰으로 임시 비밀번호를 발급합니다.")
    @PostMapping("/password")
    public ApiResult<Void> sendSmsToFindPassword(
            @ApiParam(value = "check-user-dto")
            @RequestBody CheckUserRequest request) {
        log.debug("CheckUserRequest={}", request);
        try {
            smsService.sendSmsToFindPassword(request);
            return OK(null);
        } catch (NotFoundException e) {
            return ERROR("회원이 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        }
    }
}
