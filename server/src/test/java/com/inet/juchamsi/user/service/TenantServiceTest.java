package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.TenantService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.request.ModifyTenantRequest;
import com.inet.juchamsi.domain.user.dto.response.OwnerResponse;
import com.inet.juchamsi.domain.user.dto.response.TenantRequestResponse;
import com.inet.juchamsi.domain.user.dto.response.TenantResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import org.assertj.core.api.AssertionsForClassTypes;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.inet.juchamsi.domain.user.entity.Approve.APPROVE;
import static com.inet.juchamsi.domain.user.entity.Approve.WAIT;
import static com.inet.juchamsi.domain.user.entity.Grade.USER;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;


@SpringBootTest
@Transactional
public class TenantServiceTest {

    @Autowired
    TenantService tenantService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    VillaRepository villaRepository;
    @Autowired
    PasswordEncoder passwordEncoder;


    @Test
    @DisplayName("세입자 회원가입")
    void createUser() {
        // given
        Villa targetVilla = insertVilla();
        String villaIdNumber = targetVilla.getIdNumber();
        CreateTenantRequest request = CreateTenantRequest.builder()
                .villaIdNumber(villaIdNumber)
                .phoneNumber("01012345678")
                .loginId("userId")
                .loginPassword("userPw123!")
                .name("김주참")
                .carNumber("12가 1234")
                .villaNumber(101)
                .build();

        // when
        Long userId = tenantService.createUser(request);

        // then
        Optional<User> findUser = userRepository.findById(userId);
        assertThat(findUser).isPresent();
    }

    @Test
    @DisplayName("세입자 로그인 ## 로그인 성공")
    void loginUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        LoginRequest request = LoginRequest.builder()
                .loginId("userId")
                .loginPassword("userPw123!")
                .build();

