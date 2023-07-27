package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.TenantService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginTenantRequest;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.jwt.TokenInfo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

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


    @Test
    @DisplayName("세입자 회원가입")
    void createUser() {
        // given
        Villa targetVilla = insertVilla();
        String villaIdNumber = targetVilla.getIdNumber();
        CreateTenantRequest request = CreateTenantRequest.builder()
                .villaIdNumber(villaIdNumber)
                .phoneNumber("01012345678")
                .loginId("userid")
                .loginPassword("juchamsi1234!")
                .name("주참시")
                .carNumber("1가1234")
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
        LoginTenantRequest request = LoginTenantRequest.builder()
                .loginId("userid")
                .loginPassword("juchamsi1234!")
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
        LoginTenantRequest request = LoginTenantRequest.builder()
                .loginId("userid")
                .loginPassword("juchamsi1234")
                .build();

        // then
        assertThatThrownBy(() -> tenantService.loginUser(request))
                .isInstanceOf(BadCredentialsException.class);
    }


    private User insertUser(Villa villa) {
        User user = User.builder()
                .villa(villa)
                .phoneNumber("01012345678")
                .loginId("userid")
                .loginPassword("juchamsi1234!")
                .name("주참시")
                .grade(USER)
                .carNumber("1가1234")
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
}