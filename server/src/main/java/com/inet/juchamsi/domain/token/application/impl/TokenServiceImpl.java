package com.inet.juchamsi.domain.token.application.impl;

import com.inet.juchamsi.domain.token.application.TokenService;
import com.inet.juchamsi.domain.token.dao.TokenRepository;
import com.inet.juchamsi.domain.token.dto.SaveTokenRequest;
import com.inet.juchamsi.domain.token.entity.Token;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;

    @Override
    public Long saveToken(SaveTokenRequest request) {
        Optional<User> findUser = userRepository.findByLoginId(request.getLoginId());
        if(!findUser.isPresent()) {
            throw new NotFoundException(User.class, request.getLoginId());
        }

        Optional<Token> findToken = tokenRepository.findByUserLoginId(request.getLoginId());
        if(findToken.isPresent()) {
            tokenRepository.updateToken(request.getLoginId(), request.getFcmToken());
            return findToken.get().getId();
        }
        else {
            Token token = Token.builder()
                    .user(findUser.get())
                    .fcmToken(request.getFcmToken())
                    .build();

            Token saveToken = tokenRepository.save(token);
            return saveToken.getId();
        }
    }
}
