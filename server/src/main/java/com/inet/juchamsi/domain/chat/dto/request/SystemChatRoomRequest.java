package com.inet.juchamsi.domain.chat.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SystemChatRoomRequest {

    private String userId;

    @Builder
    public SystemChatRoomRequest(String userId) {
        this.userId = userId;
    }
}
