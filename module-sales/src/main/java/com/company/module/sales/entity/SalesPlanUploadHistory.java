package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_plan_upload_history")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class SalesPlanUploadHistory extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "PLAN_MONTH", length = 7)
    private String planMonth;

    @Column(name = "ITEM_CODE", length = 50)
    private String itemCode;

    @Column(name = "CHANNEL", length = 50)
    private String channel;

    @Column(name = "QUANTITY")
    private Long quantity;

    @Column(name = "STANDARD_QUANTITY")
    private Long standardQuantity;

    @Column(name = "PROMOTION_QUANTITY")
    private Long promotionQuantity;

    @Column(name = "UPLOAD_TYPE", length = 50)
    private String uploadType;

    @Column(name = "UPLOAD_REFERENCE", length = 500)
    private String uploadReference;

    @Column(name = "NOTE", length = 500)
    private String note;

    @Column(name = "PREVIOUS_QUANTITY")
    private Long previousQuantity;

    @Column(name = "PREVIOUS_STANDARD_QUANTITY")
    private Long previousStandardQuantity;

    @Column(name = "PREVIOUS_PROMOTION_QUANTITY")
    private Long previousPromotionQuantity;

    @Column(name = "PREVIOUS_NOTE", length = 500)
    private String previousNote;

    @Column(name = "ACTION", length = 50)
    private String action;

    @Column(name = "TARGET_RECORD_ID", length = 50)
    private String targetRecordId;

}
