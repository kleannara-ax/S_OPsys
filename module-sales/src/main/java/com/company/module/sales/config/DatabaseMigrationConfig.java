package com.company.module.sales.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * 서버 시작 시 DB 컬럼 타입을 자동 보정.
 * Hibernate ddl-auto=update는 기존 컬럼 타입 변경을 하지 않으므로,
 * Long→Double 변경 후 BIGINT→DOUBLE 마이그레이션이 필요.
 */
@Slf4j
@Component
public class DatabaseMigrationConfig implements CommandLineRunner {

    private final DataSource dataSource;

    public DatabaseMigrationConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) {
        String[][] columns = {
            {"PLANT_STORAGE_LOCATION", "BEGINNING_INVENTORY"},
            {"PLANT_STORAGE_LOCATION", "AVAILABLE_INVENTORY"},
            {"PLANT_STORAGE_LOCATION", "AVAILABLE_STOCK"},
            {"PLANT_STORAGE_LOCATION", "CURRENT_STOCK"},
            {"SNOP_RECORD", "BEGINNING_INVENTORY"},
            {"SNOP_RECORD", "AVAILABLE_INVENTORY"},
        };

        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            Statement stmt = conn.createStatement();
            int altered = 0;

            for (String[] col : columns) {
                String table = col[0];
                String column = col[1];

                // 현재 컬럼 타입 확인
                try (ResultSet rs = meta.getColumns(null, null, table, column)) {
                    if (rs.next()) {
                        String typeName = rs.getString("TYPE_NAME").toUpperCase();
                        if (typeName.contains("BIGINT") || typeName.contains("INT")) {
                            String sql = "ALTER TABLE " + table + " MODIFY COLUMN " + column + " DOUBLE";
                            stmt.execute(sql);
                            altered++;
                            log.info("[DB-Migration] {} → DOUBLE 변경 완료: {}.{}", typeName, table, column);
                        }
                    }
                }
            }

            if (altered > 0) {
                log.info("[DB-Migration] 총 {}개 컬럼 DOUBLE 변경 완료", altered);
            } else {
                log.info("[DB-Migration] 변경 필요 컬럼 없음 (이미 DOUBLE)");
            }

        } catch (Exception e) {
            log.warn("[DB-Migration] 컬럼 타입 변경 실패 (수동 실행 필요): {}", e.getMessage());
        }
    }
}
