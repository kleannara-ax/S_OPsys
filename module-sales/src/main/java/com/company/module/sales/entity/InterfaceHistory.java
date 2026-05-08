package com.company.module.sales.entity;

import com.company.module.sales.config.DataChangeHistoryListener;
import javax.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "mod_sales_interface_history",
       indexes = {
           @Index(name = "idx_if_hist_if_id", columnList = "INTERFACE_ID"),
           @Index(name = "idx_if_hist_status", columnList = "STATUS"),
           @Index(name = "idx_if_hist_start", columnList = "START_TIME")
       })
@EntityListeners({DataChangeHistoryListener.class})
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class InterfaceHistory extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "INTERFACE_ID", length = 30, nullable = false)
    private String interfaceId;

    @Column(name = "INTERFACE_NAME", length = 200)
    private String interfaceName;

    @Column(name = "EXECUTION_TYPE", length = 20)
    private String executionType;

    @Column(name = "START_TIME")
    private LocalDateTime startTime;

    @Column(name = "END_TIME")
    private LocalDateTime endTime;

    @Column(name = "DURATION_MS")
    private Long durationMs;

    @Column(name = "PROCESSED_COUNT")
    private Integer processedCount;

    @Column(name = "ERROR_COUNT")
    private Integer errorCount;

    @Column(name = "STATUS", length = 20, nullable = false)
    private String status;

    @Column(name = "ERROR_MESSAGE", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "EXEC_COMMAND", columnDefinition = "TEXT")
    private String execCommand;

    @Column(name = "RETRY_OF_ID")
    private Long retryOfId;

}
