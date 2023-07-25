package com.inet.juchamsi.domain.user.dto.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
public class SignupAdminRequest {
    
    @NotBlank
    @Pattern(regexp = "^[0-9]*$")
    @ApiModelProperty(example = "12")
    private Long villaId;
    private String phoneNumber;
    private String loginId;
    private String passsword;
    private String name;
    private String grade;
    private String carNumber;
    private int villaNumber;
    
}
