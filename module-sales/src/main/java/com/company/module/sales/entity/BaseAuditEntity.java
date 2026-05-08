package com.company.module.sales.entity;

import com.company.module.sales.config.AuditEntityListener;
import javax.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * 감사(Audit) 공통 필드를 가지는 MappedSuperclass.
 * 모든 엔티티가 상속하여 CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT 를 자동 관리한다.
 */
@MappedSuperclass
@EntityListeners(AuditEntityListener.class)
@Getter
@NoArgsConstructor
@SuperBuilder
public abstract class BaseAuditEntity implements Auditable {

    @Column(name = "CREATED_BY", length = 50)
    private String createdBy;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_BY", length = 50)
    private String updatedBy;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    // Auditable 인터페이스 setter 구현 (AuditEntityListener 전용)
    @Override
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    @Override
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    @Override
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    @Override
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onPrePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdAt == null) this.createdAt = now;
        if (this.updatedAt == null) this.updatedAt = now;
    }

    @PreUpdate
    protected void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
