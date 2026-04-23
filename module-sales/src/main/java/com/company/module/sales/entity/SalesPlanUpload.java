package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_plan_upload")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class SalesPlanUpload extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "PLAN_MONTH", length = 7)
    private String planMonth;

    @Column(name = "ITEM_CODE", length = 50)
    private String itemCode;

    @Column(name = "CHANNEL", length = 50)
    private String channel;

    @Column(name = "STANDARD_QUANTITY")
    private Long standardQuantity;

    @Column(name = "PROMOTION_QUANTITY")
    private Long promotionQuantity;

    @Column(name = "QUANTITY")
    private Long quantity;

    @Column(name = "NOTE", length = 500)
    private String note;

}
