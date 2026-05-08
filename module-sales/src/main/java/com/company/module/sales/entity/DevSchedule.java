package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_dev_schedule")
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class DevSchedule extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "SCHEDULE_DATE", nullable = false)
    private LocalDate scheduleDate;

    @Column(name = "SCHEDULE_TIME")
    private LocalTime scheduleTime;

    @Column(name = "TITLE", nullable = false, length = 500)
    private String title;

    @Column(name = "DESCRIPTION", length = 2000)
    private String description;

    @Column(name = "CATEGORY", length = 100)
    private String category;

    @Column(name = "STATUS", length = 50)
    @Builder.Default
    private String status = "planned";

    @Column(name = "PRIORITY", length = 20)
    @Builder.Default
    private String priority = "medium";

    @Column(name = "ASSIGNEE", length = 200)
    private String assignee;

    @Column(name = "PROGRESS")
    @Builder.Default
    private Integer progress = 0;

    @Column(name = "NOTES", length = 2000)
    private String notes;

}
