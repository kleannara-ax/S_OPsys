package com.company.module.sales.entity;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 카테고리 내 자재 정렬 순서를 관리하는 엔티티.
 * (category, item_code)가 UK 이며, sort_order 값이 낮을수록 위에 표시됨.
 * 월(month)과 무관하게 순서가 유지되므로 월이 바뀌어도 정렬이 보존됨.
 */
@Entity
@Table(name = "mod_sales_item_sort_order",
       uniqueConstraints = @UniqueConstraint(
           name = "UK_ITEM_SORT_ORDER",
           columnNames = {"CATEGORY", "ITEM_CODE"}))
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class ItemSortOrder extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "CATEGORY", nullable = false, length = 100)
    private String category;

    @Column(name = "ITEM_CODE", nullable = false, length = 50)
    private String itemCode;

    @Column(name = "SORT_ORDER", nullable = false)
    private Integer sortOrder;

}
