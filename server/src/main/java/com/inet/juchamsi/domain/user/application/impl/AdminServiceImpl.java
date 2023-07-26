package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.application.DuplicateException;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.LoginAdminRequest;
import com.inet.juchamsi.domain.user.dto.request.SignupAdminRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.entity.Active;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    
    private final UserRepository userRepository;

    // 회원 상세 조회
    @Override
    public AdminResponse showDetailUser(String loginId) {
        // adminLoginId로 회원 상세 정보 가져오기
        Optional<User> targetUser = userRepository.findByLoginId(loginId);

        if (!targetUser.isPresent()) {
            throw new NotFoundException(User.class, loginId);
        }

        User user = targetUser.get();
        return AdminResponse.builder()
                .phoneNumber(user.getPhoneNumber())
                .name(user.getName())
                .carNumber(user.getCarNumber())
                .villaNumber(user.getVillaNumber())
                .build();

    }

    // 회원 가입
    @Override
    public Long createUser(SignupAdminRequest dto) {
        Optional<Long> loginId = userRepository.existLoginId(dto.getLoginId());
        if (loginId.isPresent()) {
            throw new DuplicateException();
        }

        Optional<Long> phoneNumber = userRepository.existPhoneNumber(dto.getPhoneNumber());
        if (phoneNumber.isPresent()) {
            throw new DuplicateException();
        }

        User user = User.createUser(dto.getPhoneNumber(), dto.getLoginId(), dto.getPassword(), dto.getName(), Grade.ADMIN, dto.getCarNumber(), dto.getVillaNumber(), Approve.WAIT, Active.ACTIVE, "ADMIN");
        User savedUser = userRepository.save(user);
        return savedUser.getId();
    }
}
