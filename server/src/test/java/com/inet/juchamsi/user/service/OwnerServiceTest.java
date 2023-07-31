package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.OwnerService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.*;
import com.inet.juchamsi.domain.user.dto.response.OwnerResponse;
import com.inet.juchamsi.domain.user.dto.response.TenantRequestResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import org.assertj.core.api.Assertions;
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

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class OwnerServiceTest {

    @Autowired
    OwnerService ownerService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    VillaRepository villaRepository;
    @Autowired
    PasswordEncoder passwordEncoder;


    @Test
    @DisplayName("회원 전체 조회")
    void showUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        compareUser(targetVilla);
        
        // when
        List<OwnerResponse> responseList = ownerService.showUser();
        
        // then
        System.out.println("responseList = " + responseList);
        assertNotNull(responseList);
    }
    
    @Test
    @DisplayName("회원 상세 조회")
    void showDetailUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String loginId = "ownerId";

        // when
        OwnerResponse response = ownerService.showDetailUser(loginId);

        // then
        System.out.println("response = " + response);
        assertThat(response.getPhoneNumber()).isEqualTo(targetUser.getPhoneNumber());

    }

    @Test
    @DisplayName("회원 가입#아이디 중복")
    void createUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        CreateOwnerRequest dto = CreateOwnerRequest.builder()
                .loginId("ownerId")
                .build();

        // then
        assertThatThrownBy(() -> ownerService.createUser(dto))
                .isInstanceOf(AlreadyExistException.class);
    }


    @Test
    @DisplayName("집주인 로그인 ## 로그인 성공")
    void loginUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        LoginRequest request = LoginRequest.builder()
                .loginId("ownerId")
                .loginPassword("userPw123!")
                .build();


        // then
        assertNotNull(ownerService.loginUser(request));
    }

    @Test
    @DisplayName("집주인 로그인 ## 로그인 실패")
    void loginUserFail() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        LoginRequest request = LoginRequest.builder()
                .loginId("ownerId")
                .loginPassword("userPw")
                .build();


        // then
        Assertions.assertThatThrownBy(() -> ownerService.loginUser(request))
                .isInstanceOf(BadCredentialsException.class);
    }


    @Test
    @DisplayName("집주인 회원정보 수정 ## 핸드폰 번호 수정")
    void modifyUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        ModifyOwnerRequest request = ModifyOwnerRequest.builder()
                .loginId("ownerId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .build();
        ownerService.modifyUser(request);

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("ownerId").get());
        assertThat(userRepository.findByLoginId("ownerId").get().getPhoneNumber()).isEqualTo("01098765432");
    }

    @Test
    @DisplayName("집주인 회원정보 수정 ## 없는 사용자일 때")
    void modifyUserNoPresent() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        ModifyOwnerRequest request = ModifyOwnerRequest.builder()
                .loginId("leeAdmin")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .build();

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("ownerId").get());
        assertThatThrownBy(() -> ownerService.modifyUser(request))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("집주인 회원정보 수정 ## 핸드폰 번호가 중복일 때")
    void modifyUserDuplicatedPhoneNumber() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        User secondUser = compareUser(targetVilla);

        // when
        ModifyOwnerRequest request = ModifyOwnerRequest.builder()
                .loginId("ownerId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .build();

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("ownerId").get());
        assertThatThrownBy(() -> ownerService.modifyUser(request))
                .isInstanceOf(AlreadyExistException.class);
    }

    @Test
    @DisplayName("집주인 회원정보 수정 ## 없는 빌라일 때")
    void modifyUserNoPresentVilla() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        ModifyOwnerRequest request = ModifyOwnerRequest.builder()
                .loginId("ownerId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012345678")
                .build();

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("ownerId").get());
        AssertionsForClassTypes.assertThatThrownBy(() -> ownerService.modifyUser(request))
                .isInstanceOf(NotFoundException.class);
    }


    @Test
    @DisplayName("세입자 신규 회원가입 요청 목록")
    void showNewRequestTenant() {
        // given
        Villa targetVilla = insertVilla();
        User ownerUser = insertUser(targetVilla);
        User tenantUser = insertTenantUser(targetVilla);
        Long villaId = targetVilla.getId();

        // when
        List<TenantRequestResponse> tenantResponseList = ownerService.showNewRequestTenant(villaId);

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
        Approve approve = Approve.APPROVE;
        ownerService.manageApprove(tenantId, approve);

        // then
        assertThat(userRepository.findByLoginId(tenantId).get().getApprove()).isEqualTo(Approve.APPROVE);
    }

    @Test
    @DisplayName("집주인 탈퇴")
    void removeUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        String ownerId = "ownerId";
        ownerService.removeUser(ownerId);

        // then
        assertThat(userRepository.findByLoginId(ownerId).get().getActive()).isEqualTo(Active.DISABLED);
    }


    private User insertUser(Villa villa) {
        User user = User.builder()
                .villa(villa)
                .loginId("ownerId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012341234")
                .name("김주참")
                .grade(Grade.OWNER)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .carNumber("12가 1234")
                .villaNumber(201)
                .roles(Collections.singletonList("OWNER"))
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
                .loginId("leeOwner")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .name("이주참")
                .grade(Grade.OWNER)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .carNumber("98나 1234")
                .villaNumber(101)
                .roles(Collections.singletonList("OWNER"))
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
