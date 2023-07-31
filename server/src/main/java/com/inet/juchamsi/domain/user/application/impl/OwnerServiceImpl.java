package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.parking.application.ParkingLotService;
import com.inet.juchamsi.domain.user.application.OwnerService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateOwnerRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.response.AdminOwnerLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.OwnerResponse;
import com.inet.juchamsi.domain.user.dto.response.TenantRequestResponse;
import com.inet.juchamsi.domain.user.dto.response.TenantResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.application.VillaService;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.dto.request.CreateVillaRequest;
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

import static com.inet.juchamsi.domain.user.entity.Approve.WAIT;
import static com.inet.juchamsi.domain.user.entity.Grade.OWNER;
import static com.inet.juchamsi.global.common.Active.ACTIVE;

@Service
@Transactional
@RequiredArgsConstructor
public class OwnerServiceImpl implements OwnerService {

    private final UserRepository userRepository;
    private final VillaService villaService;
    private final VillaRepository villaRepository;
    private final ParkingLotService parkingLotService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public List<OwnerResponse> showUser() {
        List<OwnerResponse> ownerResponseList = new ArrayList<>();
        List<User> all = userRepository.findAllByGradeAndActive(OWNER, ACTIVE).get();
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
    @Transactional
    public Long createUser(CreateOwnerRequest dto) {
        // 중복 예외 처리
        Optional<Long> loginId = userRepository.existLoginId(dto.getLoginId());
        if (loginId.isPresent()) {
            throw new AlreadyExistException(User.class, loginId.get());
        }

        Optional<Long> phoneNumber = userRepository.existPhoneNumber(dto.getPhoneNumber());
        if (phoneNumber.isPresent()) {
            throw new AlreadyExistException(User.class, loginId.get());
        }

        // 빌라 등록
        int totalCount = 2 * dto.getParkingLotCol();
        CreateVillaRequest createVillaRequest = CreateVillaRequest.builder()
                .name(dto.getVillaName())
                .roadAddress(dto.getRoadAddress())
                .regionAddress(dto.getRegionAddress())
                .roadZipCode(dto.getRoadZipCode())
                .totalCount(totalCount)
                .build();
        Long villaId = villaService.createVilla(createVillaRequest);

        // 주차장 등록
        parkingLotService.createParkingLot(villaId, dto.getParkingLotCol());

        // 유저 등록
        Optional<Villa> targetVilla = villaRepository.findById(villaId);
        Villa villa = targetVilla.get();

        User user = User.builder()
                .villa(villa)
                .phoneNumber(dto.getPhoneNumber())
                .loginId(dto.getLoginId())
                .loginPassword(dto.getLoginPassword())
                .name(dto.getName())
                .grade(OWNER)
                .approve(WAIT)
                .active(ACTIVE)
                .build();
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
    public void modifyUser(CreateOwnerRequest dto) {
//        Optional<User> oUser = userRepository.findByLoginIdAndActive(dto.getLoginId(), ACTIVE);
//        System.out.println("oUser = " + oUser);
//        if (oUser.isEmpty()) {
//            throw new NotFoundException(User.class, dto.getLoginId());
//        }
//
//        Optional<Long> phoneNumberId = userRepository.existPhoneNumber(dto.getPhoneNumber());
//        if (phoneNumberId.isPresent() && !phoneNumberId.get().equals(oUser.get().getId())) {
//            throw new AlreadyExistException(User.class, phoneNumberId.get());
//        }
//
//        // 빌라가 있는지 확인
//        Optional<Long> connectedVillaId = villaRepository.existIdNumberandActive(dto.getVillaIdNumber(), ACTIVE);
//        if (connectedVillaId.isEmpty()) {
//            throw new NotFoundException(Villa.class, dto.getLoginId());
//        }
//
//        userRepository.updateOwner(dto.getLoginId(), dto.getPhoneNumber(), dto.getCarNumber());
    }

    @Override
    public List<TenantRequestResponse> showNewRequestTenant(Long villaId) {
        Optional<Villa> targetVilla = villaRepository.findById(villaId);
        if(!targetVilla.isPresent()) {
            throw new NotFoundException(Villa.class, villaId);
        }

        List<User> tenantList = userRepository.findNewRequestTenant(targetVilla.get(), WAIT);

        List<TenantRequestResponse> response = new ArrayList<>();
        User tenant;
        for(int i = 0; i < tenantList.size(); i++) {
            tenant = tenantList.get(i);

            TenantRequestResponse tenantResponse = TenantRequestResponse.builder()
                    .id(tenant.getId())
                    .villaId(tenant.getVilla().getId())
                    .phoneNumber(tenant.getPhoneNumber())
                    .loginId(tenant.getLoginId())
                    .name(tenant.getName())
                    .carNumber(tenant.getCarNumber())
                    .villaNumber(tenant.getVillaNumber())
                    .build();
            response.add(tenantResponse);
        }

        return response;
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
