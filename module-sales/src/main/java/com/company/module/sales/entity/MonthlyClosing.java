package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_monthly_closing",
       indexes = {
           @Index(name = "idx_monthly_closing_month", columnList = "CLOSING_MONTH"),
           @Index(name = "idx_monthly_closing_item", columnList = "ITEM_CODE"),
           @Index(name = "idx_monthly_closing_hierarchy", columnList = "HIERARCHY_NAME")
       },
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_monthly_closing_item_month", columnNames = {"ITEM_CODE", "CLOSING_MONTH"})
       })
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class MonthlyClosing extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ITEM_CODE", length = 50)
    private String itemCode;

    @Column(name = "ITEM_NAME", length = 200)
    private String itemName;

    @Column(name = "HIERARCHY_NAME", length = 200)
    private String hierarchyName;

    @Column(name = "CLOSING_MONTH", length = 7)
    private String closingMonth;

    @Column(name = "ENDING_INVENTORY")
    private Long endingInventory;

    @Column(name = "PRODUCTION_ACTUAL")
    private Long productionActual;

    @Column(name = "SALES_ACTUAL")
    private Long salesActual;

    @Column(name = "UNIT", length = 20)
    private String unit;

    @Column(name = "NOTES", length = 500)
    private String notes;

}
