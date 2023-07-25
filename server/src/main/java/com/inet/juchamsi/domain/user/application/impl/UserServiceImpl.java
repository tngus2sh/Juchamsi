package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.UserService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.LoginAdminRequest;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    
    @Override
    public Long signup(LoginAdminRequest dto) {
        Optional<Long> phoneNumber = userRepository.existPhoneNumber(dto);
        
        return null;
    }
}
