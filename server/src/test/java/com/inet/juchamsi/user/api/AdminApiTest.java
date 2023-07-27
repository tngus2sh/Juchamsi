package com.inet.juchamsi.user.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.user.api.AdminApiController;
import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginTenantRequest;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
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
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("AdminApiController 테스트")
public class AdminApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    AdminApiController adminApiController;

    @Autowired
    AdminService adminService;

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
        userRepository.save(User.builder()
                .villa(villa)
                .loginId("adminid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012341234")
                .name("김주참")
                .grade(Grade.ADMIN)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .roles(Collections.singletonList("ADMIN"))
                .build());


    }

    @Test
    @DisplayName("회원 상세 조회 api")
    void showDetailUser() throws Exception {
        // given
        String loginId = "adminid";

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/admin/{id}", loginId));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.response.phoneNumber").exists())
                .andExpect(jsonPath("$.response.phoneNumber").value("01012341234"))
                .andExpect(jsonPath("$.response.name").exists())
                .andExpect(jsonPath("$.response.name").value("김주참"));

    }

    @Test
    @DisplayName("회원 가입#아이디중복")
    void createUser() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("adminid")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/admin")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.sumccess").value(true))
                .andReturn();
    }

    @Test
    @DisplayName("관리자 회원가입 ## 아이디 중복")
    void duplicatedUserLoginId() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("adminid")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/admin")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("관리자 회원가입 ## 핸드폰 번호 중복")
    void duplicatedUserPhoneNumber() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("adminid")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/admin")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("관리자 로그인")
    @Transactional
    void loginUser() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("adminid")
                .loginPassword("userPw123!")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/admin/login")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("관리자 로그인 ## 회원 없음")
    void loginUserFailInvalidId() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("adminid22")
                .loginPassword("userPw123!")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/admin/login")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("관리자 로그인 ## 비밀번호 틀림")
    void loginUserFailWrongPassword() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("adminid")
                .loginPassword("userPw")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/admin/login")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }
}
