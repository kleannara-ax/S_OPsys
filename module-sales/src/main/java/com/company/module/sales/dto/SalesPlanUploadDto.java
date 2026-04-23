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
public class SalesPlanUploadDto {

    @Size(max = 7)
    private String planMonth;

    @Size(max = 50)
    private String itemCode;

    @Size(max = 50)
    private String channel;

    private Long standardQuantity;
    private Long promotionQuantity;
    private Long quantity;

    @Size(max = 500)
    private String note;
}
