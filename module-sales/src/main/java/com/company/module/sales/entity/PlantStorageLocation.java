package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_plant_storage_location",
       indexes = {
           @Index(name = "idx_psl_plant_code", columnList = "PLANT_CODE"),
           @Index(name = "idx_psl_item_code", columnList = "ITEM_CODE"),
           @Index(name = "idx_psl_plan_month", columnList = "PLAN_MONTH")
       })
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class PlantStorageLocation extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "PLAN_MONTH", length = 10)
    private String planMonth;

    @Column(name = "ITEM_CODE", length = 50)
    private String itemCode;

    @Column(name = "PLANT_CODE", length = 10)
    private String plantCode;

    @Column(name = "PLANT_NAME", length = 50)
    private String plantName;

    @Column(name = "STORAGE_LOCATION", length = 20)
    private String storageLocation;

    @Column(name = "IS_SELECTED")
    @Builder.Default
    private Boolean isSelected = false;

    @Column(name = "STOCK_UNIT", length = 10)
    private String stockUnit;

    @Column(name = "BEGINNING_INVENTORY")
    private Long beginningInventory;

    @Column(name = "AVAILABLE_INVENTORY")
    private Long availableInventory;

    @Column(name = "AVAILABLE_STOCK")
    private Long availableStock;

    @Column(name = "CURRENT_STOCK")
    private Long currentStock;

    @Column(name = "SAP_SYNC_AT")
    private LocalDateTime sapSyncAt;

}
