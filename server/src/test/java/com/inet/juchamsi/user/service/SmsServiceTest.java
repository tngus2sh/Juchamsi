package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.SmsService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.MessageRequest;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.error.NotFoundException;
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
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@SpringBootTest
@Transactional
public class SmsServiceTest {

    @Autowired
    SmsService smsService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    VillaRepository villaRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    public void setUp() {
        Villa villa = Villa.builder()
                .name("삼성 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .idNumber("62218271")
                .totalCount(6)
                .active(ACTIVE)
                .build();
        villaRepository.save(villa);
        User user = User.builder()
                .villa(villa)
                .phoneNumber("본인번호입력")
                .loginId("userId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .name("김주참")
                .grade(USER)
                .carNumber("12가 1234")
                .approve(WAIT)
                .active(ACTIVE)
                .roles(Collections.singletonList("USER"))
                .build();
        userRepository.save(user);
    }

    @Test
    @DisplayName("핸드폰 본인인증")
    void sendSmsToCheckUser() throws Exception{
        // given
        setUp();
        MessageRequest request = MessageRequest.builder()
                .name("김주참")
                .to("본인번호입력")
                .build();

        // when
        smsService.sendSmsToCheckUser(request);

        // then
    }

    @Test
    @DisplayName("핸드폰 본인인증 ## 존재하지 않는 회원")
    void sendSmsToCheckUserNoPresent() {
        // given
        setUp();
        MessageRequest request = MessageRequest.builder()
                .name("김주참")
                .to("01012341234")
                .build();

        // when
        // then
        assertThatThrownBy(() -> smsService.sendSmsToCheckUser(request))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("임시 비밀번호 발급")
    void sendSmsToFindPassword() throws Exception {
        // given
        setUp();
        MessageRequest request = MessageRequest.builder()
                .name("김주참")
                .to("본인번호입력")
                .build();

        // when
        smsService.sendSmsToFindPassword(request);

        // then
    }

    @Test
    @DisplayName("임시 비밀번호 발급 ## 존재하지 않는 회원")
    void sendSmsToFindPasswordNoPresent() {
        // given
        setUp();
        MessageRequest request = MessageRequest.builder()
                .name("김주참")
                .to("01012341234")
                .build();

        // when
        // then
        assertThatThrownBy(() -> smsService.sendSmsToFindPassword(request))
                .isInstanceOf(NotFoundException.class);
    }
}
