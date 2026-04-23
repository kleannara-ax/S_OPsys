package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_material_linkage")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class MaterialLinkage extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "LEGACY_ITEM_CODE", length = 50)
    private String legacyItemCode;

    @Column(name = "LEGACY_ITEM_NAME", length = 200)
    private String legacyItemName;

    @Column(name = "RENEWAL_ITEM_CODE", length = 50)
    private String renewalItemCode;

    @Column(name = "RENEWAL_ITEM_NAME", length = 200)
    private String renewalItemName;

    @Column(name = "EFFECTIVE_MONTH", length = 7)
    private String effectiveMonth;

    @Column(name = "NOTE", length = 500)
    private String note;

}
