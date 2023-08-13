package com.inet.juchamsi.domain.chat.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChatRoomRequest {
    private String userIdOne;
    private String userIdTwo;
}
