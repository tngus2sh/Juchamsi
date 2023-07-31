package com.inet.juchamsi.user.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.user.api.OwnerApiController;
import com.inet.juchamsi.domain.user.application.OwnerService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateAdminRequest;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.ModifyOwnerRequest;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("OwnerApiController 테스트")
public class OwnerApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    OwnerApiController ownerApiController;

    @Autowired
    OwnerService ownerService;

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
                .loginId("ownerId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012341234")
                .name("김주참")
                .grade(Grade.OWNER)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .carNumber("12가 1234")
                .villaNumber(201)
                .roles(Collections.singletonList("OWNER"))
                .build());

    }

    @Test
    @DisplayName("집주인 회원가입 ## 아이디 중복")
    void duplicatedUserLoginId() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("ownerId")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/owner")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("집주인 회원가입 ## 핸드폰 번호 중복")
    void duplicatedUserPhoneNumber() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("ownerId")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/owner")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("집주인 로그인")
    @Transactional
    void loginUser() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("ownerId")
                .loginPassword("userPw123!")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/owner/login")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("집주인 로그인 ## 회원 없음")
    void loginUserFailInvalidId() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("ownerId212")
                .loginPassword("userPw123!")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/owner/login")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("집주인 로그인 ## 비밀번호 틀림")
    void loginUserFailWrongPassword() throws Exception {
        // given
        String object = objectMapper.writeValueAsString(CreateOwnerRequest.builder()
                .loginId("ownerId")
                .loginPassword("userPw")
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.post("/owner/login")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("집주인 로그아웃")
    void  logoutUser() throws Exception {
        // given
        String ownerId = "ownerId";

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/owner/logout/{id}", ownerId)
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
        compareUser();

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/owner"));

        // then
        actions.andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("회원 상세 조회")
    void showDetailUser() throws Exception {
        // given
        String loginId = "ownerId";

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/owner/{id}", loginId));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.response.phoneNumber").exists())
                .andExpect(jsonPath("$.response.phoneNumber").value("01012341234"))
                .andExpect(jsonPath("$.response.name").exists())
                .andExpect(jsonPath("$.response.name").value("김주참"));

    }

    @Test
    @DisplayName("집주인  회원정보 수정")
    void modifyUser() throws Exception {
        // given
        String object  = objectMapper.writeValueAsString(ModifyOwnerRequest.builder()
                .villaIdNumber("62218271")
                .phoneNumber("01099998888")
                .loginId("ownerId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .name("김주참")
                .carNumber("12가 1234")
                .villaNumber(201)
                .grade(Grade.OWNER.name())
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.put("/owner")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("집주인 회원정보 수정 ## 해당 회원이 없을 때")
    void modifyUserNoPresent() throws Exception {
        // given
        String object  = objectMapper.writeValueAsString(ModifyOwnerRequest.builder()
                .villaIdNumber("62218271")
                .phoneNumber("01099998888")
                .loginId("ownerIdssss")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .name("박주참")
                .carNumber("12가 1234")
                .villaNumber(201)
                .grade(Grade.OWNER.name())
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.put("/owner")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message").value("해당 회원을 찾을 수가 없습니다"));
    }

    @Test
    @DisplayName("집주인 회원정보 수정 ## 핸드폰 중복")
    void modifyUserDuplicatedPhoneNumber() throws  Exception {
        // given
        compareUser();
        String object  = objectMapper.writeValueAsString(ModifyOwnerRequest.builder()
                .villaIdNumber("62218271")
                .phoneNumber("01098765432")
                .loginId("ownerId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .name("김주참")
                .grade(Grade.OWNER.name())
                .carNumber("12가 1234")
                .villaNumber(201)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.put("/owner")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message").value("이미 존재하는 핸드폰 번호입니다."));
    }

    @Test
    @DisplayName("집주인 회원정보 수정 ## 해당 빌라 없을 때")
    void modifyUserNoPresentVilla() throws  Exception {
        // given
        String object  = objectMapper.writeValueAsString(ModifyOwnerRequest.builder()
                .villaIdNumber("623-8271")
                .phoneNumber("01099998888")
                .loginId("ownerId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .name("김주참")
                .grade(Grade.OWNER.name())
                .carNumber("12가 1234")
                .villaNumber(201)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.put("/owner")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message").value("해당 회원을 찾을 수가 없습니다"));
    }

    @Test
    @DisplayName("세입자 회원가입 요청 처리")
    void manageApprove() throws Exception {
        // given
        tenantUser();
        String tenantId = "tenantId";
        String approve = Approve.APPROVE.name();

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/owner/{id}/{approve}", tenantId, approve));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("세입자 회원가입 요청 처리 ## 회원 존재하지 않을 때")
    void manageApproveNoPresent() throws Exception {
        // given
        String tenantId = "tenantId";
        String approve = Approve.APPROVE.name();

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/owner/{id}/{approve}", tenantId, approve));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("관리자 탈퇴")
    void removeUser() throws Exception {
        // given
        String ownerId = "ownerId";

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.delete("/owner/{id}", ownerId));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
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
                .loginId("leeOwner")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01098765432")
                .name("이주참")
                .grade(Grade.OWNER)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .carNumber("98나 1234")
                .villaNumber(101)
                .roles(Collections.singletonList("OWNER"))
                .build();
        userRepository.save(user);
    }

    private void tenantUser() {
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
                .loginId("tenantId")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01099998888")
                .name("최입자")
                .grade(Grade.USER)
                .approve(Approve.WAIT)
                .active(Active.ACTIVE)
                .roles(Collections.singletonList("USER"))
                .build());
    }
}
