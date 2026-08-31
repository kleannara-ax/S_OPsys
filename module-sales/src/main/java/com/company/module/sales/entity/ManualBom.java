package com.company.module.sales.entity;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 수작업 BOM (Bill of Materials) 엔티티.
 * 수작업 제품의 투입 단품 구성 정보를 관리한다.
 */
@Entity
@Table(name = "mod_sales_manual_bom",
       indexes = {
           @Index(name = "idx_manual_bom_product_code", columnList = "PRODUCT_CODE"),
           @Index(name = "idx_manual_bom_type", columnList = "TYPE")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ManualBom extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 구분 (예: 세제, 유연제 등) */
    @Column(name = "TYPE", length = 100)
    private String type;

    /** 구성 (예: 단품, 세트 등) */
    @Column(name = "COMPOSITION", length = 100)
    private String composition;

    /** 수작업 제품 코드 */
    @Column(name = "PRODUCT_CODE", length = 50)
    private String productCode;

    /** 투입단품1 코드 */
    @Column(name = "INPUT_ITEM1_CODE", length = 50)
    private String inputItem1Code;

    /** 투입량1 */
    @Column(name = "INPUT_QTY1")
    private Double inputQty1;

    /** 투입단품2 코드 */
    @Column(name = "INPUT_ITEM2_CODE", length = 50)
    private String inputItem2Code;

    /** 투입량2 */
    @Column(name = "INPUT_QTY2")
    private Double inputQty2;

    /** 투입단품3 코드 */
    @Column(name = "INPUT_ITEM3_CODE", length = 50)
    private String inputItem3Code;

    /** 투입량3 */
    @Column(name = "INPUT_QTY3")
    private Double inputQty3;

    /** 투입단품4 코드 */
    @Column(name = "INPUT_ITEM4_CODE", length = 50)
    private String inputItem4Code;

    /** 투입량4 */
    @Column(name = "INPUT_QTY4")
    private Double inputQty4;
}
