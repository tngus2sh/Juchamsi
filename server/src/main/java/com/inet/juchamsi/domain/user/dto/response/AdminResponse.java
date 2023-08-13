package com.inet.juchamsi.domain.user.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class AdminResponse {

    private Long id;
    private String phoneNumber;
    private String name;

    @Builder
    public AdminResponse(Long id, String phoneNumber, String name) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.name = name;
    }
}
