package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.SmsService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.CheckUserRequest;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.error.NotFoundException;
import com.inet.juchamsi.global.util.SmsUtil;
import com.inet.juchamsi.global.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmsUtil smsUtil;
    private final ValidationUtil validationUtil;

    @Override
    public String sendSmsToCheckUser(CheckUserRequest request) {
        String name = request.getName();
        String phoneNumber = request.getPhoneNumber();

        User foundUser = userRepository.findByNameAndPhone(name, phoneNumber)
                .orElseThrow(() ->
                new NotFoundException("회원이 존재하지 않습니다.", name));

        String verificationCode = validationUtil.createRandomNumCode();
        smsUtil.sendRandomNum(phoneNumber, verificationCode);
        return verificationCode;
    }

    @Transactional
    @Override
    public void sendSmsToFindPassword(CheckUserRequest request) {
        String name = request.getName();
        String phoneNumber = request.getPhoneNumber();

        User foundUser = userRepository.findByNameAndPhone(name, phoneNumber)
                .orElseThrow(() ->
                        new NotFoundException("회원이 존재하지 않습니다.", name));

        String verificationCode = validationUtil.createTempPassword();
        smsUtil.sendTempPassword(phoneNumber, verificationCode);

        // db에 임시 비밀번호 저장
        userRepository.updateLoginPassword(name, phoneNumber, passwordEncoder.encode(verificationCode));
    }
}
