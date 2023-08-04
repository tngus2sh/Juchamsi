package com.inet.juchamsi.domain.notification.dto.request;

import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
public class CreateNotificationRequest {

    @NotBlank
    private String loginId;

    private LocalDateTime outTime;

    @NotBlank
    private String message;


    public CreateNotificationRequest() {}

    @Builder
    public CreateNotificationRequest(String loginId, LocalDateTime outTime, String message) {
        this.loginId = loginId;
        this.outTime = outTime;
        this.message = message;
    }
}
