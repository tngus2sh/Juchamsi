package com.inet.juchamsi.token.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.token.application.TokenService;
import com.inet.juchamsi.domain.token.dto.SaveTokenRequest;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
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

import static com.inet.juchamsi.domain.user.entity.Approve.APPROVE;
import static com.inet.juchamsi.domain.user.entity.Grade.USER;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("TokenApiController 테스트")
public class TokenApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    TokenService tokenService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Test
    @DisplayName("토큰 등록")
    void ssveToken() throws Exception {
        // given
        User targetUser = insertUser();
        String FCMToken = "enVZRhGY3rfN8BhsUd0OR5:APA91bETGqKvYFwp01S2aSZTBm4ignS9aAaQmvfXFItzi2NiK4uVeO4qKcuh4LChlIVTd4ClxoSUK5O3vTdvWpUhIltqift0K6Y9bC9op29PWzuhf0bGnRHOoDBCF2rO5ufN0lkQiR-2";
        String object = objectMapper.writeValueAsString(SaveTokenRequest.builder()
                .loginId(targetUser.getLoginId())
                .fcmToken(FCMToken)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/token")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }


    private User insertUser() {
        User user = User.builder()
                .loginId("userid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012341234")
                .name("김주참")
                .totalMileage(5000)
                .grade(USER)
                .approve(APPROVE)
                .active(ACTIVE)
                .roles(Collections.singletonList("ADMIN"))
                .build();
        return userRepository.save(user);
    }
}
