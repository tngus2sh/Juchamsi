package com.inet.juchamsi.domain.notification.dto.request;

import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
public class CreateUpdateNotificationRequest {

    @NotBlank
    private String loginId;

    private LocalDateTime outTime;


    public CreateUpdateNotificationRequest() {}

    @Builder
    public CreateUpdateNotificationRequest(String loginId, LocalDateTime outTime) {
        this.loginId = loginId;
        this.outTime = outTime;
    }
}
