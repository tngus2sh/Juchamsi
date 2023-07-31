package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.TenantService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.request.ModifyTenantRequest;
import com.inet.juchamsi.domain.user.dto.response.TenantResponse;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.inet.juchamsi.domain.user.entity.Approve.MODIFY;
import static com.inet.juchamsi.domain.user.entity.Approve.WAIT;
import static com.inet.juchamsi.domain.user.entity.Grade.USER;
import static com.inet.juchamsi.global.common.Active.ACTIVE;

@Service
@Transactional
@RequiredArgsConstructor
public class TenantServiceImpl implements TenantService {

    private final UserRepository userRepository;
    private final VillaRepository villaRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Long createUser(CreateTenantRequest request) {
        Optional<Long> existedLoginId = userRepository.existLoginId(request.getLoginId());
        if (existedLoginId.isPresent()) {
            throw new AlreadyExistException(User.class, existedLoginId.get());
        }

        Optional<Long> existedPhoneNumber = userRepository.existPhoneNumber(request.getPhoneNumber());
        if(existedPhoneNumber.isPresent()) {
            throw new AlreadyExistException(User.class, existedPhoneNumber.get());
        }

        Optional<Long> connectedVillaId = villaRepository.existIdNumber(request.getVillaIdNumber());
        if (connectedVillaId.isEmpty()) {
            throw new NotFoundException(Villa.class, connectedVillaId.get());
        }

        Optional<Villa> findVilla = villaRepository.findById(connectedVillaId.get());
        User user = User.createUser(findVilla.get(), request.getPhoneNumber(), request.getLoginId(), passwordEncoder.encode(request.getLoginPassword()), request.getName(), USER, request.getCarNumber(), request.getVillaNumber(), WAIT, ACTIVE, "USER");
        User saveUser = userRepository.save(user);

        return saveUser.getId();
    }

    @Override
    public List<TenantResponse> showUser() {
        List<TenantResponse> tenantResponseList = new ArrayList<>();
        List<User> all = userRepository.findAllByGradeAndActive(USER, ACTIVE).get();
        for (User user : all) {
            tenantResponseList.add(
                    TenantResponse.builder()
                            .id(user.getId())
                            .villaIdNumber(user.getVilla().getIdNumber())
                            .phoneNumber(user.getPhoneNumber())
                            .name(user.getName())
                            .carNumber(user.getCarNumber())
                            .villaNumber(user.getVillaNumber())
                            .build()
            );
        }
        return tenantResponseList;
    }

    @Override
    public TenantResponse showDetailUser(String tenantId) {
        Optional<User> targetUser = userRepository.findByLoginId(tenantId);
        if (targetUser.isEmpty()) {
            throw new NotFoundException(User.class, tenantId);
        }

        User user = targetUser.get();
        Villa villa = targetUser.get().getVilla();
        return TenantResponse.builder()
                .id(user.getId())
                .villaIdNumber(villa.getIdNumber())
                .phoneNumber(user.getPhoneNumber())
                .name(user.getName())
                .carNumber(user.getCarNumber())
                .villaNumber(user.getVillaNumber())
                .build();
    }

    @Override
    public TokenInfo loginUser(LoginRequest request) {
        String loginId = request.getLoginId();
        String password = request.getLoginPassword();

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginId, password);

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

        userRepository.updateRefreshToken(loginId, password);

        return tokenInfo;
    }

    @Override
    public void logoutUser(String tenantId) {
        Optional<User> user = userRepository.findByLoginId(tenantId);
        if (user.isEmpty()) {
            throw new NotFoundException(User.class, tenantId);
        }

        userRepository.updateRefreshToken(tenantId, "");

    }

    @Override
    public void modifyUser(ModifyTenantRequest request) {
        Optional<User> oUser = userRepository.findByLoginIdAndActive(request.getLoginId(), Active.ACTIVE);
        System.out.println("oUser = " + oUser);
        if (oUser.isEmpty()) {
            throw new NotFoundException(User.class, request.getLoginId());
        }

        Optional<Long> phoneNumberId = userRepository.existPhoneNumber(request.getPhoneNumber());
        if (phoneNumberId.isPresent() && !phoneNumberId.get().equals(oUser.get().getId())) {
            throw new AlreadyExistException(User.class, phoneNumberId.get());
        }

        Optional<Long> connectedVillaId = villaRepository.existIdNumber(request.getVillaIdNumber());
        if (connectedVillaId.isEmpty()) {
            throw new NotFoundException(Villa.class, request.getVillaNumber());
        }

        userRepository.updateTenant(request.getLoginId(), request.getPhoneNumber(), request.getCarNumber(), request.getVillaNumber());
        userRepository.updateApproveModify(request.getLoginId(), MODIFY);
    }

    @Override
    public void removeUser(String tenantId) {
        Optional<Long> loginId = userRepository.existLoginId(tenantId);
        if (loginId.isEmpty()) {
            throw new NotFoundException(User.class, tenantId);
        }

        // 회원상태 active에서 disabled로 바꾸기
        userRepository.updateActive(tenantId, Active.DISABLED);
    }
}