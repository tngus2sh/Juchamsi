package com.inet.juchamsi.domain.villa.dto.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
public class VillaResponse {

    @Range(min = 1)
    @ApiModelProperty(example = "1")
    private Long id;

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

    @ApiModelProperty(example = "2023-07-25T21:33:27.923222")
    private LocalDateTime createDate;

    @ApiModelProperty(example = "2023-07-25T21:33:27.923222")
    private LocalDateTime lastModifiedDate;


    @Builder
    public VillaResponse(Long id, String name, String address, String idNumber, int totalCount, LocalDateTime createDate, LocalDateTime lastModifiedDate) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.idNumber = idNumber;
        this.totalCount = totalCount;
        this.createDate = createDate;
        this.lastModifiedDate = lastModifiedDate;
    }
}
