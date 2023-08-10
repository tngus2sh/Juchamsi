package com.inet.juchamsi.domain.token.application;

import com.inet.juchamsi.domain.token.dto.SaveTokenRequest;

public interface TokenService {
    void saveToken(SaveTokenRequest request);
}
