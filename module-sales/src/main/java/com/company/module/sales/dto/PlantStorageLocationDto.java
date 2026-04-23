package com.company.module.sales.dto;

import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlantStorageLocationDto {

    @Size(max = 10)
    private String planMonth;

    @Size(max = 50)
    private String itemCode;

    @Size(max = 10)
    private String plantCode;

    @Size(max = 50)
    private String plantName;

    @Size(max = 20)
    private String storageLocation;

    private Boolean isSelected;

    @Size(max = 10)
    private String stockUnit;

    private Long beginningInventory;
    private Long availableInventory;
    private Long availableStock;
    private Long currentStock;
    private LocalDateTime sapSyncAt;
}
