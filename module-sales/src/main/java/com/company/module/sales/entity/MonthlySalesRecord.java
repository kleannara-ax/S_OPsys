package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_monthly_sales_record",
       indexes = {
           @Index(name = "idx_msr_closing_month", columnList = "CLOSING_MONTH"),
           @Index(name = "idx_msr_item_code", columnList = "ITEM_CODE"),
           @Index(name = "idx_msr_hierarchy", columnList = "HIERARCHY_NAME")
       },
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_msr_item_month", columnNames = {"ITEM_CODE", "CLOSING_MONTH"})
       })
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class MonthlySalesRecord extends BaseAuditEntity {

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

    @Column(name = "SALES_ACTUAL")
    private Long salesActual;

    @Column(name = "UNIT", length = 20)
    private String unit;

    /** 데이터 출처: RFC005 / UPLOAD */
    @Column(name = "SOURCE", length = 20)
    private String source;

}
