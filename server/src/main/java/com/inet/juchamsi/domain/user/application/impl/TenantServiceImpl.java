package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.DuplicateException;
import com.inet.juchamsi.domain.user.application.TenantService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.SignupAdminRequest;
import com.inet.juchamsi.domain.user.entity.Active;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

import static com.inet.juchamsi.domain.user.entity.Active.ACTIVE;
import static com.inet.juchamsi.domain.user.entity.Approve.WAIT;
import static com.inet.juchamsi.domain.user.entity.Grade.USER;

@Service
@RequiredArgsConstructor
public class TenantServiceImpl implements TenantService {

    private final UserRepository userRepository;
    private final VillaRepository villaRepository;

    @Override
    public Long createUser(CreateTenantRequest request) {
        Optional<Long> existedLoginId = userRepository.existLoginId(request.getLoginId());
        if (existedLoginId.isPresent()) {
            throw new AlreadyExistException(User.class, existedLoginId);
        }

        Optional<Long> connectedVillaId = villaRepository.existIdNumber(request.getVillaIdNumber());
        if (!connectedVillaId.isPresent()) {
            throw new NotFoundException(Villa.class, connectedVillaId.get());
        }

        Optional<Villa> findVilla = villaRepository.findById(connectedVillaId.get());
        User user = User.createUser(findVilla.get(), request.getPhoneNumber(), request.getLoginId(), request.getPassword(), request.getName(), USER, request.getCarNumber(), request.getVillaNumber(), WAIT, ACTIVE, "USER");
        User saveUser = userRepository.save(user);

        return saveUser.getId();
    }
}
