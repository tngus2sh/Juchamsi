package com.inet.juchamsi.domain.user.api;

import com.inet.juchamsi.domain.user.application.OwnerService;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.request.ModifyOwnerRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.OwnerResponse;
import com.inet.juchamsi.domain.user.dto.response.TenantRequestResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.villa.application.VillaService;
import com.inet.juchamsi.domain.villa.dto.request.CreateVillaRequest;
import com.inet.juchamsi.global.api.ApiResult;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.inet.juchamsi.global.api.ApiResult.ERROR;
import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequestMapping("/owner")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"집주인 계정"})
public class OwnerApiController {

    private final OwnerService ownerService;
    private final VillaService villaService;

    // 회원가입
    @ApiOperation(value = "집주인 회원 가입", notes = "신규 집주인 회원을 생성합니다.")
    @PostMapping
    public ApiResult<Void> createUser(
            @ApiParam(value = "owner-dto")
            @RequestBody CreateOwnerRequest request
    ) {
        log.debug("CreateOwnerRequest={}", request);
        try {
            Long ownerId = ownerService.createUser(request);
        }
        catch(AlreadyExistException e) {
            return ERROR("동일한 회원 정보가 존재합니다.", HttpStatus.CONFLICT);
        }
        catch(NotFoundException e) {
            return ERROR("해당하는 빌라가 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        }
        return OK(null);
    }

    // 회원 전체 조회
    @ApiOperation(value = "회원 전체 조회", notes = "집주인 권한의 모든 사용자들 목록을 조회한다")
    @GetMapping
    public ApiResult<List<OwnerResponse>> showUser() {
        List<OwnerResponse> ownerResponseList = ownerService.showUser();
        log.info("ownerResponseList={}", ownerResponseList);
        return OK(ownerResponseList);
    }

    // 회원 상세 조회
    @ApiOperation(value = "회원 상세 조회", notes = "ownerId에 해당하는 사용자의 상세 정보를 조회한다.")
    @GetMapping("/{id}")
    public ApiResult<OwnerResponse> showDetailUser(
            @ApiParam(value = "owner-id")
            @PathVariable(value = "id") String ownerId
    ) {
        log.debug("ownerId={}", ownerId);
        try {
            OwnerResponse ownerResponse = ownerService.showDetailUser(ownerId);
            return OK(ownerResponse);
        } catch (NotFoundException e) {
            return ERROR("해당 회원은 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        }
    }

    // 로그인
    @ApiOperation(value = "로그인", notes = "userId와 userPassword를 사용해 로그인한다.")
    @PostMapping("/login")
    public ApiResult<AdminOwnerLoginResponse> loginUser(
            @ApiParam(value = "owner-dto")
            @RequestBody LoginRequest request
    ) {
        log.debug("LoginRequest={}", request);
        try {
            AdminOwnerLoginResponse response = ownerService.loginUser(request);
            return OK(response);
        } catch (BadCredentialsException e) {
            return ERROR("아이디 또는 비밀번호를 잘못 입력했습니다", HttpStatus.UNAUTHORIZED);
        }
    }

    // 로그아웃
    @ApiOperation(value = "로그아웃", notes = "userId를 사용해서 로그아웃을 진행한다.")
    @GetMapping("/logout/{id}")
    public ApiResult<Void> logoutUser(
            @ApiParam(value = "owner-id")
            @PathVariable(value = "id") String ownerId
    ) {
        log.debug("ownerId={}", ownerId);
        try {
            ownerService.logoutUser(ownerId);
            return OK(null);
        } catch (NotFoundException e) {
            return ERROR("해당 회원을 찾을 수가 없습니다.", HttpStatus.NO_CONTENT);
        }
    }

    // 회원 정보 수정
    @ApiOperation(value = "회원정보 수정", notes = "집주인의 정보를 수정합니다.")
    @PutMapping
    public ApiResult<Void> modifyUser(
            @ApiParam(value = "owner-dto")
            @RequestBody ModifyOwnerRequest request
    ) {
        log.debug("CreateOwnerRequest={}", request);
        try {
            ownerService.modifyUser(request);
            return OK(null);
        } catch (NotFoundException e) {
            return ERROR("해당 회원을 찾을 수가 없습니다", HttpStatus.NO_CONTENT);
        } catch (AlreadyExistException e) {
            return ERROR("이미 존재하는 핸드폰 번호입니다.", HttpStatus.CONFLICT);
        }
    }

    // 회원 탈퇴
    @ApiOperation(value = "집주인 탈퇴", notes = "집주인이 회원 탈퇴를 합니다.")
    @DeleteMapping("/{id}")
    public ApiResult<Void> removeUser(
            @ApiParam(value = "owner-id")
            @PathVariable(value = "id") String ownerId
    ) {
        log.debug("ownerId={}", ownerId);
        try {
            ownerService.removeUser(ownerId);
            return OK(null);
        } catch (NotFoundException e) {
            return ERROR("해당 회원을 찾을 수가 없습니다.", HttpStatus.NO_CONTENT);
        }
    }
}
