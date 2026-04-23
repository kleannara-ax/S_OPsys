package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_interface_execution",
       indexes = {
           @Index(name = "idx_if_exec_if_id", columnList = "INTERFACE_ID")
       })
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class InterfaceExecution extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "INTERFACE_ID", length = 30, nullable = false)
    private String interfaceId;

    @Column(name = "INTERFACE_NAME", length = 200)
    private String interfaceName;

    @Column(name = "SCHEDULE_TYPE", length = 20, nullable = false)
    private String scheduleType;

    @Column(name = "EXECUTION_TIME", length = 10)
    private String executionTime;

    @Column(name = "INTERVAL_MINUTES")
    private Integer intervalMinutes;

    @Column(name = "CRON_EXPRESSION", length = 100)
    private String cronExpression;

    @Column(name = "IS_ACTIVE")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "LAST_EXECUTED_AT")
    private LocalDateTime lastExecutedAt;

    @Column(name = "NEXT_EXECUTION_AT")
    private LocalDateTime nextExecutionAt;

    @Column(name = "DESCRIPTION", length = 500)
    private String description;

}
