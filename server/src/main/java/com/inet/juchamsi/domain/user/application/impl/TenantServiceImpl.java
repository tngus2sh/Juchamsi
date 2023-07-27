package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.TenantService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginTenantRequest;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
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
        if (!connectedVillaId.isPresent()) {
            throw new NotFoundException(Villa.class, connectedVillaId.get());
        }

        Optional<Villa> findVilla = villaRepository.findById(connectedVillaId.get());
        User user = User.createUser(findVilla.get(), request.getPhoneNumber(), request.getLoginId(), request.getLoginPassword(), request.getName(), USER, request.getCarNumber(), request.getVillaNumber(), WAIT, ACTIVE, "USER");
        User saveUser = userRepository.save(user);

        return saveUser.getId();
    }

    @Override
    public TokenInfo loginUser(LoginTenantRequest request) {
        String loginId = request.getLoginId();
        String password = request.getLoginPassword();

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginId, password);

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

        userRepository.updateRefreshToken(loginId, password);

        return tokenInfo;
    }
}