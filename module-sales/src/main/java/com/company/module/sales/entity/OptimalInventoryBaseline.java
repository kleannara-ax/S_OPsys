package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_optimal_inventory_baseline")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class OptimalInventoryBaseline extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "BASE_YEAR", length = 4)
    private String baseYear;

    @Column(name = "CATEGORY", length = 100)
    private String category;

    @Column(name = "OPTIMAL_QUANTITY")
    private Long optimalQuantity;

    @Column(name = "NOTES", length = 500)
    private String notes;

}
