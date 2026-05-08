package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_snop_record")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class SnopRecord extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ITEM_CODE", length = 50)
    private String itemCode;

    @Column(name = "ITEM_NAME", length = 200)
    private String itemName;

    @Column(name = "CATEGORY", length = 100)
    private String category;

    @Column(name = "PRODUCTION_LINE", length = 50)
    private String productionLine;

    @Column(name = "PLANT_CODE", length = 10)
    private String plantCode;

    @Column(name = "VENDOR_NAME", length = 200)
    private String vendorName;

    @Column(name = "MOQ")
    private Long moq;

    @Column(name = "PLAN_MONTH", length = 7)
    private String planMonth;

    @Column(name = "SALES_PLAN")
    private Long salesPlan;

    @Column(name = "SALES_ACTUAL")
    private Long salesActual;

    @Column(name = "PRODUCTION_PLAN")
    private Long productionPlan;

    @Column(name = "PRODUCTION_ACTUAL")
    private Long productionActual;

    @Column(name = "PRODUCTION_REMAINING")
    private Long productionRemaining;

    @Column(name = "BEGINNING_INVENTORY")
    private Long beginningInventory;

    @Column(name = "AVAILABLE_INVENTORY")
    private Long availableInventory;

    @Column(name = "INVENTORY_UNIT", length = 10)
    private String inventoryUnit;

    @Column(name = "TARGET_ENDING_INVENTORY")
    private Long targetEndingInventory;

    @Column(name = "OPTIMAL_INVENTORY_2025")
    private Long optimalInventory;

    @Column(name = "CAPACITY_LIMIT")
    private Long capacityLimit;

    @Column(name = "MANUAL_INPUT_QUANTITY")
    private Long manualInputQuantity;

    @Column(name = "NOTES", length = 500)
    private String notes;

    @Column(name = "PRIORITY")
    private Integer priority;

}
