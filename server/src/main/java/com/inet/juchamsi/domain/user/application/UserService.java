package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.LoginAdminRequest;

import javax.transaction.Transactional;

@Transactional
public interface UserService {
    Long signup(LoginAdminRequest dto);
}