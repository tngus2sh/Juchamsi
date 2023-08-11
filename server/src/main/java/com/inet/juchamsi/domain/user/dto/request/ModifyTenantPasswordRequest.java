package com.inet.juchamsi.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModifyTenantPasswordRequest {
    
    private String userId; // 아이디
    private String presentPwd; // 현재 비밀번호
    private String modifyPwd; // 바꿀 비밀번호
    
}
