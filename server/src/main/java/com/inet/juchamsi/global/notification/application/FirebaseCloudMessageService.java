package com.inet.juchamsi.global.notification.application;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.inet.juchamsi.domain.token.dao.TokenRepository;
import com.inet.juchamsi.domain.token.entity.Token;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.notification.dto.request.FCMNotificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseCloudMessageService {

    private final FirebaseMessaging firebaseMessaging;
    private final TokenRepository tokenRepository;

    public String sendNotification(FCMNotificationRequest request) {
        Optional<Token> targetToken = tokenRepository.findByUserLoginId(request.getLoginId());

        if(targetToken.isPresent()) {
            if(targetToken.get().getFcmToken() != null) {
                Notification notification = Notification.builder()
                        .setTitle(request.getTitle())
                        .setBody(request.getBody())
                        .setImage("images/logo.png")
                        .build();

                Message message = Message.builder()
                        .setToken(targetToken.get().getFcmToken())
                        .setNotification(notification)
                        .build();

                try {
                    firebaseMessaging.send(message);
                    return "알림을 성공적으로 전송했습니다.";
                }
                catch(FirebaseMessagingException e) {
                    e.printStackTrace();
                    return "알림 전송을 실패했습니다.";
                }
            }
            else {
                return "서버에 해당 유저의 FirebaseToken이 존재하지 않습니다.";
            }
        }
        else {
            return "해당 유저가 존재하지 않습니다.";
        }
    }
}