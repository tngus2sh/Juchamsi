package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.AdminService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminResponse;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import com.inet.juchamsi.global.jwt.JwtTokenProvider;
import com.inet.juchamsi.global.jwt.TokenInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.inet.juchamsi.domain.user.entity.Approve.WAIT;
import static com.inet.juchamsi.domain.user.entity.Grade.ADMIN;
import static com.inet.juchamsi.global.common.Active.ACTIVE;

@Service
@Transactional(readOnly = true) // 트랜잭션을 읽기 전용 모드로
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    
    private final UserRepository userRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;

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
    public Long createUser(CreateOwnerRequest dto) {
        Optional<Long> loginId = userRepository.existLoginId(dto.getLoginId());
        if (loginId.isPresent()) {
            throw new AlreadyExistException(User.class, loginId.get());
        }

        Optional<Long> phoneNumber = userRepository.existPhoneNumber(dto.getPhoneNumber());
        if (phoneNumber.isPresent()) {
            throw new AlreadyExistException(User.class, phoneNumber.get());
        }

        Villa villa = Villa.builder().idNumber(dto.getVillaId()).build();

        User user = User.createUser(villa, dto.getPhoneNumber(), dto.getLoginId(), dto.getPassword(), dto.getName(), ADMIN, dto.getCarNumber(), dto.getVillaNumber(), WAIT, ACTIVE, "ADMIN");
        User savedUser = userRepository.save(user);
        return savedUser.getId();
    }

    @Override
    @Transactional
    public TokenInfo login(String adminId, String password) {
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
        
        return tokenInfo;
    }

    @Override
    public void logout(String adminId) {

    }
}
