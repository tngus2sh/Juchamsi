package com.inet.juchamsi.user.service;

import com.inet.juchamsi.domain.user.application.TenantService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest
@Transactional
public class TenantServiceTest {

    @Autowired
    TenantService tenantService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VillaRepository villaRepository;


    @Test
    @DisplayName("세입자 회원가입")
    void createUser() {
        // given
        Villa targetVilla = insertVilla();
        String villaIdNumber = targetVilla.getIdNumber();
        CreateTenantRequest request = CreateTenantRequest.builder()
                .villaIdNumber(villaIdNumber)
                .phoneNumber("01012345678")
                .loginId("userid")
                .password("juchamsi1234!")
                .name("주참시")
                .carNumber("1가1234")
                .villaNumber(101)
                .build();

        // when
        Long userId = tenantService.createUser(request);

        // then
        Optional<User> findUser = userRepository.findById(userId);
        assertThat(findUser).isPresent();
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
}
