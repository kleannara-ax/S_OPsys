package com.company.module.sales.config;

import com.company.module.sales.entity.DataChangeHistory;
import com.company.module.sales.repository.DataChangeHistoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import javax.persistence.*;
import java.lang.reflect.Field;
import java.time.LocalDateTime;

/**
 * JPA EntityListener — @PostPersist / @PostUpdate 시점에
 * MOD_DATA_CHANGE_HISTORY 테이블에 변경 이력을 자동 기록한다.
 *
 * DataChangeHistory 엔티티 자체에 대해서는 이력을 남기지 않는다 (무한루프 방지).
 */
public class DataChangeHistoryListener {

    private static final ObjectMapper mapper = createMapper();

    private static ObjectMapper createMapper() {
        ObjectMapper om = new ObjectMapper();
        om.registerModule(new JavaTimeModule());
        om.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        om.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
        return om;
    }

    @PostPersist
    public void onPostPersist(Object entity) {
        if (entity instanceof DataChangeHistory) return;
        saveHistory(entity, "INSERT");
    }

    @PostUpdate
    public void onPostUpdate(Object entity) {
        if (entity instanceof DataChangeHistory) return;
        saveHistory(entity, "UPDATE");
    }

    private void saveHistory(Object entity, String changeType) {
        try {
            DataChangeHistoryRepository repo = SpringContextHolder.getBean(DataChangeHistoryRepository.class);
            if (repo == null) return; // 아직 Spring 컨텍스트가 초기화되지 않은 경우

            String tableName = resolveTableName(entity);
            String recordId = resolveRecordId(entity);
            String newValues = toJsonSafe(entity);
            String user = AuditUserContext.get();

            DataChangeHistory history = DataChangeHistory.builder()
                    .tableName(tableName)
                    .recordId(recordId != null ? recordId : "UNKNOWN")
                    .changeType(changeType)
                    .newValues(truncate(newValues, 4000))
                    .changedBy(user)
                    .changedAt(LocalDateTime.now())
                    .build();

            repo.save(history);
        } catch (Exception e) {
            // 이력 저장 실패가 원래 트랜잭션을 방해하지 않도록 로그만 남김
            System.err.println("[DataChangeHistoryListener] Failed to save history: " + e.getMessage());
        }
    }

    private String resolveTableName(Object entity) {
        Table tableAnn = entity.getClass().getAnnotation(Table.class);
        if (tableAnn != null && tableAnn.name() != null && !tableAnn.name().isEmpty()) {
            return tableAnn.name();
        }
        return entity.getClass().getSimpleName();
    }

    private String resolveRecordId(Object entity) {
        try {
            for (Field f : entity.getClass().getDeclaredFields()) {
                if (f.isAnnotationPresent(Id.class)) {
                    f.setAccessible(true);
                    Object val = f.get(entity);
                    return val != null ? val.toString() : null;
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

    private String toJsonSafe(Object entity) {
        try {
            return mapper.writeValueAsString(entity);
        } catch (Exception e) {
            return "{\"error\":\"" + e.getMessage() + "\"}";
        }
    }

    private String truncate(String s, int maxLen) {
        if (s == null) return null;
        return s.length() <= maxLen ? s : s.substring(0, maxLen);
    }
}
