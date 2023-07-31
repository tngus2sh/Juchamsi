package com.inet.juchamsi.domain.user.application.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.user.application.SmsService;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.dto.request.MessageDTO;
import com.inet.juchamsi.domain.user.dto.request.SmsRequest;
import com.inet.juchamsi.domain.user.dto.response.SmsResponse;
import com.inet.juchamsi.global.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

    @Value("${naver-cloud-sms.accessKey}")
    private String accessKey;
    @Value("${naver-cloud-sms.secretKey}")
    private String secretKey;
    @Value("${naver-cloud-sms.serviceId}")
    private String serviceId;
    @Value("${naver-cloud-sms.senderPhone}")
    private String phone;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ValidationUtil validationUtil;
    
    public String getSignature(String time) throws NoSuchAlgorithmException, UnsupportedEncodingException, InvalidKeyException {
        String space = " ";
        String newLine = "\n";
        String method = "POST";
        String url = "/sms/v2/services/"+ this.serviceId+"/messages";
        String accessKey = this.accessKey;
        String secretKey = this.secretKey;

        String message = new StringBuilder()
                .append(method)
                .append(space)
                .append(url)
                .append(newLine)
                .append(time)
                .append(newLine)
                .append(accessKey)
                .toString();

        SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);

        byte[] rawHmac = mac.doFinal(message.getBytes("UTF-8"));
        String encodeBase64String = Base64.encodeBase64String(rawHmac);

        return encodeBase64String;
    }
    
    @Override
    public String sendSmsToCheckUser(MessageDTO messageDto) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {
//        String name = messageDto.getName();
//        String to = messageDto.getTo();
//
//        userRepository.findByNameAndPhone(name, to)
//                .orElseThrow(() ->
//                        new NotFoundException("회원이 존재하지 않습니다.", name));
        String time = Long.toString(System.currentTimeMillis());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-ncp-apigw-timestamp", time);
        headers.set("x-ncp-iam-access-key", accessKey);
        headers.set("x-ncp-apigw-signature-v2", getSignature(time)); // signature 서명

        List<MessageDTO> messages = new ArrayList<>();
        messages.add(messageDto);

        String verificationCode = validationUtil.createRandomNumCode();
        SmsRequest request = SmsRequest.builder()
                .type("SMS")
                .contentType("COMM")
                .countryCode("82")
                .from(phone)
                .content("[주참시 인증번호] 인증번호\n[" + verificationCode + "]를 입력해주세요")
                .messages(messages)
                .build();

        //쌓은 바디를 json형태로 반환
        ObjectMapper objectMapper = new ObjectMapper();
        String body = objectMapper.writeValueAsString(request);
        // jsonBody와 헤더 조립
        HttpEntity<String> httpBody = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        //restTemplate로 post 요청 보내고 오류가 없으면 202코드 반환
        SmsResponse smsResponseDto = restTemplate.postForObject(new URI("https://sens.apigw.ntruss.com/sms/v2/services/"+ serviceId +"/messages"), httpBody, SmsResponse.class);
//        SmsResponse responseDto = new SmsResponse(verificationCode);
        // redisUtil.setDataExpire(smsConfirmNum, messageDto.getTo(), 60 * 3L); // 유효시간 3분
        return verificationCode;
    }

    @Override
    public SmsResponse sendSmsToFindPassword(MessageDTO messageDto) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {
//        String name = messageDto.getName();
//        String phoneNumber = messageDto.getTo();

//        userRepository.findByNameAndPhone(name, phoneNumber)
//                .orElseThrow(() ->
//                        new NotFoundException("회원이 존재하지 않습니다.", name));
        String time = Long.toString(System.currentTimeMillis());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-ncp-apigw-timestamp", time);
        headers.set("x-ncp-iam-access-key", accessKey);
        headers.set("x-ncp-apigw-signature-v2", getSignature(time)); // signature 서명

        List<MessageDTO> messages = new ArrayList<>();
        messages.add(messageDto);

        String verificationCode = validationUtil.createRandomNumCode();
        SmsRequest request = SmsRequest.builder()
                .type("SMS")
                .contentType("COMM")
                .countryCode("82")
                .from(phone)
                .content("[주참시 인증번호] 인증번호\n[" + verificationCode + "]를 입력해주세요")
                .messages(messages)
                .build();

        //쌓은 바디를 json형태로 반환
        ObjectMapper objectMapper = new ObjectMapper();
        String body = objectMapper.writeValueAsString(request);
        // jsonBody와 헤더 조립
        HttpEntity<String> httpBody = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        //restTemplate로 post 요청 보내고 오류가 없으면 202코드 반환
        SmsResponse response = restTemplate.postForObject(new URI("https://sens.apigw.ntruss.com/sms/v2/services/"+ serviceId +"/messages"), httpBody, SmsResponse.class);
//        SmsResponse response = SmsResponse(verificationCode);
        // redisUtil.setDataExpire(smsConfirmNum, messageDto.getTo(), 60 * 3L); // 유효시간 3분
        return response;
    }

//    @Override
//    public String sendSmsToCheckUser(CheckUserRequest request) {
//        String name = request.getName();
//        String phoneNumber = request.getPhoneNumber();
//
//        User foundUser = userRepository.findByNameAndPhone(name, phoneNumber)
//                .orElseThrow(() ->
//                new NotFoundException("회원이 존재하지 않습니다.", name));
//
//        String verificationCode = validationUtil.createRandomNumCode();
//        smsUtil.sendRandomNum(phoneNumber, verificationCode);
//        return verificationCode;
//    }

//    @Transactional
//    @Override
//    public void sendSmsToFindPassword(CheckUserRequest request) {
//        String name = request.getName();
//        String phoneNumber = request.getPhoneNumber();
//
//        User foundUser = userRepository.findByNameAndPhone(name, phoneNumber)
//                .orElseThrow(() ->
//                        new NotFoundException("회원이 존재하지 않습니다.", name));
//
//        String verificationCode = validationUtil.createTempPassword();
//        smsUtil.sendTempPassword(phoneNumber, verificationCode);
//
//        // db에 임시 비밀번호 저장
//        userRepository.updateLoginPassword(name, phoneNumber, passwordEncoder.encode(verificationCode));
//    }
}
