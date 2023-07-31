package com.inet.juchamsi.villa.service;

import com.inet.juchamsi.domain.villa.application.VillaService;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.dto.request.CreateVillaRequest;
import com.inet.juchamsi.domain.villa.dto.request.ModifyVillaRequest;
import com.inet.juchamsi.domain.villa.dto.response.VillaResponse;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.error.AlreadyExistException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static com.inet.juchamsi.global.common.Active.DISABLED;
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
                .roadZipCode("62218")
                .regionZipCode("271")
                .totalCount(6)
                .build();

        // when
        Long villaId = villaService.createVilla(request);

        // then
        Optional<Villa> findVilla = villaRepository.findById(villaId);
        assertThat(findVilla).isPresent();
    }


    @Test
    @DisplayName("빌라 등록 ## 빌라 식별 번호 중복")
    void duplicatedIdNumber() {
        // given
        Villa targetVilla = insertVilla();

        // when
        CreateVillaRequest request = CreateVillaRequest.builder()
                .name("삼성 새 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .roadZipCode("62218")
                .regionZipCode("271")
                .totalCount(8)
                .build();

        // then
        assertThatThrownBy(() -> villaService.createVilla(request))
                .isInstanceOf(AlreadyExistException.class);
    }


    @Test
    @DisplayName("빌라 상세 조회")
    void showDetailVilla() {
        // given
        Villa targetVilla = insertVilla();
        Long targetVillaId = targetVilla.getId();

        // then
        VillaResponse response = villaService.showDetailVilla(targetVillaId);

        // then
        assertThat(response.getIdNumber()).isEqualTo(targetVilla.getIdNumber());
    }


    @Test
    @DisplayName("빌라 수정")
    void modifyVilla() {
        // given
        Villa targetVilla = insertVilla();
        String newName = "삼성 새 빌라";

        // when
        ModifyVillaRequest request = ModifyVillaRequest.builder()
                .id(targetVilla.getId())
                .name(newName)
                .build();
        villaService.modifyVilla(request);

        // then
        Optional<Villa> findVilla = villaRepository.findById(targetVilla.getId());
        assertThat(findVilla.get().getName()).isEqualTo(newName);
    }


    @Test
    @DisplayName("빌라 삭제")
    void removeVilla() {
        // given
        Villa targetVilla = insertVilla();
        Long targetVillaId = targetVilla.getId();

        // when
        villaService.removeVilla(targetVillaId);

        // then
        Optional<Villa> findVilla = villaRepository.findById(targetVillaId);
        assertThat(findVilla.get().getActive()).isEqualTo(DISABLED);
    }


    private Villa insertVilla() {
        Villa villa = Villa.builder()
                .name("삼성 빌라")
                .address("광주 광산구 하남산단6번로 107")
                .idNumber("62218271")
                .totalCount(6)
                .active(ACTIVE)
                .build();
        return villaRepository.save(villa);
    }
}