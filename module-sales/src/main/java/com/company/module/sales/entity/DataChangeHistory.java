package com.company.module.sales.entity;

import javax.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * 데이터 변경 이력 테이블.
 * 모든 엔티티의 INSERT / UPDATE 시 자동으로 이력이 기록된다.
 */
@Entity
@Table(name = "mod_data_change_history",
       indexes = {
           @Index(name = "idx_dch_table", columnList = "TABLE_NAME"),
           @Index(name = "idx_dch_record", columnList = "RECORD_ID"),
           @Index(name = "idx_dch_user", columnList = "CHANGED_BY"),
           @Index(name = "idx_dch_time", columnList = "CHANGED_AT")
       })
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataChangeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TABLE_NAME", length = 100, nullable = false)
    private String tableName;

    @Column(name = "RECORD_ID", length = 50, nullable = false)
    private String recordId;

    @Column(name = "CHANGE_TYPE", length = 10, nullable = false)
    private String changeType;

    @Column(name = "CHANGED_FIELDS", columnDefinition = "TEXT")
    private String changedFields;

    @Column(name = "OLD_VALUES", columnDefinition = "TEXT")
    private String oldValues;

    @Column(name = "NEW_VALUES", columnDefinition = "TEXT")
    private String newValues;

    @Column(name = "CHANGED_BY", length = 50)
    private String changedBy;

    @Column(name = "CHANGED_AT", nullable = false)
    private LocalDateTime changedAt;

    @PrePersist
    protected void onCreate() {
        if (this.changedAt == null) {
            this.changedAt = LocalDateTime.now();
        }
    }
}
