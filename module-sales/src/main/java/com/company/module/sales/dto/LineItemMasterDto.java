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
public class LineItemMasterDto {

    @Size(max = 50)
    private String itemCode;

    @Size(max = 50)
    private String productionLine;

    private Long hourlyThroughput;
}
