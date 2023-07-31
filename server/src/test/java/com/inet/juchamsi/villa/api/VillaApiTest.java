package com.inet.juchamsi.villa.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inet.juchamsi.domain.villa.api.VillaApiController;
import com.inet.juchamsi.domain.villa.application.VillaService;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.dto.request.ModifyVillaRequest;
import com.inet.juchamsi.domain.villa.entity.Villa;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@DisplayName("villaApiController 테스트")
public class VillaApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    VillaApiController villaApiController;

    @Autowired
    VillaService villaService;

    @Autowired
    VillaRepository villaRepository;


    @Test
    @DisplayName("빌라 상세 조회")
    void showDetailVilla() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        Long targetVillaId = targetVilla.getId();

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.get("/villa/{villa_id}", targetVillaId));

        // then
        actions.andDo(print());
    }

    @Test
    @DisplayName("빌라 수정")
    void modifyVilla() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        String newName = "삼성 새 빌라";
        String object = objectMapper.writeValueAsString(ModifyVillaRequest.builder()
                .id(targetVilla.getId())
                .name(newName)
                .build());

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.put("/villa")
                .content(object)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("빌라 삭제")
    void removeVilla() throws Exception {
        // given
        Villa targetVilla = insertVilla();
        Long targetVillaId = targetVilla.getId();

        // when
        ResultActions actions = mockMvc.perform(MockMvcRequestBuilders.delete("/villa/{villa_id}", targetVillaId));

        // then
        actions.andDo(print())
                .andExpect(jsonPath("$.success").value(true));
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
