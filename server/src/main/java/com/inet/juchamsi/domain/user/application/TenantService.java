package com.inet.juchamsi.domain.user.application;

import com.inet.juchamsi.domain.user.dto.request.CreateTenantRequest;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface TenantService {
    Long createUser(CreateTenantRequest request);
}
