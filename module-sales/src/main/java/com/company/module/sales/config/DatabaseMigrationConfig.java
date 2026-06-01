package com.company.module.sales.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

/**
 * DB 스키마 마이그레이션
 * Hibernate ddl-auto=update는 기존 컬럼의 타입 변경(BIGINT→DOUBLE)을 하지 않으므로
 * 서버 시작 시 수동으로 ALTER TABLE 실행
 */
@Component
@Slf4j
public class DatabaseMigrationConfig implements ApplicationRunner {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        migrateInventoryColumnsToDouble();
    }

    /**
     * 재고 관련 컬럼을 BIGINT → DOUBLE로 변경
     * Long → Double 엔티티 타입 변경에 맞춰 DB 컬럼도 변경
     * 이미 DOUBLE이면 무시됨 (MariaDB는 MODIFY 시 같은 타입이면 에러 안 남)
     */
    private void migrateInventoryColumnsToDouble() {
        String[][] alterStatements = {
            // PlantStorageLocation 테이블
            {"mod_sales_plant_storage_location", "BEGINNING_INVENTORY", "DOUBLE"},
            {"mod_sales_plant_storage_location", "AVAILABLE_INVENTORY", "DOUBLE"},
            {"mod_sales_plant_storage_location", "AVAILABLE_STOCK", "DOUBLE"},
            {"mod_sales_plant_storage_location", "CURRENT_STOCK", "DOUBLE"},
            // SnopRecord 테이블
            {"mod_sales_snop_record", "BEGINNING_INVENTORY", "DOUBLE"},
            {"mod_sales_snop_record", "AVAILABLE_INVENTORY", "DOUBLE"},
        };

        int successCount = 0;
        for (String[] stmt : alterStatements) {
            String table = stmt[0];
            String column = stmt[1];
            String type = stmt[2];
            try {
                String sql = "ALTER TABLE " + table + " MODIFY COLUMN " + column + " " + type;
                entityManager.createNativeQuery(sql).executeUpdate();
                successCount++;
                log.info("[Migration] {} .{} → {} 변경 완료", table, column, type);
            } catch (Exception e) {
                log.warn("[Migration] {} .{} 변경 실패 (무시): {}", table, column, e.getMessage());
            }
        }

        if (successCount > 0) {
            log.info("[Migration] 재고 컬럼 타입 마이그레이션 완료: {}건 성공", successCount);
        }
    }
}
