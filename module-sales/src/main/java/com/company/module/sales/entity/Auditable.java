package com.company.module.sales.entity;

import java.time.LocalDateTime;

/**
 * 감사(Audit) 필드를 가지는 엔티티가 구현하는 인터페이스.
 * AuditEntityListener가 이 인터페이스를 통해 created_by / updated_by를 자동 설정한다.
 */
public interface Auditable {
    String getCreatedBy();
    void setCreatedBy(String createdBy);

    String getUpdatedBy();
    void setUpdatedBy(String updatedBy);

    LocalDateTime getCreatedAt();
    void setCreatedAt(LocalDateTime createdAt);

    LocalDateTime getUpdatedAt();
    void setUpdatedAt(LocalDateTime updatedAt);
}
