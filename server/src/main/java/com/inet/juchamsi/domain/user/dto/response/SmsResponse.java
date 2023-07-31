package com.inet.juchamsi.domain.user.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class SmsResponse {
    String requestId;
    LocalDateTime requestTime;
    String statusCode;
    String statusName;
}
