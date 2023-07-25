package com.inet.juchamsi.villa.service;

import com.inet.juchamsi.domain.villa.application.VillaService;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.dto.request.CreateVillaRequest;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
@Transactional
public class VillaServiceTest {

    @Autowired
    VillaService villaService;

    @Autowired
    VillaRepository villaRepository;


    @Test
    @DisplayName("빌라 등록")
    void createVilla() {
        // given
        CreateVillaRequest request = CreateVillaRequest.builder()
                .name("삼성 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .idNumber("62218271")
                .totalCount(6)
                .build();

        // when
        Long villaId = villaService.createVilla(request);

        // then
        Optional<Villa> findVilla = villaRepository.findById(villaId);
        assertThat(findVilla).isPresent();
    }
}
