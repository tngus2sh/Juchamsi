package com.inet.juchamsi.domain.user.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.inet.juchamsi.domain.user.application.SmsService;
import com.inet.juchamsi.domain.user.dto.request.MessageRequest;
import com.inet.juchamsi.domain.user.dto.request.PasswordMessageRequest;
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

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import static com.inet.juchamsi.global.api.ApiResult.ERROR;
import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequestMapping("/api/sms")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"인증번호 보내기"})
public class SmsApiController {

    private final SmsService smsService;

    @ApiOperation(value = "회원가입시 본인인증 보내기", notes = "핸드폰으로 본인인증 번호를 보냅니다.")
    @PostMapping("/check")
    public ApiResult<String> sendSmsToCheckUser(
            @ApiParam(value = "check-user-dto")
            @RequestBody MessageRequest request) {
        log.debug("CheckUserRequest={}", request);
        try {
            String cerNum = smsService.sendSmsToCheckUser(request);
            return OK(cerNum);
        } catch (UnsupportedEncodingException e) {
            return ERROR("지원되지 않는 인코딩입니다.", HttpStatus.BAD_REQUEST);
        } catch (URISyntaxException e) {
            return ERROR("URI 오류입니다.", HttpStatus.BAD_REQUEST);
        } catch (NoSuchAlgorithmException e) {
            return ERROR("존재하지않는 알고리즘입니다.", HttpStatus.BAD_REQUEST);
        } catch (InvalidKeyException e) {
            return ERROR("유효하지 않은 key입니다.", HttpStatus.BAD_REQUEST);
        } catch (JsonProcessingException e) {
            return ERROR("JSON 오류입니다.", HttpStatus.BAD_REQUEST);
        }
    }

    @ApiOperation(value = "비밀번호 찾기", notes = "핸드폰으로 임시 비밀번호를 발급합니다.")
    @PostMapping("/password")
    public ApiResult<Void> sendSmsToFindPassword(
            @ApiParam(value = "check-user-dto")
            @RequestBody PasswordMessageRequest request) {
        log.debug("CheckUserRequest={}", request);
        try {
            smsService.sendSmsToFindPassword(request);
            return OK(null);
        } catch (NotFoundException e) {
            return ERROR("회원이 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        } catch (UnsupportedEncodingException e) {
            return ERROR("지원되지 않는 인코딩입니다.", HttpStatus.BAD_REQUEST);
        } catch (URISyntaxException e) {
            return ERROR("URI 오류입니다.", HttpStatus.BAD_REQUEST);
        } catch (NoSuchAlgorithmException e) {
            return ERROR("존재하지않는 알고리즘입니다.", HttpStatus.BAD_REQUEST);
        } catch (InvalidKeyException e) {
            return ERROR("유효하지 않은 key입니다.", HttpStatus.BAD_REQUEST);
        } catch (JsonProcessingException e) {
            return ERROR("JSON 오류입니다.", HttpStatus.BAD_REQUEST);
        }
    }
}
