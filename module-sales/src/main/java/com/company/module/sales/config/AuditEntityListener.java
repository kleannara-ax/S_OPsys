package com.company.module.sales.config;

import com.company.module.sales.entity.Auditable;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import java.time.LocalDateTime;

/**
 * JPA EntityListener — @PrePersist / @PreUpdate 시점에
 * AuditUserContext의 사용자 정보를 created_by / updated_by에 자동 설정한다.
 */
public class AuditEntityListener {

    @PrePersist
    public void prePersist(Object entity) {
        if (entity instanceof Auditable) {
            Auditable auditable = (Auditable) entity;
            LocalDateTime now = LocalDateTime.now();
            auditable.setCreatedAt(now);
            auditable.setUpdatedAt(now);

            String user = AuditUserContext.get();
            if (user != null) {
                if (auditable.getCreatedBy() == null) {
                    auditable.setCreatedBy(user);
                }
                auditable.setUpdatedBy(user);
            }
        }
    }

    @PreUpdate
    public void preUpdate(Object entity) {
        if (entity instanceof Auditable) {
            Auditable auditable = (Auditable) entity;
            auditable.setUpdatedAt(LocalDateTime.now());

            String user = AuditUserContext.get();
            if (user != null) {
                auditable.setUpdatedBy(user);
            }
        }
    }
}
