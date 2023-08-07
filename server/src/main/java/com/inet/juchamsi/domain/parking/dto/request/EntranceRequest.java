package com.inet.juchamsi.domain.parking.dto.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
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
    
    @Builder
    public EntranceRequest(String macAddress, String groundAddress) {
        this.macAddress = macAddress;
        this.groundAddress = groundAddress;
    }
}
