package com.inet.juchamsi.domain.user.api;

import com.inet.juchamsi.domain.user.dto.request.LoginOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.SignupOwnerRequest;
import com.inet.juchamsi.domain.user.dto.response.OwnerDto;
import com.inet.juchamsi.domain.user.dto.response.OwnerDtoList;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"집주인 계정"})
public class OwnerApiController {

    // 회원 전체 조회
    @ApiOperation(value = "회원 전체 조회", notes = "집주인 권한의 모든 사용자들 목록을 조회한다")
    @GetMapping
    public ApiResult<OwnerDtoList> showUser() {
        return null;
    }

    // 회원 상세 조회
    @ApiOperation(value = "회원 상세 조회", notes = "ownerId에 해당하는 사용자의 상세 정보를 조회한다.")
    @GetMapping("/{id}")
    public ApiResult<OwnerDto> showDetailUser(
            @ApiParam(value = "owner-id")
            @PathVariable(value = "id") String ownerId
    ) {
        return null;
    }

    // 회원가입
    @ApiOperation(value = "회원 가입", notes = "신규 집주인 회원을 생성합니다.")
    @PostMapping
    public ApiResult<Void> createUser(
            @ApiParam(value = "owner-dto")
            @RequestBody SignupOwnerRequest request
    ) {
        return null;
    }

    // 로그인
    @ApiOperation(value = "로그인", notes = "userId와 userPassword를 사용해 로그인한다.")
    @PostMapping("/login")
    public ApiResult<Void> loginUser(
            @ApiParam(value = "owner-dto")
            @RequestBody LoginOwnerRequest request
    ) {
        return null;
    }

    // 로그아웃
    @ApiOperation(value = "로그아웃", notes = "userId를 사용해서 로그아웃을 진행한다.")
    @GetMapping("/logout/{id}")
    public ApiResult<Void> logoutUser(
            @ApiParam(value = "owner-id")
            @PathVariable(value = "id") String ownerId
    ) {
        return null;
    }

    // 회원 정보 수정
    @ApiOperation(value = "회원정보 수정", notes = "집주인의 정보를 수정합니다.")
    @PutMapping
    public ApiResult<Void> modifyUser(
            @ApiParam(value = "owner-dto")
            @RequestBody SignupOwnerRequest request
    ) {
        return null;
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
        return null;
    }

    // 회원 탈퇴
    @ApiOperation(value = "집주인 탈퇴", notes = "집주인이 회원 탈퇴를 합니다.")
    @DeleteMapping("/{id}")
    public ApiResult<Void> removeUser(
            @ApiParam(value = "owner-id")
            @PathVariable(value = "id") String ownerId
    ) {
        return null;
    }
}
