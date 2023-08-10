package com.inet.juchamsi.domain.token.api;


import com.inet.juchamsi.domain.token.application.TokenService;
import com.inet.juchamsi.domain.token.dto.SaveTokenRequest;
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
@RequestMapping("/token")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"토큰"})
public class TokenApiController {

    private final TokenService tokenService;

    @ApiOperation(value = "토큰 저장", notes = "사용자 기기에서 발급된 FCM 토큰을 저장할 수 있습니다.")
    @PostMapping("")
    public ApiResult<Void> saveToken(@ApiParam(value = "login-id, fcm-token") @RequestBody SaveTokenRequest request) {
        log.debug("SaveTokenrequest={}", request);

        try {
            Long tokenId = tokenService.saveToken(request);
        }
        catch(NotFoundException e) {
            return ERROR("해당하는 회원이 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        }
        return OK(null);
    }
}
