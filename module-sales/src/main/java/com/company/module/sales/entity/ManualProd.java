package com.company.module.sales.entity;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 수작업 생산계획 엔티티.
 * 수작업 제품의 일별 생산계획 + 투입단품 환산수량을 관리한다.
 */
@Entity
@Table(name = "mod_sales_manual_prod",
       indexes = {
           @Index(name = "idx_manual_prod_plan_date", columnList = "PLAN_DATE"),
           @Index(name = "idx_manual_prod_product_code", columnList = "PRODUCT_CODE")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ManualProd extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 계획 일 (예: 2026-09-01) */
    @Column(name = "PLAN_DATE", length = 20)
    private String planDate;

    /** 생산라인 */
    @Column(name = "PRODUCTION_LINE", length = 100)
    private String productionLine;

    /** 구분 */
    @Column(name = "TYPE", length = 100)
    private String type;

    /** 구성 */
    @Column(name = "COMPOSITION", length = 100)
    private String composition;

    /** 수작업 제품 코드 */
    @Column(name = "PRODUCT_CODE", length = 50)
    private String productCode;

    /** 생산수량 */
    @Column(name = "PRODUCTION_QTY")
    private Double productionQty;

    /** 투입단품1 코드 */
    @Column(name = "INPUT_ITEM1_CODE", length = 50)
    private String inputItem1Code;

    /** 환산수량1 */
    @Column(name = "CONVERTED_QTY1")
    private Double convertedQty1;

    /** 투입단품2 코드 */
    @Column(name = "INPUT_ITEM2_CODE", length = 50)
    private String inputItem2Code;

    /** 환산수량2 */
    @Column(name = "CONVERTED_QTY2")
    private Double convertedQty2;

    /** 투입단품3 코드 */
    @Column(name = "INPUT_ITEM3_CODE", length = 50)
    private String inputItem3Code;

    /** 환산수량3 */
    @Column(name = "CONVERTED_QTY3")
    private Double convertedQty3;

    /** 투입단품4 코드 */
    @Column(name = "INPUT_ITEM4_CODE", length = 50)
    private String inputItem4Code;

    /** 환산수량4 */
    @Column(name = "CONVERTED_QTY4")
    private Double convertedQty4;

    /** 투입단품5 코드 */
    @Column(name = "INPUT_ITEM5_CODE", length = 50)
    private String inputItem5Code;

    /** 환산수량5 */
    @Column(name = "CONVERTED_QTY5")
    private Double convertedQty5;

    /** 투입단품6 코드 */
    @Column(name = "INPUT_ITEM6_CODE", length = 50)
    private String inputItem6Code;

    /** 환산수량6 */
    @Column(name = "CONVERTED_QTY6")
    private Double convertedQty6;

    /** 투입단품7 코드 */
    @Column(name = "INPUT_ITEM7_CODE", length = 50)
    private String inputItem7Code;

    /** 환산수량7 */
    @Column(name = "CONVERTED_QTY7")
    private Double convertedQty7;

    /** 투입단품8 코드 */
    @Column(name = "INPUT_ITEM8_CODE", length = 50)
    private String inputItem8Code;

    /** 환산수량8 */
    @Column(name = "CONVERTED_QTY8")
    private Double convertedQty8;

    /** 투입단품9 코드 */
    @Column(name = "INPUT_ITEM9_CODE", length = 50)
    private String inputItem9Code;

    /** 환산수량9 */
    @Column(name = "CONVERTED_QTY9")
    private Double convertedQty9;

    /** 투입단품10 코드 */
    @Column(name = "INPUT_ITEM10_CODE", length = 50)
    private String inputItem10Code;

    /** 환산수량10 */
    @Column(name = "CONVERTED_QTY10")
    private Double convertedQty10;

    /** 비고 */
    @Column(name = "REMARK", length = 500)
    private String remark;
}
