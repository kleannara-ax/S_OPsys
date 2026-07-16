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
public class MonthlySalesRecordDto {

    @Size(max = 50)
    private String itemCode;

    @Size(max = 200)
    private String itemName;

    @Size(max = 200)
    private String hierarchyName;

    @Size(max = 7)
    private String closingMonth;

    private Long salesActual;

    @Size(max = 20)
    private String unit;

    @Size(max = 20)
    private String source;

}
