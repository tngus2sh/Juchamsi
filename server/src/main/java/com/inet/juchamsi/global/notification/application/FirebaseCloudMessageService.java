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
            if(targetToken.get().getFCMToken() != null) {
                Notification notification = Notification.builder()
                        .setTitle(request.getTitle())
                        .setBody(request.getBody())
                        .build();

                Message message = Message.builder()
                        .setToken(targetToken.get().getFCMToken())
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


//    private final String APIP_URL = "";
//    private final ObjectMapper objectMapper;
//
//    public void sendMessageTo(String targetToken, String title, String body, String path) throws JsonProcessingException {
//        String message = makeMessage(targetToken, title, body, path);
//
//    }
//
//    private String makeMessage(String targetToken, String title, String body, String path) throws JsonProcessingException {
//        FcmMessage fcmMessage = FcmMessage.builder()
//                .message(FcmMessage.appMessage.builder()
//                        .token(targetToken)
//                        .notification(FcmMessage.Notification.builder()
//                                .title(title)
//                                .body(body)
//                                .image(null)
//                                .build()
//                        )
//                        .data(FcmMessage.FcmData.builder()
//                                .path(path)
//                                .build()
//                        )
//                        .build()
//                ).validate_only(false).build();
//
//        log.info(objectMapper.writeValueAsString(fcmMessage));
//        return objectMapper.writeValueAsString(fcmMessage);
//    }
//
//    private String getAccessToken() throws Exception {
//        // 2)
//        String firebaseConfigPath = "key_path";
//
//        GoogleCredentials googleCredentials = GoogleCredentials.fromStream(new ClassPathResource(firebaseConfigPath).getInputStream())
//                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));
//
//        // accessToken 생성
//        googleCredentials.refreshIfExpired();
//
//        // GoogleCredential의 getAccessToken으로 토큰 받아온 뒤, getTokenValue로 최종적으로 받음
//        // REST API로 FCM에 push 요청 보낼 때 Header에 설정하여 인증을 위해 사용
//        return googleCredentials.getAccessToken().getTokenValue();
//    }
}