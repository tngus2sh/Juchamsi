package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dto.request.SystemChatRoomRequest;
import com.inet.juchamsi.domain.token.dao.TokenRepository;
import com.inet.juchamsi.domain.token.entity.Token;
import com.inet.juchamsi.domain.user.application.TenantService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import com.inet.juchamsi.domain.user.dto.request.LoginRequest;
import com.inet.juchamsi.domain.user.dto.request.ModifyTenantPasswordRequest;
import com.inet.juchamsi.domain.user.dto.request.ModifyTenantRequest;
import com.inet.juchamsi.domain.user.dto.response.TenantLoginResponse;
import com.inet.juchamsi.domain.user.dto.response.TenantResponse;
import com.inet.juchamsi.domain.user.entity.Approve;
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

import static com.inet.juchamsi.domain.user.entity.Approve.*;
import static com.inet.juchamsi.domain.user.entity.Grade.USER;
import static com.inet.juchamsi.global.api.ApiResult.ERROR;
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
    private final ChatService chatService;
    private final TokenRepository tokenRepository;

    @Override
    public Long createUser(CreateTenantRequest request) {
        Optional<Long> existedLoginId = userRepository.existLoginId(request.getLoginId());
        if (existedLoginId.isPresent()) {
            throw new AlreadyExistException(User.class, "동일한 아이디를 사용하는 회원이 존재합니다.");
        }

        Optional<Long> existedPhoneNumber = userRepository.existPhoneNumber(request.getPhoneNumber());
        if(existedPhoneNumber.isPresent()) {
            throw new AlreadyExistException(User.class, "동일한 핸드폰 번호를 사용하는 회원이 존재합니다.");
        }

        Optional<Long> connectedVillaId = villaRepository.existIdNumber(request.getVillaIdNumber());
        if (connectedVillaId.isEmpty()) {
            throw new NotFoundException(Villa.class, connectedVillaId.get());
        }

        Optional<Long> existedVillaNumber = userRepository.existVillaNumber(request.getVillaNumber());
        if(existedVillaNumber.isPresent()) {
            throw new AlreadyExistException(User.class, "동일한 빌라 호수를 사용하는 회원이 존재합니다.");
        }

        Optional<Long> existedCarNumber = userRepository.existCarNumber(request.getCarNumber());
        if(existedCarNumber.isPresent()) {
            throw new AlreadyExistException(User.class, "동일한 차량 번호를 사용하는 회원이 존재합니다.");
        }

        Optional<Villa> findVilla = villaRepository.findById(connectedVillaId.get());
        User user = User.createUserTenant(findVilla.get(), request.getPhoneNumber(), request.getLoginId(), passwordEncoder.encode(request.getLoginPassword()), request.getName(), 0, USER, null, request.getCarNumber(), request.getVillaNumber(), WAIT, ACTIVE, "USER");
        User saveUser = userRepository.save(user);

        // 시스템 채팅방 생성
        chatService.createSystemRoom(SystemChatRoomRequest.builder()
                .userId(request.getLoginId())
                .build());
        
        return saveUser.getId();
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
                .totalMileage(user.getTotalMileage())
                .carNumber(user.getCarNumber())
                .villaNumber(user.getVillaNumber())
                .build();
    }

    @Override
    public List<TenantResponse> showApproveTenant(Long villaId, Approve approve) {
        Optional<Villa> targetVilla = villaRepository.findById(villaId);
        if(!targetVilla.isPresent()) {
            throw new NotFoundException(Villa.class, villaId);
        }

        List<User> userList = userRepository.findVillaTenant(targetVilla.get(), approve, ACTIVE, USER);
        List<TenantResponse> response = new ArrayList<>();

        for (User user : userList) {
            TenantResponse tenantResponse = TenantResponse.builder()
                    .id(user.getId())
                    .villaId(user.getVilla().getId())
                    .villaIdNumber(user.getVilla().getIdNumber())
                    .phoneNumber(user.getPhoneNumber())
                    .loginId(user.getLoginId())
                    .name(user.getName())
                    .carNumber(user.getCarNumber())
                    .villaNumber(user.getVillaNumber())
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
    public TenantLoginResponse loginUser(LoginRequest request) {
        String loginId = request.getLoginId();
        String password = request.getLoginPassword();

        // 현재 활성화 되어있는 사용자인지 판단
//        Optional<Long> userIdOp = userRepository.existLoginIdAndActive(loginId, ACTIVE);
//        if (userIdOp.isEmpty()) {
//            throw new NotFoundException(User.class, loginId);
//        }
        Optional<User> targetUser = userRepository.existLoginIdAndActiveAndGrade(loginId, ACTIVE, USER);
        if (targetUser.isEmpty()) {
            throw new NotFoundException(User.class, loginId);
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginId, password);

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        Approve approve = targetUser.get().getApprove();
        if(approve == WAIT) {
            throw new NotFoundException(User.class, "WAIT");
        }
        else if(approve == MODIFY) {
            throw new NotFoundException(User.class, "MODIFY");
        }
        else if(approve == DECLINE) {
            throw new NotFoundException(User.class, "DECLINE");
        }

        TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

        userRepository.updateRefreshToken(loginId, tokenInfo.getRefreshToken());

        Optional<User> userOptional = userRepository.findByLoginId(loginId);
        if (userOptional.isEmpty()) {
            throw new NotFoundException(User.class, loginId);
        }
        User user = userOptional.get();

        String FCMToken = "";
        Optional<Token> findToken = tokenRepository.findByUserLoginId(user.getLoginId());
        if( findToken.isPresent()) {
            FCMToken = findToken.get().getFCMToken();
        }
        
        Villa targetVilla = user.getVilla();
        Villa villa = Villa.builder()
                .id(targetVilla.getId())
                .name(targetVilla.getName())
                .address(targetVilla.getAddress())
                .idNumber(targetVilla.getIdNumber())
                .totalCount(targetVilla.getTotalCount())
                .build();

        return TenantLoginResponse.builder()
                .tokenInfo(tokenInfo)
                .id(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .loginId(user.getLoginId())
                .name(user.getName())
                .totalMileage(user.getTotalMileage())
                .carNumber(user.getCarNumber())
                .villaNumber(user.getVillaNumber())
                .approved(user.getApprove().name())
                .villa(villa)
                .FCMToken(FCMToken)
                .build();
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
    public void modifyPassword(ModifyTenantPasswordRequest request) {
        String userId = request.getUserId();
        String presentPwd = request.getPresentPwd();
        String modifyPwd = passwordEncoder.encode(request.getModifyPwd());
        
        // 아이디와 현재 비밀번호로 해당 사용자가 있는지 확인
        Optional<User> targetUser = userRepository.existLoginIdAndActiveAndGrade(userId, ACTIVE, USER);
        if (targetUser.isEmpty()) {
            throw new NotFoundException(User.class, userId);
        }
        
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, presentPwd);

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        
        // 맞다면 바꿀 비밀번호로 변경
        userRepository.updatePassword(userId, modifyPwd);
        TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);
        userRepository.updateRefreshToken(userId, tokenInfo.getRefreshToken());

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

        Optional<Long> existedVillaNumber = userRepository.existVillaNumber(request.getVillaNumber());
        if(existedVillaNumber.isPresent()) {
            throw new AlreadyExistException(User.class, request.getVillaNumber());
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