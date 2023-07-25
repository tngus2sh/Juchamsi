package com.inet.juchamsi.domain.villa.application.impl;

import com.inet.juchamsi.domain.villa.application.VillaService;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.dto.request.CreateVillaRequest;
import com.inet.juchamsi.domain.villa.dto.request.ModifyVillaRequest;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static com.inet.juchamsi.global.common.Active.DISABLED;

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

    @Override
    @Transactional
    public Long modifyVilla(ModifyVillaRequest request) {
        Optional<Villa> targetVilla = villaRepository.findById(request.getId());

        if(!targetVilla.isPresent()) {
            throw new NotFoundException(Villa.class, request.getId());
        }

        Villa villa = targetVilla.get();
        villa.setName(request.getName());

        return villa.getId();
    }

    @Override
    @Transactional
    public void removeVilla(Long villaId) {
        Optional<Villa> targetVilla = villaRepository.findById(villaId);

        if(!targetVilla.isPresent()) {
            throw new NotFoundException(Villa.class, villaId);
        }

        Villa villa = targetVilla.get();
        villa.setActive(DISABLED);
    }
}