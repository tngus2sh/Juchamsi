package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.OwnerService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateAdminOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.OwnerResponse;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class OwnerServiceImpl implements OwnerService {

    private final UserRepository userRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public List<OwnerResponse> showUser() {
        List<OwnerResponse> ownerResponseList = new ArrayList<>();
        List<User> all = userRepository.findAll();
        for (User user: all) {
            ownerResponseList.add(
                    OwnerResponse.builder()
                            .id(user.getId())
                            .villaIdNumber(user.getVilla().getIdNumber())
                            .phoneNumber(user.getPhoneNumber())
                            .name(user.getName())
                            .build());
        }
        return ownerResponseList;
    }

    @Override
    public OwnerResponse showDetailUser(String ownerId) {
        // loginId로 회원 상세 정보 가져오기
        Optional<User> targetUser = userRepository.findByLoginId(ownerId);
        if (!targetUser.isPresent()) {
            throw new NotFoundException(User.class, ownerId);
        }
        User user = targetUser.get();
        Villa villa = targetUser.get().getVilla();
        return OwnerResponse.builder()
                .id(user.getId())
                .villaIdNumber(villa.getIdNumber())
                .phoneNumber(user.getPhoneNumber())
                .name(user.getName())
                .build();
    }

    @Override
    public Long createUser(CreateAdminOwnerRequest dto) {
        Optional<Long> loginId = userRepository.existLoginId(dto.getLoginId());
        if (loginId.isPresent()) {
            throw new AlreadyExistException(User.class, loginId.get());
        }

        Optional<Long> phoneNumber = userRepository.existPhoneNumber(dto.getPhoneNumber());
        if (phoneNumber.isPresent()) {
            throw new AlreadyExistException(User.class, loginId.get());
        }

        Villa villa = Villa.builder().idNumber(dto.getVillaId()).build();

        User user = User.createUser(villa, dto.getPhoneNumber(), dto.getLoginId(), dto.getLoginPassword(), dto.getName(), Grade.OWNER, dto.getCarNumber(), dto.getVillaNumber(), Approve.WAIT, Active.ACTIVE, "OWNER");
        User savedUser = userRepository.save(user);
        return savedUser.getId();
    }

    @Override
    public AdminOwnerLoginResponse loginUser(LoginRequest request) {
        String ownerId = request.getLoginId();
        String password = request.getLoginPassword();
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(ownerId, password);
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);
        userRepository.updateRefreshToken(ownerId, password);

        User user = userRepository.findByLoginId(ownerId).get();
        return AdminOwnerLoginResponse.builder()
                .tokenInfo(tokenInfo)
                .grade(user.getGrade().name())
                .build();
    }

    @Override
    public void logoutUser(String ownerId) {
        Optional<User> user = userRepository.findByLoginId(ownerId);
        if (!user.isPresent()) {
            throw new NotFoundException(User.class, ownerId);
        }

        // 데이터베이스에서 refreshToken 초기화
        userRepository.updateRefreshToken(ownerId, "");
    }

    @Override
    public  void modifyUser(CreateAdminOwnerRequest dto) {
        Optional<Long> loginId = userRepository.existLoginId(dto.getLoginId());
        if (!loginId.isPresent()) {
            throw new NotFoundException(User.class, loginId.get());
        }

        Optional<Long> phoneNumber = userRepository.existPhoneNumber(dto.getPhoneNumber());
        if (phoneNumber.isPresent() && !phoneNumber.get().equals(loginId.get())) {
            throw new AlreadyExistException(User.class, phoneNumber.get());
        }

        Villa villa = Villa.builder().idNumber(dto.getVillaId()).build();

        User user = User.createUser(villa, dto.getPhoneNumber(), dto.getLoginId(), dto.getLoginPassword(), dto.getName(), Grade.OWNER, dto.getCarNumber(), dto.getVillaNumber(), Approve.WAIT, Active.ACTIVE, "OWNER");
        userRepository.save(user);
    }

    @Override
    public void manageApprove(String tenantId, Approve approve) {
        Optional<Long> tenantLoginId = userRepository.existLoginId(tenantId);
        if (!tenantLoginId.isPresent()) {
            throw new NotFoundException(User.class, tenantLoginId.get());
        }

        // 승인 상태 수정
        userRepository.updateApprove(tenantId, approve.name()).get();
    }

    @Override
    public void removeUser(String ownerId) {
        Optional<Long> loginId = userRepository.existLoginId(ownerId);
        if (!loginId.isPresent()) {
            throw new NotFoundException(User.class, loginId.get());
        }

        // 회원상태 active에서 disabled로 바꾸기
        userRepository.updateActive(ownerId, Active.DISABLED.name()).get();
    }
}
