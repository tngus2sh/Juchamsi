package com.inet.juchamsi.user.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.user.api.TenantApiController;
import com.inet.juchamsi.domain.user.application.TenantService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
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

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("TenantApiController 테스트")
public class TenantApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TenantApiController tenantApiController;

    @Autowired
    TenantService tenantService;

    @Autowired
    VillaRepository villaRepository;

    @Autowired
    UserRepository userRepository;


    @Test
    @DisplayName("세입자 회원가입")
    void createUser() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        String villaIdNumber = targetVilla.getIdNumber();
        String object = objectMapper.writeValueAsString(CreateTenantRequest.builder()
                .villaIdNumber(villaIdNumber)
                .phoneNumber("01012345678")
                .loginId("userid")
                .password("juchamsi1234!")
                .name("주참시")
                .carNumber("1가1234")
                .villaNumber(101)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/tenant")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }


    @Test
    @DisplayName("세입자 회원가입 ## 아이디 중복")
    void duplicatedUser() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String loginId = targetUser.getLoginId();

        String object = objectMapper.writeValueAsString(CreateTenantRequest.builder()
                .villaIdNumber("123456")
                .phoneNumber("01012345678")
                .loginId(loginId)
                .password("juchamsi1234!")
                .name("주참시")
                .carNumber("1가1234")
                .villaNumber(101)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/tenant")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }


    private User insertUser(Villa villa) {
        User user = User.builder()
                .villa(villa)
                .phoneNumber("01012345678")
                .loginId("userid")
                .password("juchamsi1234!")
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