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
public class MaterialLinkageDto {

    @Size(max = 50)
    private String legacyItemCode;

    @Size(max = 200)
    private String legacyItemName;

    @Size(max = 50)
    private String renewalItemCode;

    @Size(max = 200)
    private String renewalItemName;

    @Size(max = 7)
    private String effectiveMonth;

    @Size(max = 500)
    private String note;
}
