package com.inet.juchamsi.user.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.user.api.AdminApiController;
import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
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
    PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        userRepository.save(User.builder()
                .loginId("adminid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012341234")
                .name("김주참")
                .grade(Grade.ADMIN)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
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
    @DisplayName("회원 가입 api#아이디중복")
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
//                .andExpect(
//                        // assert로 예외를 검사하는 람다 사용
//                        MockMvcResultMatchers.jsonPath("$.response.success").value(false)
////                        (rslt) -> assertTrue(rslt.getResolvedException().getClass().isAssignableFrom(DuplicateException.class))
//                )
                .andReturn();
    }
}
