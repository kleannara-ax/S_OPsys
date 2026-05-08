package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_production_change_log")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class ProductionChangeLog extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "RECORD_ID")
    private String recordId;

    @Column(name = "ITEM_CODE", length = 50)
    private String itemCode;

    @Column(name = "ITEM_NAME", length = 200)
    private String itemName;

    @Column(name = "PLAN_MONTH", length = 7)
    private String planMonth;

    @Column(name = "PRODUCTION_LINE", length = 50)
    private String productionLine;

    @Column(name = "CHANGE_TYPE", length = 20)
    private String changeType;

    @Column(name = "PREVIOUS_PRODUCTION_PLAN")
    private Long previousProductionPlan;

    @Column(name = "NEW_PRODUCTION_PLAN")
    private Long newProductionPlan;

    @Column(name = "SALES_PLAN")
    private Long salesPlan;

    @Column(name = "BEGINNING_INVENTORY")
    private Long beginningInventory;

    @Column(name = "TARGET_ENDING_INVENTORY")
    private Long targetEndingInventory;

    @Column(name = "ENDING_INVENTORY")
    private Long endingInventory;

    @Column(name = "NOTE", length = 500)
    private String note;

    @Column(name = "CONFIRMED_AT")
    private String confirmedAt;

}
