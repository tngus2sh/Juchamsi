package com.inet.juchamsi.domain.villa.dto.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
public class CreateVillaRequest {

    @NotBlank
    @Size(max = 100)
    @Pattern(regexp = "^[a-zA-Z0-9가-힣.,-/(/)]*$")
    @ApiModelProperty(example = "삼성 빌라")
    private String name;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9가-힣.,-/(/)]*$")
    @ApiModelProperty(example = "광주 광산구 하남산단6번로 107")
    private String address;

    @NotBlank
    @Pattern(regexp = "^[0-9]*$")
    @ApiModelProperty(example = "62218271")
    private String idNumber;

    @Range(min = 1)
    @ApiModelProperty(example = "6")
    private int totalCount;


    @Builder
    public CreateVillaRequest(String name, String address, String idNumber, int totalCount) {
        this.name = name;
        this.address = address;
        this.idNumber = idNumber;
        this.totalCount = totalCount;
    }
}