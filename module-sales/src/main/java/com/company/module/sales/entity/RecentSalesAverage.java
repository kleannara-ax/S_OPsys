package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_recent_sales_average")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class RecentSalesAverage extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "BASE_MONTH", length = 7)
    private String baseMonth;

    @Column(name = "ITEM_CODE", length = 50)
    private String itemCode;

    @Column(name = "M3")
    private Long m3;

    @Column(name = "M2")
    private Long m2;

    @Column(name = "M1")
    private Long m1;

    @Column(name = "TOTAL")
    private Long total;

    @Column(name = "AVERAGE")
    private Long average;

    @Column(name = "NOTE", length = 500)
    private String note;


    @Override
    protected void onPrePersist() {
        computeAverage();
        super.onPrePersist();
    }

    @PreUpdate
    @Override
    protected void onPreUpdate() {
        computeAverage();
        super.onPreUpdate();
    }

    public void computeAverage() {
        long v3 = m3 != null ? m3 : 0L;
        long v2 = m2 != null ? m2 : 0L;
        long v1 = m1 != null ? m1 : 0L;
        this.total = v3 + v2 + v1;
        this.average = Math.round(this.total / 3.0);
    }

}
