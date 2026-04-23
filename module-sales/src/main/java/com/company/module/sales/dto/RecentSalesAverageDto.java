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
public class RecentSalesAverageDto {

    @Size(max = 7)
    private String baseMonth;

    @Size(max = 50)
    private String itemCode;

    private Long m3;
    private Long m2;
    private Long m1;
    private Long total;
    private Long average;

    @Size(max = 500)
    private String note;
}
