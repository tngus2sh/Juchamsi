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
    private String roadAddress;

    @NotBlank
    @ApiModelProperty(example = "오선동 271")
    private String regionAddress;

    @NotBlank
    @Pattern(regexp = "^[0-9]+$")
    @ApiModelProperty(example = "62218")
    private String roadZipCode;

    @Range(min = 1)
    @ApiModelProperty(example = "6")
    private int totalCount;


    public CreateVillaRequest() {}

    @Builder
    public CreateVillaRequest(String name, String roadAddress, String regionAddress, String roadZipCode, int totalCount) {
        this.name = name;
        this.roadAddress = roadAddress;
        this.regionAddress = regionAddress;
        this.roadZipCode = roadZipCode;
        this.totalCount = totalCount;
    }
}