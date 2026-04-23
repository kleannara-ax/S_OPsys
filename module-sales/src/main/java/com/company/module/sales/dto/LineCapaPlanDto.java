package com.company.module.sales.dto;

import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LineCapaPlanDto {

    @Size(max = 100)
    private String lineCategory;

    @Size(max = 50)
    private String productionLine;

    @Size(max = 7)
    private String planMonth;

    private Double dailyCapa;
    private Double dailyOperatingHours;
    private Integer plannedOperatingDays;
    private Double computedCapa;

    @Size(max = 500)
    private String note;
}