        // then
        assertNotNull(tenantService.loginUser(request));
    }

    @Test
    @DisplayName("세입자 로그인 ## 로그인 실패")
    void loginUserFail() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        LoginRequest request = LoginRequest.builder()
                .loginId("userId")
                .loginPassword("use23!")
                .build();

        // then
        assertThatThrownBy(() -> tenantService.loginUser(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    @DisplayName("회원 상세 조회")
    void showDetailUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String loginId = "userId";

        // when
        TenantResponse response = tenantService.showDetailUser(loginId);

        // then
        System.out.println("response = " + response);
        assertThat(response.getPhoneNumber()).isEqualTo(targetUser.getPhoneNumber());
    }

    @Test
    @DisplayName("빌라 내 승인된 세입자 전체 조회")
    void showUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        compareUser(targetVilla);
        Long villaId = targetVilla.getId();

        // when
        List<TenantResponse> responseList = tenantService.showApproveTenant(villaId, APPROVE);

        // then
        System.out.println("responseList = " + responseList);
        assertNotNull(responseList);
    }

    @Test
    @DisplayName("빌라 내 신규 회원가입 한 세입자 전체 조회")
    void showNewRequestTenant() {
        // given
        Villa targetVilla = insertVilla();
        User ownerUser = insertUser(targetVilla);
        User tenantUser = insertTenantUser(targetVilla);
        Long villaId = targetVilla.getId();

        // when
        List<TenantResponse> tenantResponseList = tenantService.showApproveTenant(villaId, WAIT);

        // then
        assertNotNull(tenantResponseList);
    }

    @Test
    @DisplayName("세입자 승인상태 수정")
    void manageApprove() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        tenantUser();

        // when
        String tenantId = "tenantId";
        Approve approve = APPROVE;
        tenantService.manageApprove(tenantId, approve);

        // then
        assertThat(userRepository.findByLoginId(tenantId).get().getApprove()).isEqualTo(APPROVE);
    }

    @Test
    @DisplayName("세입자 회원정보 수정 ## 핸드폰 번호 수정")
    void modifyUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        ModifyTenantRequest request = ModifyTenantRequest.builder()
                .villaIdNumber("62218271")
                .loginId("userId")
                .phoneNumber("01098765432")
                .carNumber("12가 1234")
                .villaNumber(201)
                .build();
        tenantService.modifyUser(request);

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("userId").get());
        assertThat(userRepository.findByLoginId("userId").get().getPhoneNumber()).isEqualTo("01098765432");
    }

    @Test
    @DisplayName("세입자 회원정보 수정 ## 없는 사용자일 때")
    void modifyUserNoPresent() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        ModifyTenantRequest request = ModifyTenantRequest.builder()
                .villaIdNumber("62218271")
                .loginId("leeUser")
                .phoneNumber("01098765432")
                .carNumber("12가 1234")
                .villaNumber(201)
                .build();

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("userId").get());
        AssertionsForClassTypes.assertThatThrownBy(() -> tenantService.modifyUser(request))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("세입자 회원정보 수정 ## 핸드폰 번호가 중복일 때")
    void modifyUserDuplicatedPhoneNumber() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        User secondUser = compareUser(targetVilla);

        // when
        ModifyTenantRequest request = ModifyTenantRequest.builder()
                .villaIdNumber("62218271")
                .loginId("userId")
                .phoneNumber("01098765432")
                .carNumber("12가 1234")
                .villaNumber(201)
                .build();

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("userId").get());
        AssertionsForClassTypes.assertThatThrownBy(() -> tenantService.modifyUser(request))
                .isInstanceOf(AlreadyExistException.class);
    }

    @Test
    @DisplayName("세입자 회원정보 수정 ## 없는 빌라일 때")
    void modifyUserNoPresentVilla() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        ModifyTenantRequest request = ModifyTenantRequest.builder()
                .villaIdNumber("6220-271")
                .loginId("userId")
                .phoneNumber("01012345678")
                .carNumber("12가 1234")
                .villaNumber(201)
                .build();

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("userId").get());
        AssertionsForClassTypes.assertThatThrownBy(() -> tenantService.modifyUser(request))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("세입자 탈퇴")
    void removeUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        String userId = "userId";
        tenantService.removeUser(userId);

        // then
        assertThat(userRepository.findByLoginId(userId).get().getActive()).isEqualTo(Active.DISABLED);
    }


    private User insertUser(Villa villa) {
        User user = User.builder()
                .villa(villa)
                .phoneNumber("01012345678")
                .loginId("userId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .name("김주참")
                .grade(USER)
                .carNumber("12가 1234")
                .approve(WAIT)
                .active(ACTIVE)
                .roles(Collections.singletonList("USER"))
                .build();

        return userRepository.save(user);
    }

    private Villa insertVilla() {
        Villa villa = Villa.builder()
                .name("삼성 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .idNumber("62218271")
                .totalCount(6)
                .active(ACTIVE)
                .build();
        return villaRepository.save(villa);
    }

    private User compareUser(Villa villa) {
        User user = User.builder()
                .villa(villa)
                .loginId("leeUser")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .name("이주참")
                .grade(Grade.USER)
                .approve(APPROVE)
                .active(Active.ACTIVE)
                .carNumber("98나 1234")
                .villaNumber(101)
                .roles(Collections.singletonList("USER"))
                .build();
        return userRepository.save(user);
    }

    private User insertTenantUser(Villa villa) {
        User user = User.builder()
                .villa(villa)
                .loginId("tenantId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01099998888")
                .name("최입자")
                .grade(Grade.USER)
                .approve(Approve.WAIT)
                .active(Active.ACTIVE)
                .roles(Collections.singletonList("USER"))
                .build();
        return userRepository.save(user);
    }

    private User tenantUser() {
        Villa villa = Villa.builder()
                .name("삼성 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .idNumber("62218271")
                .totalCount(6)
                .active(ACTIVE)
                .build();
        villaRepository.save(villa);
        return userRepository.save(User.builder()
                .villa(villa)
                .loginId("tenantId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01099998888")
                .name("최입자")
                .grade(Grade.USER)
                .approve(Approve.WAIT)
                .active(Active.ACTIVE)
                .roles(Collections.singletonList("USER"))
                .build());
    }
}