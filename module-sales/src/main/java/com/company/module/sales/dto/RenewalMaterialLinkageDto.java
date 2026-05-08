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
public class RenewalMaterialLinkageDto {

    @Size(max = 100)
    private String hierarchyName;

    @NotBlank(message = "기존 자재코드는 필수입니다")
    @Size(max = 50)
    private String legacyItemCode;

    @Size(max = 200)
    private String legacyItemName;

    @Size(max = 50)
    private String renewalItemCode1;
    @Size(max = 200)
    private String renewalItemName1;
    @Size(max = 50)
    private String renewalItemCode2;
    @Size(max = 200)
    private String renewalItemName2;
    @Size(max = 50)
    private String renewalItemCode3;
    @Size(max = 200)
    private String renewalItemName3;
    @Size(max = 50)
    private String renewalItemCode4;
    @Size(max = 200)
    private String renewalItemName4;
    @Size(max = 50)
    private String renewalItemCode5;
    @Size(max = 200)
    private String renewalItemName5;

    @Size(max = 7)
    private String effectiveMonth;

    @Size(max = 500)
    private String note;

    private Boolean isActive;
}
