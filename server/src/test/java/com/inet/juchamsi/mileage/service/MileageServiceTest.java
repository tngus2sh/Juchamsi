package com.inet.juchamsi.mileage.service;

import com.inet.juchamsi.domain.mileage.application.MileageService;
import com.inet.juchamsi.domain.mileage.dao.MileageRepository;
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

import static com.inet.juchamsi.global.common.Active.ACTIVE;

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
    @DisplayName("마일리지 조회")
    void showMileage() {
        // given
        Villa targetVilla = insertVilla();
        User targetUser = insertUser();
        Long userId = targetUser.getId();

        // when
//        MileageService.showMileage()
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
}
