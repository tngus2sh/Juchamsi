package com.inet.juchamsi.user.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.user.api.TenantApiController;
import com.inet.juchamsi.domain.user.application.TenantService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.request.ModifyTenantRequest;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
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
import java.util.Optional;

import static com.inet.juchamsi.domain.user.entity.Approve.WAIT;
import static com.inet.juchamsi.domain.user.entity.Grade.USER;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    VillaRepository villaRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Test
    @DisplayName("세입자 회원가입")
    void createUser() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        String villaIdNumber = targetVilla.getIdNumber();
        String object = objectMapper.writeValueAsString(CreateTenantRequest.builder()
                .villaIdNumber(villaIdNumber)
                .phoneNumber("01012345678")
                .loginId("userId")
                .loginPassword("userPw123!")
                .name("김주참")
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
    void duplicatedUserLoginId() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String loginId = targetUser.getLoginId();

        String object = objectMapper.writeValueAsString(CreateTenantRequest.builder()
                .villaIdNumber("123456")
                .phoneNumber("01012345678")
                .loginId(loginId)
                .loginPassword("userPw123!")
                .name("김주참")
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
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("세입자 회원가입 ## 핸드폰 번호 중복")
    void duplicatedUserPhoneNumber() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String phoneNumber = targetUser.getPhoneNumber();

        String object = objectMapper.writeValueAsString(CreateTenantRequest.builder()
                .villaIdNumber("123456")
                .phoneNumber(phoneNumber)
                .loginId("user11")
                .loginPassword("userPw123!")
                .name("김주참")
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
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("세입자 로그인")
    @Transactional
    void loginUser() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String object = objectMapper.writeValueAsString(LoginRequest.builder()
                .loginId("userId")
                .loginPassword("userPw123!")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/tenant/login")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("세입자 로그인 ## 회원 없음")
    void loginUserFailInvalidId() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String object = objectMapper.writeValueAsString(LoginRequest.builder()
                .loginId("userid11")
                .loginPassword("userPw123!")
                .build());
        Optional<User> findUser = userRepository.findById(targetUser.getId());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/tenant/login")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("세입자 로그인 ## 비밀번호 틀림")
    void loginUserFailWrongPassword() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String object = objectMapper.writeValueAsString(LoginRequest.builder()
                .loginId("userId")
                .loginPassword("userPw")
                .build());
        Optional<User> findUser = userRepository.findById(targetUser.getId());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/tenant/login")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("세입자 로그아웃")
    void  logoutUser() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String ownerId = "userId";

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/tenant/logout/{id}", ownerId)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("회원 전체 조회")
    void showUser() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        compareUser();

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/tenant"));

        // then
        actions.andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

    }

    @Test
    @DisplayName("회원 상세 조회")
    void showDetailUser() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String loginId = "userId";

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/tenant/{id}", loginId));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.response.phoneNumber").exists())
                .andExpect(jsonPath("$.response.phoneNumber").value("01012345678"))
                .andExpect(jsonPath("$.response.name").exists())
                .andExpect(jsonPath("$.response.name").value("김주참"));

    }

    @Test
    @DisplayName("세입자  회원정보 수정")
    void modifyUser() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String object  = objectMapper.writeValueAsString(ModifyTenantRequest.builder()
                .villaIdNumber("62218271")
                .phoneNumber("01099998888")
                .loginId("userId")
                .carNumber("12가 1234")
                .villaNumber(201)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.put("/tenant")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("세입자 회원정보 수정 ## 해당 회원이 없을 때")
    void modifyUserNoPresent() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String object  = objectMapper.writeValueAsString(ModifyTenantRequest.builder()
                .villaIdNumber("62218271")
                .phoneNumber("01099998888")
                .loginId("userIdaaaa")
                .carNumber("12가 1234")
                .villaNumber(201)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.put("/tenant")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message").value("해당 회원을 찾을 수가 없습니다"));
    }

    @Test
    @DisplayName("세입자 회원정보 수정 ## 핸드폰 중복")
    void modifyUserDuplicatedPhoneNumber() throws  Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        compareUser();
        String object  = objectMapper.writeValueAsString(ModifyTenantRequest.builder()
                .villaIdNumber("62218271")
                .phoneNumber("01098765432")
                .loginId("userId")
                .carNumber("12가 1234")
                .villaNumber(201)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.put("/tenant")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message").value("이미 존재하는 핸드폰 번호입니다."));
    }

    @Test
    @DisplayName("세입자 회원정보 수정 ## 해당 빌라 없을 때")
    void modifyUserNoPresentVilla() throws  Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String object  = objectMapper.writeValueAsString(ModifyTenantRequest.builder()
                .villaIdNumber("623-8271")
                .phoneNumber("01099998888")
                .loginId("userId")
                .carNumber("12가 1234")
                .villaNumber(201)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.put("/tenant")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message").value("해당 회원을 찾을 수가 없습니다"));
    }

    @Test
    @DisplayName("관리자 탈퇴")
    void removeUser() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser(targetVilla);
        String userId = "userId";

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.delete("/tenant/{id}", userId));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }

    private User insertUser(Villa villa) {
        User user = User.builder()
                .villa(villa)
                .phoneNumber("01012345678")
                .loginId("userId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .name("김주참")
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

    private void compareUser() {
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
                .loginId("leeTenant")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .name("이주참")
                .grade(USER)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .carNumber("98나 1234")
                .villaNumber(101)
                .roles(Collections.singletonList("USER"))
                .build();
        userRepository.save(user);
    }
}