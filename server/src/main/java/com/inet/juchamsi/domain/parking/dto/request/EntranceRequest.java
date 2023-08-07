package com.inet.juchamsi.domain.parking.dto.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class EntranceRequest {
    @NotBlank
    @ApiModelProperty(example = "")
    String macAddress;
    @NotBlank
    @ApiModelProperty(example = "")
    String groundAddress;
}
