package com.inet.juchamsi.domain.user.dto.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
public class CreateTenantRequest {

    @NotBlank
    @Pattern(regexp = "^[0-9]*$")
    @ApiModelProperty(example = "62218271")
    private String villaIdNumber;

    @NotBlank
    @Size(min = 13, max = 13)
    @Pattern(regexp = "^01(?:0|1|[6-9])\\d{3,4}\\d{4}$")
    @ApiModelProperty(example = "01012345678")
    private String phoneNumber;

    @NotBlank
    @Size(min = 6, max = 15)
    @Pattern(regexp = "^[a-zA-Z0-9]*$")
    @ApiModelProperty(example = "userid")
    private String loginId;

    @NotBlank
    @Size(min = 8, max = 16)
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$")
    @ApiModelProperty(example = "juchamsi1234!")
    private String loginPassword;

    @NotBlank
    @Size(max = 20)
    @Pattern(regexp = "^[a-zA-Z가-힣]*$")
    @ApiModelProperty(example = "ju chamsi")
    private String name;

    @NotBlank
    @Size(max = 15)
    @Pattern(regexp = "^\\d{1,3}[가-힣]{1}\\d{4}$")
    @ApiModelProperty(example = "1가1234")
    private String carNumber;

    @NotBlank
    @Pattern(regexp = "^[0-9]*$")
    @ApiModelProperty(example = "101")
    private int villaNumber;


    public CreateTenantRequest() {}

    @Builder
    public CreateTenantRequest(String villaIdNumber, String phoneNumber, String loginId, String loginPassword, String name, String carNumber, int villaNumber) {
        this.villaIdNumber = villaIdNumber;
        this.phoneNumber = phoneNumber;
        this.loginId = loginId;
        this.loginPassword = loginPassword;
        this.name = name;
        this.carNumber = carNumber;
        this.villaNumber = villaNumber;
    }
}
