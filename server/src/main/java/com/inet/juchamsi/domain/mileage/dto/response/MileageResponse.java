package com.inet.juchamsi.domain.mileage.dto.response;

import com.inet.juchamsi.domain.user.entity.User;
import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class MileageResponse {
    private Long id;
    private int point;
    private String type;
    private String description;
    private LocalDateTime createDate;
    private LocalDateTime lastModifiedDate;


    public MileageResponse() {}

    @Builder
    public MileageResponse(Long id, int point, String type, String description, LocalDateTime createDate, LocalDateTime lastModifiedDate) {
        this.id = id;
        this.point = point;
        this.type = type;
        this.description = description;
        this.createDate = createDate;
        this.lastModifiedDate = lastModifiedDate;
    }
}
