package com.inet.juchamsi.domain.user.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.inet.juchamsi.domain.user.dto.request.MessageRequest;
import com.inet.juchamsi.domain.user.dto.response.SmsResponse;
import org.springframework.web.client.RestClientException;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public interface SmsService {
    
    String sendSmsToCheckUser(MessageRequest messageRequest)throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException;

    SmsResponse sendSmsToFindPassword(MessageRequest messageRequest)throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException;
}
