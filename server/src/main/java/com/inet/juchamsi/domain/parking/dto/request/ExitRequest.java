package com.inet.juchamsi.domain.parking.dto.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ExitRequest {
    @NotBlank
    @ApiModelProperty(example = "")
    String macAddress;
}
