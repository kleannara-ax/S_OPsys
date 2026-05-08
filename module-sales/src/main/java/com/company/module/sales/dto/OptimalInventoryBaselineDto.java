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
public class OptimalInventoryBaselineDto {

    @Size(max = 4)
    private String baseYear;

    @Size(max = 100)
    private String category;

    private Long optimalQuantity;

    @Size(max = 500)
    private String notes;
}
