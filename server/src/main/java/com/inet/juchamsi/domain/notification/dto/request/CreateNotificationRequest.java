package com.inet.juchamsi.domain.notification.dto.request;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CreateNotificationRequest {

    @NotBlank
    private String loginId;

    private LocalDateTime notiTime; // 출차 알람시간

    @NotBlank
    private String message;

    @Builder
    public CreateNotificationRequest(String loginId, LocalDateTime notiTime, String message) {
        this.loginId = loginId;
        this.notiTime = notiTime;
        this.message = message;
    }
}
