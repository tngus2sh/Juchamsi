package com.inet.juchamsi.domain.user.api;

import com.inet.juchamsi.domain.user.application.OwnerService;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginAdminOwnerRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.OwnerResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.global.api.ApiResult;
import com.inet.juchamsi.global.jwt.TokenInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequestMapping("/owner")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"집주인 계정"})
public class OwnerApiController {
    
    private final OwnerService ownerService;

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
        OwnerResponse ownerResponse = ownerService.showDetailUser(ownerId);
        return OK(ownerResponse);
    }

    // 회원가입
    @ApiOperation(value = "회원 가입", notes = "신규 집주인 회원을 생성합니다.")
    @PostMapping
    public ApiResult<Void> createUser(
            @ApiParam(value = "owner-dto")
            @RequestBody CreateOwnerRequest request
    ) {
        log.debug("CreateOwnerRequest={}", request);
        Long ownerId = ownerService.createUser(request);
        log.info("createUser owner={}", ownerId);
        return OK(null);
    }

    // 로그인
    @ApiOperation(value = "로그인", notes = "userId와 userPassword를 사용해 로그인한다.")
    @PostMapping("/login")
    public ApiResult<AdminOwnerLoginResponse> loginUser(
            @ApiParam(value = "owner-dto")
            @RequestBody LoginAdminOwnerRequest request
    ) {
        log.debug("LoginAdminOwnerRequest={}", request);
        String userId = request.getLoginId();
        String password = request.getPassword();
        AdminOwnerLoginResponse response = ownerService.login(userId, password);
        log.info("tokenInfo={}", response);
        return OK(response);
    }

    // 로그아웃
    @ApiOperation(value = "로그아웃", notes = "userId를 사용해서 로그아웃을 진행한다.")
    @GetMapping("/logout/{id}")
    public ApiResult<Void> logoutUser(
            @ApiParam(value = "owner-id")
            @PathVariable(value = "id") String ownerId
    ) {
        log.debug("ownerId={}", ownerId);
        ownerService.logout(ownerId);
        return OK(null);
    }
    
    // 회원 정보 수정
    @ApiOperation(value = "회원정보 수정", notes = "집주인의 정보를 수정합니다.")
    @PutMapping
    public ApiResult<Void> modifyUser(
            @ApiParam(value = "owner-dto")
            @RequestBody CreateOwnerRequest request
    ) {
        log.debug("CreateOwnerRequest={}", request);
        Long ownerId = ownerService.modifyUser(request);
        log.info("modifyUser owner={}", ownerId);
        return OK(null);
    }

    // 세입자 회원가입 요청 처리
    @ApiOperation(value = "세입자(tenant) 회원가입 요청 관리", notes = "세입자의 회원가입 승인 여부를 결정합니다.")
    @GetMapping("/{id}/{approve}")
    public ApiResult<Void> manageApprove(
            @ApiParam(value = "admin-id")
            @PathVariable(value = "id") String tenantId,
            @ApiParam(value = "approve-or-not")
            @PathVariable(value = "approve") String approve
    ) {
        log.debug("admin={}, approve={}", tenantId, approve);
        ownerService.manageApprove(tenantId, Approve.valueOf(approve));
        return OK(null);
    }

    // 회원 탈퇴
    @ApiOperation(value = "집주인 탈퇴", notes = "집주인이 회원 탈퇴를 합니다.")
    @DeleteMapping("/{id}")
    public ApiResult<Void> removeUser(
            @ApiParam(value = "owner-id")
            @PathVariable(value = "id") String ownerId
    ) {
        log.debug("ownerId={}", ownerId);
        ownerService.removeUser(ownerId);
        return OK(null);
    }
}
