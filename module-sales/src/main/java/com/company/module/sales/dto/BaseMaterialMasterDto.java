package com.company.module.sales.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaseMaterialMasterDto {

    @Size(max = 100)
    private String scmArea;

    @Size(max = 200)
    private String hierarchyName;

    @Size(max = 100)
    private String productionUnit;

    @NotBlank(message = "자재코드는 필수입니다")
    @Size(max = 50)
    private String itemCode;

    @Size(max = 200)
    private String itemName;

    private Double conversion1;
    private Double conversion2;
    private Double conversion3;
    private Double conversion5;
    private Double conversionRatio;

    @Size(max = 200)
    private String vendorName;

    private Long moq;
}
