package com.inet.juchamsi.domain.user.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.inet.juchamsi.domain.user.dto.request.CheckUserRequest;
import com.inet.juchamsi.domain.user.dto.request.MessageDTO;
import com.inet.juchamsi.domain.user.dto.response.SmsResponse;
import org.springframework.web.client.RestClientException;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public interface SmsService {
    
    String sendSmsToCheckUser(MessageDTO messageDTO)throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException;

    SmsResponse sendSmsToFindPassword(MessageDTO messageDTO)throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException;

    // 핸드폰 인증
//    String sendSmsToCheckUser(CheckUserRequest request);

    // 임시 비밀번호 발급
//    void sendSmsToFindPassword(CheckUserRequest request);

}
