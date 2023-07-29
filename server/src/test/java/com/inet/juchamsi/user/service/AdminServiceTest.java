package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.CreateAdminRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class AdminServiceTest {

    @Autowired
    AdminService adminService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VillaRepository villaRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("회원 상세 조회")
    void showDetailUser() {
        // given
        User targetUser = insertUser();
        String loginId = "adminid";

        // when
        AdminResponse response = adminService.showDetailUser(loginId);

        // then
        assertThat(response.getPhoneNumber()).isEqualTo(targetUser.getPhoneNumber());

    }

    @Test
    @DisplayName("회원 가입#아이디 중복")
    void createUser() {
        // given
        User targetUser = insertUser();

        // when
        CreateAdminRequest dto = CreateAdminRequest.builder()
                .loginId("adminid")
                .build();

        // then
        assertThatThrownBy(() -> adminService.createUser(dto))
                .isInstanceOf(AlreadyExistException.class);
    }


    @Test
    @DisplayName("관리자 로그인 ## 로그인 성공")
    void loginUser() {
        // given
        User targetUser = insertUser();

        // when
        LoginRequest request = LoginRequest.builder()
                .loginId("adminid")
                .loginPassword("userPw123!")
                .build();

        // then
        assertNotNull(adminService.loginUser(request));
    }

    @Test
    @DisplayName("관리자 로그인 ## 로그인 실패")
    void loginUserFail() {
        // given
        User targetUser = insertUser();

        // when
        LoginRequest request = LoginRequest.builder()
                .loginId("adminid")
                .loginPassword("userPw")
                .build();

        // then
        Assertions.assertThatThrownBy(() -> adminService.loginUser(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    @DisplayName("관리자 회원정보 수정 ## 핸드폰 번호 수정")
    void modifyUser() {
        // given
        User targetUser = insertUser();

        // when
        CreateAdminRequest request = CreateAdminRequest.builder()
                .loginId("adminid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .name("김주참")
                .grade(Grade.ADMIN.name())
                .build();
        adminService.modifyUser(request);

        // then
        assertThat(userRepository.findByLoginId("adminId").get().getPhoneNumber()).isEqualTo("01098765432");
    }

    @Test
    @DisplayName("관리자 회원정보 수정 ## 없는 사용자일 때")
    void modifyUserNoPresent() {
        // given
        User targetUser = insertUser();

        // when
        CreateAdminRequest request = CreateAdminRequest.builder()
                .loginId("leeAdmin")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .name("이주참")
                .grade(Grade.ADMIN.name())
                .build();

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("adminId").get());
        assertThatThrownBy(() -> adminService.modifyUser(request))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("관리자 회원정보 수정 ## 핸드폰 번호가 중복일 때")
    void modifyUserDuplicatedPhoneNumber() {
        // given
        User targetUser = insertUser();
        User secondUser = compareUser();

        // when
        CreateAdminRequest request = CreateAdminRequest.builder()
                .loginId("adminid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .name("김주참")
                .grade(Grade.ADMIN.name())
                .build();

        // then
        System.out.println("userRepository = " + userRepository.findByLoginId("adminId").get());
        assertThatThrownBy(() -> adminService.modifyUser(request))
                .isInstanceOf(AlreadyExistException.class);
    }

    @Test
    @DisplayName("집주인 승인상태 수정")
    void manageApprove() {
        // given
        insertUser();
        ownerUser();

        // when
        String ownerId = "ownerid";
        Approve approve = Approve.APPROVE;
        adminService.manageApprove(ownerId, approve);

        // then
        assertThat(userRepository.findByLoginId(ownerId).get().getApprove()).isEqualTo(Approve.APPROVE);
    }

    @Test
    @DisplayName("관리자 탈퇴")
    void removeUser() {
        // given
        insertUser();

        // when
        String adminId = "adminid";
        adminService.removeUser(adminId);

        // then
        assertThat(userRepository.findByLoginId(adminId).get().getActive()).isEqualTo(Active.DISABLED);
    }


    private User insertUser() {
        User user = User.builder()
                .loginId("adminid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012341234")
                .name("김주참")
                .grade(Grade.ADMIN)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .roles(Collections.singletonList("ADMIN"))
                .build();
        return userRepository.save(user);
    }

    private User compareUser() {
        User user = User.builder()
                .loginId("leeAdmin")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .name("이주참")
                .grade(Grade.ADMIN)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .roles(Collections.singletonList("ADMIN"))
                .build();
        return userRepository.save(user);
    }

    private User ownerUser() {
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
                .loginId("ownerid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01099998888")
                .name("박주인")
                .grade(Grade.OWNER)
                .approve(Approve.WAIT)
                .active(Active.ACTIVE)
                .roles(Collections.singletonList("ROLE_OWNER"))
                .build());
    }
}
