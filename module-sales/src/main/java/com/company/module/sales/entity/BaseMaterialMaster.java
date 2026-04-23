package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_base_material_master",
       indexes = {
           @Index(name = "idx_base_mat_scm_area", columnList = "SCM_AREA"),
           @Index(name = "idx_base_mat_item_code", columnList = "ITEM_CODE")
       })
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class BaseMaterialMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "SCM_AREA", length = 100)
    private String scmArea;

    @Column(name = "HIERARCHY_NAME", length = 200)
    private String hierarchyName;

    @Column(name = "PRODUCTION_UNIT", length = 100)
    private String productionUnit;

    @Column(name = "ITEM_CODE", length = 50)
    private String itemCode;

    @Column(name = "ITEM_NAME", length = 200)
    private String itemName;

    @Column(name = "CONVERSION1")
    private Double conversion1;

    @Column(name = "CONVERSION2")
    private Double conversion2;

    @Column(name = "CONVERSION3")
    private Double conversion3;

    @Column(name = "CONVERSION5")
    private Double conversion5;

    @Column(name = "CONVERSION_RATIO")
    private Double conversionRatio;

    @Column(name = "VENDOR_NAME", length = 200)
    private String vendorName;

    @Column(name = "MOQ")
    private Long moq;


    @Override
    protected void onPrePersist() {
        super.onPrePersist();
        computeRatio();
    }

    @PreUpdate
    @Override
    protected void onPreUpdate() {
        super.onPreUpdate();
        computeRatio();
    }

    private void computeRatio() {
        if (this.conversion3 != null && this.conversion3 != 0 && this.conversion5 != null) {
            this.conversionRatio = Math.round((this.conversion5 / this.conversion3) * 1000.0) / 1000.0;
        } else {
            this.conversionRatio = null;
        }
    }

}
