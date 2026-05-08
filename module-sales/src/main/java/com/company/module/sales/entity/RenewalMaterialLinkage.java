package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_renewal_material_linkage",
       indexes = {
           @Index(name = "idx_renewal_linkage_legacy_code", columnList = "LEGACY_ITEM_CODE"),
           @Index(name = "idx_renewal_linkage_renewal1_code", columnList = "RENEWAL_ITEM_CODE_1"),
           @Index(name = "idx_renewal_linkage_renewal2_code", columnList = "RENEWAL_ITEM_CODE_2"),
           @Index(name = "idx_renewal_linkage_renewal3_code", columnList = "RENEWAL_ITEM_CODE_3"),
           @Index(name = "idx_renewal_linkage_renewal4_code", columnList = "RENEWAL_ITEM_CODE_4"),
           @Index(name = "idx_renewal_linkage_renewal5_code", columnList = "RENEWAL_ITEM_CODE_5"),
           @Index(name = "idx_renewal_linkage_hierarchy", columnList = "HIERARCHY_NAME")
       })
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class RenewalMaterialLinkage extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "HIERARCHY_NAME", length = 100)
    private String hierarchyName;

    @Column(name = "LEGACY_ITEM_CODE", length = 50, nullable = false)
    private String legacyItemCode;

    @Column(name = "LEGACY_ITEM_NAME", length = 200)
    private String legacyItemName;

    @Column(name = "RENEWAL_ITEM_CODE_1", length = 50)
    private String renewalItemCode1;

    @Column(name = "RENEWAL_ITEM_NAME_1", length = 200)
    private String renewalItemName1;

    @Column(name = "RENEWAL_ITEM_CODE_2", length = 50)
    private String renewalItemCode2;

    @Column(name = "RENEWAL_ITEM_NAME_2", length = 200)
    private String renewalItemName2;

    @Column(name = "RENEWAL_ITEM_CODE_3", length = 50)
    private String renewalItemCode3;

    @Column(name = "RENEWAL_ITEM_NAME_3", length = 200)
    private String renewalItemName3;

    @Column(name = "RENEWAL_ITEM_CODE_4", length = 50)
    private String renewalItemCode4;

    @Column(name = "RENEWAL_ITEM_NAME_4", length = 200)
    private String renewalItemName4;

    @Column(name = "RENEWAL_ITEM_CODE_5", length = 50)
    private String renewalItemCode5;

    @Column(name = "RENEWAL_ITEM_NAME_5", length = 200)
    private String renewalItemName5;

    @Column(name = "EFFECTIVE_MONTH", length = 7)
    private String effectiveMonth;

    @Column(name = "NOTE", length = 500)
    private String note;

    @Column(name = "IS_ACTIVE", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

}
