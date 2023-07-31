package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateAdminRequest;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import com.inet.juchamsi.global.jwt.JwtTokenProvider;
import com.inet.juchamsi.global.jwt.TokenInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    
    private final UserRepository userRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    // 회원 가입
    @Override
    public Long createUser(CreateAdminRequest dto) {
        Optional<Long> loginId = userRepository.existLoginId(dto.getLoginId());
        if (loginId.isPresent()) {
            throw new AlreadyExistException(User.class, loginId.get());
        }

        Optional<Long> phoneNumber = userRepository.existPhoneNumber(dto.getPhoneNumber());
        if (phoneNumber.isPresent()) {
            throw new AlreadyExistException(User.class, phoneNumber.get());
        }

        User user = User.createUserAdmin(dto.getPhoneNumber(), dto.getLoginId(), passwordEncoder.encode(dto.getLoginPassword()), dto.getName(), Grade.ADMIN, Approve.WAIT, Active.ACTIVE, "ADMIN");
        User savedUser = userRepository.save(user);
        return savedUser.getId();
    }

    // 회원 상세 조회
    @Override
    public AdminResponse showDetailUser(String adminId) {
        // loginId로 회원 상세 정보 가져오기
        Optional<User> targetUser = userRepository.findByLoginId(adminId);

        if (targetUser.isEmpty()) {
            throw new NotFoundException(User.class, adminId);
        }

        User user = targetUser.get();
        return AdminResponse.builder()
                .phoneNumber(user.getPhoneNumber())
                .name(user.getName())
                .build();

    }

    // 로그인
    @Override
    @Transactional
    public AdminOwnerLoginResponse loginUser(LoginRequest request) {
        String adminId = request.getLoginId();
        String password  = request.getLoginPassword();
        // 1. login ID/PW를 기반으로 Authentication 객체 생성
        // 이때 authentication은 인증 여부를 확인하는 authenticated 값이 false
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(adminId, password);
        
        // 2. 실제 검증 (사용자 비밀번호 체크)이 이루어지는 부분
        // authenticate 메서드가 실행될 때 CustomUserDetailService에서 만든 loadUserByUsername 메서드가 실행
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        
        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);
        
        // 4. 데이터베이스에 refreshToken 저장
        userRepository.updateRefreshToken(adminId, password);

        User user = userRepository.findByLoginId(adminId).get();
        return AdminOwnerLoginResponse.builder()
                .tokenInfo(tokenInfo)
                .grade(user.getGrade().name())
                .build();
    }

    // 로그아웃
    @Override
    public void logoutUser(String adminId) {
        Optional<User> user = userRepository.findByLoginId(adminId);
        if (user.isEmpty()) {
            throw new NotFoundException(User.class, adminId);
        }

        // 데이터베이스에서 refreshToken 초기화
        userRepository.updateRefreshToken(adminId, "");
    }

    // 회원정보 수정
    @Override
    public void modifyUser(CreateAdminRequest dto) {
        Optional<User> oUser = userRepository.findByLoginIdAndActive(dto.getLoginId(), Active.ACTIVE);
        System.out.println("oUser = " + oUser);
        if (oUser.isEmpty()) {
            throw new NotFoundException(User.class, dto.getLoginId());
        }

        Optional<Long> phoneNumberId = userRepository.existPhoneNumber(dto.getPhoneNumber());
        if (phoneNumberId.isPresent() && !phoneNumberId.get().equals(oUser.get().getId())) {
            throw new AlreadyExistException(User.class, phoneNumberId.get());
        }

        userRepository.updateAdmin(dto.getLoginId(), dto.getPhoneNumber());
    }

    @Override
    public void manageApprove(String ownerId, Approve approve) {
        Optional<Long> ownerLoginId = userRepository.existLoginId(ownerId);
        if (ownerLoginId.isEmpty()) {
            throw new NotFoundException(User.class, ownerId);
        }

        // 승인 상태 수정
        userRepository.updateApprove(ownerId, approve);
    }

    @Override
    public void removeUser(String adminId) {
        Optional<Long> loginId = userRepository.existLoginId(adminId);
        if (loginId.isEmpty()) {
            throw new NotFoundException(User.class, adminId);
        }

        // 회원 상태 active 에서 disabled로 바꾸기
        userRepository.updateActive(adminId, Active.DISABLED);
    }
}
