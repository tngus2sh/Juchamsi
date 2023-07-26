package com.inet.juchamsi.domain.user.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class AdminResponse {

    private Long id;
    private Long villaId;
    private String phoneNumber;
    private String name;
    private String carNumber;
    private int villaNumber;

    @Builder
    public AdminResponse(Long id, Long villaId, String phoneNumber, String name, String carNumber, int villaNumber) {
        this.id = id;
        this.villaId = villaId;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.carNumber = carNumber;
        this.villaNumber = villaNumber;
    }
}
