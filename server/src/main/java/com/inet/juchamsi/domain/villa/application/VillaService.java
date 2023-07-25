package com.inet.juchamsi.domain.villa.application;

import com.inet.juchamsi.domain.villa.dto.request.CreateVillaRequest;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface VillaService {
    Long createVilla(CreateVillaRequest request);
}
