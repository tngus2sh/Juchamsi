package com.inet.juchamsi.domain.villa.application;

import com.inet.juchamsi.domain.villa.dto.request.CreateVillaRequest;
import com.inet.juchamsi.domain.villa.dto.request.ModifyVillaRequest;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface VillaService {
    Long createVilla(CreateVillaRequest request);
    Long modifyVilla(ModifyVillaRequest request);
}
