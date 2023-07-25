package com.inet.juchamsi.domain.villa.application.impl;

import com.inet.juchamsi.domain.villa.application.VillaService;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.dto.request.CreateVillaRequest;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.error.AlreadyExistException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.inet.juchamsi.global.common.Active.ACTIVE;

@Service
@RequiredArgsConstructor
public class VillaServiceImpl implements VillaService {

    private final VillaRepository villaRepository;

    @Override
    public Long createVilla(CreateVillaRequest request) {
        Optional<Long> existedVillaId = villaRepository.existIdNumber(request.getIdNumber());
        if(existedVillaId.isPresent()) {
            throw new AlreadyExistException(Villa.class, existedVillaId.get());
        }

        Villa villa = Villa.builder()
                .name(request.getName())
                .address(request.getAddress())
                .idNumber(request.getIdNumber())
                .totalCount(request.getTotalCount())
                .active(ACTIVE)
                .build();
        Villa saveVilla = villaRepository.save(villa);

        return saveVilla.getId();
    }
}