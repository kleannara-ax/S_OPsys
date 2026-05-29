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
public class SnopRecordDto {

    @NotBlank(message = "자재코드는 필수입니다")
    @Size(max = 50)
    private String itemCode;

    @Size(max = 200)
    private String itemName;

    @Size(max = 100)
    private String category;

    @Size(max = 50)
    private String productionLine;

    @Size(max = 10)
    private String plantCode;

    @Size(max = 200)
    private String vendorName;

    private Long moq;

    @NotBlank(message = "계획월은 필수입니다")
    @Size(max = 7)
    private String planMonth;

    private Long salesPlan;
    private Long salesActual;
    private Long productionPlan;
    private Long productionActual;
    private Long productionRemaining;
    private Double beginningInventory;
    private Double availableInventory;

    @Size(max = 10)
    private String inventoryUnit;

    private Long targetEndingInventory;
    private Long optimalInventory;
    private Long capacityLimit;
    private Long manualInputQuantity;

    @Size(max = 500)
    private String notes;

    private Integer priority;
}
