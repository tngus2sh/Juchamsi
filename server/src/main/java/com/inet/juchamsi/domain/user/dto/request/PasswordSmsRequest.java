package com.inet.juchamsi.domain.user.dto.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PasswordSmsRequest {
    String type;
    String contentType;
    String countryCode;
    String from;
    String content;
    List<PasswordMessageRequest> messages;
}
