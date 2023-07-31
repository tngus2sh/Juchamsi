package com.inet.juchamsi.user.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.user.api.SmsApiController;
import com.inet.juchamsi.domain.user.application.SmsService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CheckUserRequest;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

import static com.inet.juchamsi.domain.user.entity.Approve.WAIT;
import static com.inet.juchamsi.domain.user.entity.Grade.USER;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("SmsApiController 테스트")
public class SmsApiTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private SmsApiController smsApiController;
    @Autowired
    SmsService smsService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    VillaRepository villaRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @BeforeEach
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
                .phoneNumber("본인 번호 입력")
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
    @DisplayName("핸드폰 인증번호 발송")
    void sendSmsToCheckUser() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CheckUserRequest.builder()
                .name("김주참")
                .phoneNumber("본인 번호 입력")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/sms")
                        .content(object)
                        .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("핸드폰 인증번호 발송 ## 존재하지 않는 회원")
    void sendSmsToCheckUserNoPresent() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CheckUserRequest.builder()
                .name("박주참")
                .phoneNumber("01012341234")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/sms")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("임시 비밀번호 발급")
    void sendSmsToFindPassword() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CheckUserRequest.builder()
                .name("김주참")
                .phoneNumber("본인 번호 입력")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/sms")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("임시 비밀번호 발급 ## 존재하지 않는 회원")
    void sendSmsToFindPasswordNoPresent() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CheckUserRequest.builder()
                .name("박주참")
                .phoneNumber("01012341234")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/sms")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }
}
