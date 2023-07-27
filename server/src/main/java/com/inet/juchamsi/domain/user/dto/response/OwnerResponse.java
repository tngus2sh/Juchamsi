package com.inet.juchamsi.domain.user.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class OwnerResponse {
    
    private Long id;
    private String villaIdNumber; // 빌라 식별번호
    private String phoneNumber;
    private String name;

    @Builder
    public OwnerResponse(Long id, String villaIdNumber, String phoneNumber, String name) {
        this.id = id;
        this.villaIdNumber = villaIdNumber;
        this.phoneNumber = phoneNumber;
        this.name = name;
    }
}
