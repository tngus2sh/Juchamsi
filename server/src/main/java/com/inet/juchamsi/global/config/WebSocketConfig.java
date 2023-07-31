package com.inet.juchamsi.global.config;

import com.inet.juchamsi.global.api.ChatHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@RequiredArgsConstructor
@EnableWebSocket // WebSocket 활성화
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatHandler chatHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // WebSocket에 접속하기 위한 EndPoint : /chat
        // 도메인이 다른 서버에서도 접속 가능하도록 CORS: setAllowedOrigins("*");를 추가
        registry.addHandler(chatHandler, "ws/chat").setAllowedOrigins("*");
    }
}
