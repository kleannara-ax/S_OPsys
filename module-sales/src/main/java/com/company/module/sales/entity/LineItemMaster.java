package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_line_item_master")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class LineItemMaster extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ITEM_CODE", length = 50, unique = true)
    private String itemCode;

    @Column(name = "PRODUCTION_LINE", length = 50)
    private String productionLine;

    @Column(name = "HOURLY_THROUGHPUT")
    private Long hourlyThroughput;

}
