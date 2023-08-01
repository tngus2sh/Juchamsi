package com.inet.juchamsi.domain.user.dto.request;

import lombok.*;

import java.util.List;

// refactor: 컬럼에 private 붙이기
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class SmsRequest {
    String type;
    String contentType;
    String countryCode;
    String from;
    String content;
    List<MessageRequest> messages;
}