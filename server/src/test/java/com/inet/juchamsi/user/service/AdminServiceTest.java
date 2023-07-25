package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.SignupAdminRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.entity.Active;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
@Transactional
public class AdminServiceTest {

    @Autowired
    AdminService adminService;

    @Autowired
    UserRepository userRepository;

    @Test
    @DisplayName("회원 상세 조회")
    void showDetailUser() {
        // given
        User targetUser = insertUser();
        String loginId = "adminid";

        // when
        AdminResponse response = adminService.showDetailUser(loginId);

        // then
        System.out.println("response = " + response);
        assertThat(response.getPhoneNumber()).isEqualTo(targetUser.getPhoneNumber());

    }

    private User insertUser() {
        User user = User.builder()
                .loginId("adminid")
                .password("userPw123!")
                .phoneNumber("01012341234")
                .name("김주참")
                .grade(Grade.ADMIN)
                .approve(Approve.APPROVE)
                .active(Active.ACTIVE)
                .build();
        return userRepository.save(user);
    }
}
