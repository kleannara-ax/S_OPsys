package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_line_capa_plan")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class LineCapaPlan extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "LINE_CATEGORY", length = 100)
    private String lineCategory;

    @Column(name = "PRODUCTION_LINE", length = 50)
    private String productionLine;

    @Column(name = "PLAN_MONTH", length = 7)
    private String planMonth;

    @Column(name = "DAILY_CAPA", columnDefinition = "DOUBLE")
    private Double dailyCapa;

    @Column(name = "DAILY_OPERATING_HOURS", columnDefinition = "DOUBLE")
    private Double dailyOperatingHours;

    @Column(name = "PLANNED_OPERATING_DAYS")
    private Integer plannedOperatingDays;

    @Column(name = "COMPUTED_CAPA", columnDefinition = "DOUBLE")
    private Double computedCapa;

    @Column(name = "NOTE", length = 500)
    private String note;


    @Override
    protected void onPrePersist() {
        super.onPrePersist();
        computeTotalCapa();
    }

    @PreUpdate
    @Override
    protected void onPreUpdate() {
        super.onPreUpdate();
        computeTotalCapa();
    }

    public void computeTotalCapa() {
        if (dailyCapa != null && dailyOperatingHours != null && plannedOperatingDays != null) {
            this.computedCapa = Math.round(dailyCapa * dailyOperatingHours * plannedOperatingDays * 100.0) / 100.0;
        }
    }

}
