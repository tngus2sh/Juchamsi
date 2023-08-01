package com.inet.juchamsi.mileage.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.mileage.application.MileageService;
import com.inet.juchamsi.domain.mileage.dao.MileageRepository;
import com.inet.juchamsi.domain.mileage.entity.Mileage;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("MileageApiController 테스트")
public class MileageApiTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MileageService mileageService;
    @Autowired
    private MileageRepository mileageRepository;
    @Autowired
    private VillaRepository villaRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Test
    @DisplayName("마일리지 내역 조회")
    void showMileage() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser();
        Mileage targetMileage = insertMileage(targetUser);
        Long userId = targetUser.getId();

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/mileage/{id}", userId));

        // then
        actions.andDo(print());
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

    private User insertUser() {
        User user = User.builder()
                .loginId("adminid")
                .loginPassword(passwordEncoder.encode("userPw123!"))
                .phoneNumber("01012341234")
                .name("김주참")
                .grade(Grade.ADMIN)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .roles(Collections.singletonList("ADMIN"))
                .build();
        return userRepository.save(user);
    }

    private Mileage insertMileage(User user) {
        Mileage mileage = Mileage.builder()
                .user(user)
                .point(100)
                .type("적립")
                .build();
        return mileageRepository.save(mileage);
    }
}
