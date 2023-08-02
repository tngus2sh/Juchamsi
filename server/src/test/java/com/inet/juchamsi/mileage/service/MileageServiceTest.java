package com.inet.juchamsi.mileage.service;

import com.inet.juchamsi.domain.mileage.application.MileageService;
import com.inet.juchamsi.domain.mileage.dao.MileageRepository;
import com.inet.juchamsi.domain.mileage.dto.request.GetMileageRequest;
import com.inet.juchamsi.domain.mileage.dto.response.MileageResponse;
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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class MileageServiceTest {

    @Autowired
    MileageService mileageService;
    @Autowired
    MileageRepository mileageRepository;
    @Autowired
    VillaRepository villaRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepository userRepository;


    @Test
    @DisplayName("마일리지 등록 ## 적립")
    void getMileage() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser();
        Mileage targetMileage = insertMileage(targetUser);
        String loginId = targetUser.getLoginId();

        GetMileageRequest request = GetMileageRequest.builder()
                .loginId(loginId)
                .point(100)
                .type("적립")
                .description("출차 시간 등록 적립")
                .build();

        // when
        mileageService.createMileage(request);

        // then
        Optional<User> findUser = userRepository.findByLoginId(loginId);
        assertNotNull(findUser);
        System.out.println(findUser.get());
    }

    @Test
    @DisplayName("마일리지 등록 ## 사용")
    void useMileage() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser();
        Mileage targetMileage = insertMileage(targetUser);
        String loginId = targetUser.getLoginId();

        GetMileageRequest request = GetMileageRequest.builder()
                .loginId(loginId)
                .point(-3000)
                .type("사용")
                .description("마일리지 출금")
                .build();

        // when
        mileageService.createMileage(request);

        // then
        Optional<User> findUser = userRepository.findByLoginId(loginId);
        assertNotNull(findUser);
        System.out.println(findUser.get());
    }

    @Test
    @DisplayName("마일리지 조회")
    void showMileage() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser();
        Mileage targetMileage = insertMileage(targetUser);
        Long userId = targetUser.getId();

        // when
        List<MileageResponse> respone = mileageService.showMileage(userId);

        // then
        assertNotNull(respone);
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
                .totalMileage(5000)
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
