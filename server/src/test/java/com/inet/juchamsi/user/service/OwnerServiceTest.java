package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.OwnerService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.dto.response.OwnerResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.error.AlreadyExistException;
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
    @DisplayName("회원 상세 조회")
    void showDetailUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String loginId = "ownerid";

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
                .loginId("ownerid")
                .build();

        // then
        assertThatThrownBy(() -> ownerService.createUser(dto))
                .isInstanceOf(AlreadyExistException.class);
    }


    @Test
    @DisplayName("관리자 로그인 ## 로그인 성공")
    void loginUser() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        String loginId = "ownerid";
        String password = "userPw123!";

        // then
        assertNotNull(ownerService.login(loginId, password));
    }

    @Test
    @DisplayName("관리자 로그인 ## 로그인 실패")
    void loginUserFail() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);

        // when
        String loginId = "ownerid";
        String password = "userPw";

        // then
        Assertions.assertThatThrownBy(() -> ownerService.login(loginId, password))
                .isInstanceOf(BadCredentialsException.class);
    }

    private User insertUser(Villa villa) {
        User user = User.builder()
                .villa(villa)
                .loginId("ownerid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012341234")
                .name("김주참")
                .grade(Grade.OWNER)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
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
}
