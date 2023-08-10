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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;

    @Override
    public void saveToken(SaveTokenRequest request) {
        Optional<User> findUser = userRepository.findByLoginId(request.getLoginId());
        if(!findUser.isPresent()) {
            throw new NotFoundException(User.class, request.getLoginId());
        }

        Optional<Token> findToken = tokenRepository.findByUserLoginId(request.getLoginId());
        if(findToken.isPresent()) {
            tokenRepository.updateToken(request.getLoginId(), request.getFCMToken());
        }
        else {
            Token token = Token.builder()
                    .user(findUser.get())
                    .FCMToken(request.getFCMToken())
                    .build();

            tokenRepository.save(token);
        }
    }
}
