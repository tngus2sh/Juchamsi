package com.inet.juchamsi.domain.parking.dto.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.time.LocalDateTime;

@Data
public class ParkingLotResponse {

    @Range(min = 1)
    @ApiModelProperty(example = "1")
    private Long id;

    @Range(min = 1)
    @ApiModelProperty(example = "1")
    private Long villaId;

    @Range(min = 1)
    @ApiModelProperty(example = "1")
    private int seatNumber;

    @NotBlank
    @Pattern(regexp = "FULL|EMPTY")
    @ApiModelProperty(example = "EMPTY")
    private String parkingFlag;

    @ApiModelProperty(example = "1")
    private int frontNumber;

    @ApiModelProperty(example = "1")
    private int backNumber;

    @ApiModelProperty(example = "2023-07-25T21:33:27.923222")
    private LocalDateTime createDate;

    @ApiModelProperty(example = "2023-07-25T21:33:27.923222")
    private LocalDateTime lastModifiedDate;


    @Builder
    public ParkingLotResponse(Long id, Long villaId, int seatNumber, String parkingFlag, int frontNumber, int backNumber, LocalDateTime createDate, LocalDateTime lastModifiedDate) {
        this.id = id;
        this.villaId = villaId;
        this.seatNumber = seatNumber;
        this.parkingFlag = parkingFlag;
        this.frontNumber = frontNumber;
        this.backNumber = backNumber;
        this.createDate = createDate;
        this.lastModifiedDate = lastModifiedDate;
    }
}
