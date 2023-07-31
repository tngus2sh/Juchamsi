//package com.inet.juchamsi.global.util;
//
//import net.nurigo.sdk.NurigoApp;
//import net.nurigo.sdk.message.model.Message;
//import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
//import net.nurigo.sdk.message.response.SingleMessageSentResponse;
//import net.nurigo.sdk.message.service.DefaultMessageService;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import javax.annotation.PostConstruct;
//
//@Component
//public class SmsUtil {
//
//    @Value("${naver-cloud-sms.accessKey}")
//    private String accessKey;
//    @Value("${naver-cloud-sms.secretKey}")
//    private String secretKey;
//    @Value("${naver-cloud-sms.serviceId}")
//    private String serviceId;
//    @Value("${aver-cloud-sms.senderPhone}")
//    private String phoneNumber;
//
//    private DefaultMessageService messageService;
//
//    @PostConstruct
//    private void init() {
//        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSercretKey, "https://api.coolsms.co.kr");
//    }
//
//    //  인증번호 메세지 발송
//    public SingleMessageSentResponse sendRandomNum(String to, String verificationCode) {
//        Message message = new Message();
//        //  발신번호 및 수신번호는 01012345678형태
//        message.setFrom(phoneNumber);
//        message.setTo(to);
//        message.setText("[주참시 인증번호] 아래의 인증번호를 입력해주세요\n" + "[" + verificationCode + "]");
//
//        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
//        return response;
//    }
//
//    // 임시 비밀번호 발급 메세지 발송
//    public SingleMessageSentResponse sendTempPassword(String to, String verificationCode) {
//        Message message = new Message();
//        message.setFrom(phoneNumber);
//        message.setTo(to);
//        message.setText("[주참시 임시 비밀번호 발급] 아래의 임시비밀번호를 입력해주세요.\n" + "[" + verificationCode + "]\n" + "※로그인 후 바로 비밀번호 변경 해주세요.");
//
//        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
//        return response;
//    }
//}
