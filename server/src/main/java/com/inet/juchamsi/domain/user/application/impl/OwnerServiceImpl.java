package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.OwnerService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.OwnerResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
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
    private final VillaRepository villaRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public List<OwnerResponse> showUser() {
        List<OwnerResponse> ownerResponseList = new ArrayList<>();
        List<User> all = userRepository.findAllByGradeAndActive(Grade.OWNER, Active.ACTIVE).get();
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
        if (targetUser.isEmpty()) {
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
    public Long createUser(CreateOwnerRequest dto) {
        Optional<Long> loginId = userRepository.existLoginId(dto.getLoginId());
        if (loginId.isPresent()) {
            throw new AlreadyExistException(User.class, loginId.get());
        }

        Optional<Long> phoneNumber = userRepository.existPhoneNumber(dto.getPhoneNumber());
        if (phoneNumber.isPresent()) {
            throw new AlreadyExistException(User.class, loginId.get());
        }

        Villa villa = Villa.builder().idNumber(dto.getVillaIdNumber()).build();

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
        if (user.isEmpty()) {
            throw new NotFoundException(User.class, ownerId);
        }

        // 데이터베이스에서 refreshToken 초기화
        userRepository.updateRefreshToken(ownerId, "");
    }

    @Override
    public  void modifyUser(CreateOwnerRequest dto) {
        Optional<User> oUser = userRepository.findByLoginIdAndActive(dto.getLoginId(), Active.ACTIVE);
        System.out.println("oUser = " + oUser);
        if (oUser.isEmpty()) {
            throw new NotFoundException(User.class, dto.getLoginId());
        }

        Optional<Long> phoneNumberId = userRepository.existPhoneNumber(dto.getPhoneNumber());
        if (phoneNumberId.isPresent() && !phoneNumberId.get().equals(oUser.get().getId())) {
            throw new AlreadyExistException(User.class, phoneNumberId.get());
        }

        // 빌라가 있는지 확인
        Optional<Long> connectedVillaId = villaRepository.existIdNumberandActive(dto.getVillaIdNumber(), Active.ACTIVE);
        if (connectedVillaId.isEmpty()) {
            throw new NotFoundException(Villa.class, dto.getLoginId());
        }

        userRepository.updateOwner(dto.getLoginId(), dto.getPhoneNumber(), dto.getCarNumber());
    }

    @Override
    public void manageApprove(String tenantId, Approve approve) {
        Optional<Long> tenantLoginId = userRepository.existLoginId(tenantId);
        if (tenantLoginId.isEmpty()) {
            throw new NotFoundException(User.class, tenantId);
        }

        // 승인 상태 수정
        userRepository.updateApprove(tenantId, approve);
    }

    @Override
    public void removeUser(String ownerId) {
        Optional<Long> loginId = userRepository.existLoginId(ownerId);
        if (loginId.isEmpty()) {
            throw new NotFoundException(User.class, ownerId);
        }

        // 회원상태 active에서 disabled로 바꾸기
        userRepository.updateActive(ownerId, Active.DISABLED);
    }
}
