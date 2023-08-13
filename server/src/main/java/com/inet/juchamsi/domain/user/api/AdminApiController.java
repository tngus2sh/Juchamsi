package com.inet.juchamsi.domain.user.api;

import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.dto.request.CreateAdminRequest;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
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
import org.springframework.web.bind.annotation.*;

import static com.inet.juchamsi.global.api.ApiResult.ERROR;
import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequestMapping("/admin")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"관리자 계정"})
public class AdminApiController {

    private final AdminService adminService;

    // 회원가입
    @ApiOperation(value = "회원가입", notes = "신규 관리자를 생성합니다.")
    @PostMapping
    public ApiResult<Void> createUser(
            @ApiParam(value = "admin-dto")
            @RequestBody CreateAdminRequest request) {
        log.debug("CreateAdminRequest={}", request);
        try {
            Long adminId = adminService.createUser(request);
        }
        catch(AlreadyExistException e) {
            return ERROR("동일한 회원 정보가 존재합니다.", HttpStatus.CONFLICT);
        }
        catch(NotFoundException e) {
            return ERROR("해당하는 빌라가 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        }
        return OK(null);
    }

    // 회원 상세 조회
    @ApiOperation(value = "회원 상세 조회", notes = "관리자 회원의 회원 정보 상세 조회를 합니다.")
    @GetMapping("/{id}")
    public ApiResult<AdminResponse> showDetailUser(
            @ApiParam(value = "id")
            @PathVariable(value = "id") String adminId
    ) {
        log.debug("adminId={}", adminId);
        try {
            AdminResponse adminResponse = adminService.showDetailUser(adminId);
            return OK(adminResponse);
        } catch (NotFoundException e) {
            return ERROR("해당 회원은 존재하지 않습니다.", HttpStatus.NO_CONTENT);
        }
    }

    // 로그인
    @ApiOperation(value = "로그인", notes = "userId와 userPassword를 사용해서 로그인을 합니다.")
    @PostMapping("/login")
    public ApiResult<AdminOwnerLoginResponse> loginUser(
            @ApiParam(value = "admin-dto")
            @RequestBody LoginRequest request
    ) {
        log.debug("LoginRequest={}", request);
        try {
            AdminOwnerLoginResponse response = adminService.loginUser(request);
            return OK(response);
        } catch (NotFoundException e) {
            return ERROR("존재하지 않는 회원입니다.", HttpStatus.BAD_REQUEST);
        } catch (BadCredentialsException e) {
            return ERROR("아이디 또는 비밀번호를 잘못 입력했습니다", HttpStatus.UNAUTHORIZED);
        }
    }

    // 로그아웃
    @ApiOperation(value = "로그아웃", notes = "userId를 사용해서 로그아웃을 합니다.")
    @GetMapping("/logout/{id}")
    public ApiResult<Void> logoutUser(
            @ApiParam(value = "admin-id")
            @PathVariable(value = "id") String adminId
    ) {
        log.debug("adminId={}", adminId);
        try {
            adminService.logoutUser(adminId);
        } catch (NotFoundException e) {
            return ERROR("해당 회원을 찾을 수가 없습니다.", HttpStatus.NO_CONTENT);
        }
        return OK(null);
    }

    // 회원정보 수정
    @ApiOperation(value = "회원정보 수정", notes = "관리자의 정보를 수정합니다.")
    @PutMapping
    public ApiResult<Void> modifyUser(
            @ApiParam(value = "admin-dto")
            @RequestBody CreateAdminRequest request
    ) {
        log.debug("CreateAdminRequest={}", request);
        try {
            adminService.modifyUser(request);
        } catch (NotFoundException e) {
            return ERROR("해당 회원을 찾을 수가 없습니다", HttpStatus.NO_CONTENT);
        } catch (AlreadyExistException e) {
            return ERROR("이미 존재하는 핸드폰 번호입니다.", HttpStatus.CONFLICT);
        }
        return OK(null);
    }

    // 집주인 회원가입 요청 관리
    @ApiOperation(value = "집주인(owner) 회원가입 요청 관리", notes = "집주인의 회원가입 승인 여부를 결정합니다.")
    @GetMapping("/{id}/{approve}")
    public ApiResult<Void> manageApprove(
            @ApiParam(value = "admin")
            @PathVariable(value = "id") String ownerId,
            @ApiParam(value = "approve")
            @PathVariable(value = "approve") String approve
            ) {
        log.debug("admin={}, approve={}", ownerId, approve);
        try {
            adminService.manageApprove(ownerId, Approve.valueOf(approve));
        } catch (NotFoundException e) {
            return ERROR("해당 회원을 찾을 수가 없습니다.", HttpStatus.NO_CONTENT);
        }
        return OK(null);
    }

    // 탈퇴
    @ApiOperation(value = "관리자 탈퇴", notes = "관리자가 회원 탈퇴를 합니다")
    @DeleteMapping("/{id}")
    public ApiResult<Void> removeUser(
            @ApiParam(value = "admin-id")
            @PathVariable(value = "id") String adminId
            ) {
        log.debug("adminId={}", adminId);
        try {
            adminService.removeUser(adminId);
        } catch (NotFoundException e) {
            return ERROR("해당 회원을 찾을 수가 없습니다.", HttpStatus.NO_CONTENT);
        }
        return OK(null);
    }

}
