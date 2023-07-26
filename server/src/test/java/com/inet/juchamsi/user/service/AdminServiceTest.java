package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.error.AlreadyExistException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static com.inet.juchamsi.domain.user.entity.Approve.APPROVE;
import static com.inet.juchamsi.domain.user.entity.Grade.ADMIN;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

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

    @Test
    @DisplayName("회원 가입#아이디 중복")
    void createUser() {
        // given
        User targetUser = insertUser();

        // when
        CreateOwnerRequest dto = CreateOwnerRequest.builder()
                .loginId("adminid")
                .build();

        // then
        assertThatThrownBy(() -> adminService.createUser(dto))
                .isInstanceOf(AlreadyExistException.class);
    }

    private User insertUser() {
        User user = User.builder()
                .loginId("adminid")
                .password("userPw123!")
                .phoneNumber("01012341234")
                .name("김주참")
                .grade(ADMIN)
                .approve(APPROVE)
                .active(ACTIVE)
                .build();
        return userRepository.save(user);
    }
}
