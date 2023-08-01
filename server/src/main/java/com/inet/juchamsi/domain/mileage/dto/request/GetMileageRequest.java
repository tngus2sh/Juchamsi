package com.inet.juchamsi.domain.mileage.dto.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
public class GetMileageRequest {

    @NotBlank
    @ApiModelProperty(example = "userid")
    private String loginId;

    @Range(min = 1)
    @ApiModelProperty(example = "100")
    private int point;

    @NotBlank
    @Pattern(regexp = "적립|사용")
    private String type;

    @NotBlank
    private String description;


    public GetMileageRequest() {}

    @Builder
    public GetMileageRequest(String loginId, int point, String type, String description) {
        this.loginId = loginId;
        this.point = point;
        this.type = type;
        this.description = description;
    }

}
