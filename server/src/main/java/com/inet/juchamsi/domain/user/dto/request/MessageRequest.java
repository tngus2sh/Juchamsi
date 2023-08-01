package com.inet.juchamsi.domain.user.dto.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class MessageRequest {
    String to;
    String name;
}
