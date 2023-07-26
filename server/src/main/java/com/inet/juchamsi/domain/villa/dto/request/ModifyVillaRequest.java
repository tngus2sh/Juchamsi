package com.inet.juchamsi.domain.villa.dto.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
public class ModifyVillaRequest {

    @Range(min = 1)
    @ApiModelProperty(example = "1")
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Pattern(regexp = "^[a-zA-Z0-9가-힣.,-/(/)]*$")
    @ApiModelProperty(example = "삼성 빌라")
    private String name;



    public ModifyVillaRequest() {}

    @Builder
    public ModifyVillaRequest(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
