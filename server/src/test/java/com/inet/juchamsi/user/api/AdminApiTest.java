package com.inet.juchamsi.user.api;

import com.inet.juchamsi.domain.user.api.AdminApiController;
import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.Active;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
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

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("AdminApiController 테스트")
public class AdminApiTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    AdminApiController adminApiController;

    @Autowired
    AdminService adminService;

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        userRepository.save(User.builder()
                .loginId("adminid")
                .password("userPw123!")
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
}
