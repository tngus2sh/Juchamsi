package com.inet.juchamsi.domain.user.application.impl;

import com.inet.juchamsi.domain.user.application.UserService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public boolean checkId(String loginId) {
        Long userCount = userRepository.countByLoginId(loginId);

        if(userCount > 0) {
            return false;
        }

        return true;
    }
}
