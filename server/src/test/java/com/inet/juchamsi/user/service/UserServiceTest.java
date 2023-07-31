package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.UserService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

import static com.inet.juchamsi.domain.user.entity.Approve.WAIT;
import static com.inet.juchamsi.domain.user.entity.Grade.USER;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
@Transactional
public class UserServiceTest {

    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    VillaRepository villaRepository;
    @Autowired
    PasswordEncoder passwordEncoder;


    @Test
    @DisplayName("아이디 중복 체크")
    void checkId() {
        // given
        Villa targetVilla = insertVilla();
        String loginId = "userId";

        // when
        boolean result = userService.checkId(loginId);

        // then
        assertThat(result).isEqualTo(true);
    }

    @Test
    @DisplayName("아이디 중복 체크 ## 아이디 중복")
    void checkIdDuplicate() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String loginId = "userId";

        // when
        boolean result = userService.checkId(loginId);

        // then
        assertThat(result).isEqualTo(false);
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
}
