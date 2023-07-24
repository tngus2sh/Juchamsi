package com.inet.juchamsi.domain.user.api;

import com.inet.juchamsi.domain.user.api.request.LoginAdminRequest;
import com.inet.juchamsi.domain.user.api.request.SignupAdminRequest;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"관리자 계정"})
public class AdminApiController {

    // 회원 상세 조회
//    @ApiOperation(value = "회원 상세 조회", notes = "관리자 회원의 회원 정보 상세 조회를 합니다.")
//    @GetMapping("/{id}")
//    public ApiResult<AdminDto> showDetailUser(
//            @ApiParam(value = "id", required = true)
//            @PathVariable(value = "id") String adminId
//            ) {
//        return null;
//    }

    // 회원가입
    @ApiOperation(value = "회원가입", notes = "신규 관리자를 생성합니다.")
    @PostMapping
    public ApiResult<Void> createUser(
            @ApiParam(value = "admin-dto", required = true)
            @RequestBody SignupAdminRequest request) {
        return null;
    }

    // 로그인
    @ApiOperation(value = "로그인", notes = "userId와 userPassword를 사용해서 로그인을 합니다.")
    @GetMapping
    public ApiResult<Void> loginUser(
            @ApiParam(value = "admin-dto")
            @RequestBody LoginAdminRequest request
    ) {
        return null;
    }

    // 로그아웃
    @ApiOperation(value = "로그아웃", notes = "userId를 사용해서 로그아웃을 합니다.")
    @GetMapping("/logout/{id}")
    public ApiResult<Void> logoutUser(
            @ApiParam(value = "admin-id", required = true)
            @PathVariable(value = "id") String adminId
    ) {
        return null;
    }

    // 회원정보 수정
    @ApiOperation(value = "회원정보 수정", notes = "관리자의 정보를 수정합니다.")
    @PutMapping
    public ApiResult<Void> modifyUser(
            @ApiParam(value = "admin-dto", required = true)
            @RequestBody SignupAdminRequest request
    ) {
        return null;
    }

    // 집주인 회원가입 요청 관리
    @ApiOperation(value = "집주인(owner) 회원가입 요청 관리", notes = "집주인의 회원가입 승인 여부를 결정합니다.")
    @GetMapping("/{id}/{approve}")
    public ApiResult<Void> manageApprove(
            @ApiParam(value = "admin", required = true)
            @PathVariable(value = "id") String ownerId
            ) {
        return null;
    } 
    
    // 탈퇴
    @ApiOperation(value = "관리자 탈퇴", notes = "관리자가 회원 탈퇴를 합니다")
    @DeleteMapping("/{id}")
    public ApiResult<Void> removeUser(
            @ApiParam(value = "admin-id", required = true)
            @PathVariable(value = "id") String adminId
            ) {
        return null;
    }
    
}
