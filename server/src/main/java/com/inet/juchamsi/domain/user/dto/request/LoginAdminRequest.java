package com.inet.juchamsi.domain.user.dto.request;

import lombok.Data;

@Data
public class LoginAdminRequest {
    
    private String loginId;
    private String password;
    
}