package com.company.module.sales.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemSortOrderDto {

    @NotBlank
    @Size(max = 100)
    private String category;

    @NotBlank
    @Size(max = 50)
    private String itemCode;

    @NotNull
    private Integer sortOrder;

}
