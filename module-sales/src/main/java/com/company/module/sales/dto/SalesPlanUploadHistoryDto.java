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
public class SalesPlanUploadHistoryDto {

    @Size(max = 7)
    private String planMonth;

    @Size(max = 50)
    private String itemCode;

    @Size(max = 50)
    private String channel;

    private Long quantity;
    private Long standardQuantity;
    private Long promotionQuantity;

    @Size(max = 50)
    private String uploadType;

    @Size(max = 500)
    private String uploadReference;

    @Size(max = 500)
    private String note;

    private Long previousQuantity;
    private Long previousStandardQuantity;
    private Long previousPromotionQuantity;

    @Size(max = 500)
    private String previousNote;

    @Size(max = 50)
    private String action;

    @Size(max = 50)
    private String targetRecordId;
}
