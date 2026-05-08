-- ============================================================
-- module-sales: S&OP 생산계획 관리 모듈 시드 데이터
-- MariaDB 10.11+  |  CHARSET=utf8mb4
-- 실행 순서: 01_schema.sql → 02_seed_data.sql
-- 최종 수정: 2026-05-08
-- ============================================================

-- ────────────────────────────────────────────
-- 1. 사용자 시드 데이터
-- ────────────────────────────────────────────
INSERT IGNORE INTO mod_sales_user (USER_ID, USER_NAME, PASSWORD, EMAIL, DEPARTMENT, ROLE, IS_ACTIVE, CREATED_BY, CREATED_AT)
VALUES
    ('admin',   '관리자',     'admin1234', 'admin@company.com',   '시스템관리', 'ADMIN', 1, 'SYSTEM', NOW()),
    ('planner', '계획담당자', 'plan1234',  'planner@company.com', 'SCM기획',    'USER',  1, 'SYSTEM', NOW());

-- ────────────────────────────────────────────
-- 2. 인터페이스 마스터 시드 데이터 (SNOP_RFC_001 ~ 006)
-- ────────────────────────────────────────────
INSERT IGNORE INTO mod_sales_interface_master (INTERFACE_ID, INTERFACE_NAME, SENDER, RECEIVER, RFC_URL, RFC_PARAM, EXEC_COMMAND, CREATED_BY, CREATED_AT)
VALUES
    ('SNOP_RFC_001', '자재마스터',       'SAP', 'S&OP', '/sales-api/rfc/SNOP_RFC_001', '{"param":"A"}',  '/home/user/webapp/scripts/rfc/run_rfc_001.sh', 'SYSTEM', NOW()),
    ('SNOP_RFC_002', '일자별재고',       'SAP', 'S&OP', '/sales-api/rfc/SNOP_RFC_002', NULL,             '/home/user/webapp/scripts/rfc/run_rfc_002.sh', 'SYSTEM', NOW()),
    ('SNOP_RFC_003', '생산실적',         'SAP', 'S&OP', '/sales-api/rfc/SNOP_RFC_003', NULL,             '/home/user/webapp/scripts/rfc/run_rfc_003.sh', 'SYSTEM', NOW()),
    ('SNOP_RFC_004', '판매실적',         'SAP', 'S&OP', '/sales-api/rfc/SNOP_RFC_004', NULL,             '/home/user/webapp/scripts/rfc/run_rfc_004.sh', 'SYSTEM', NOW()),
    ('SNOP_RFC_005', '월말마감실적',     'SAP', 'S&OP', '/sales-api/rfc/SNOP_RFC_005', NULL,             '/home/user/webapp/scripts/rfc/run_rfc_005.sh', 'SYSTEM', NOW()),
    ('SNOP_RFC_006', '리뉴얼자재연결',   'SAP', 'S&OP', '/sales-api/rfc/SNOP_RFC_006', '{"param":"A"}',  '/home/user/webapp/scripts/rfc/run_rfc_006.sh', 'SYSTEM', NOW());

-- ────────────────────────────────────────────
-- 3. 인터페이스 수행관리 시드 데이터 (SNOP_RFC_001 ~ 006)
--    InterfaceSchedulerService 가 30초 주기로 NEXT_EXECUTION_AT 기준 수행
-- ────────────────────────────────────────────
INSERT IGNORE INTO mod_sales_interface_execution (INTERFACE_ID, INTERFACE_NAME, SCHEDULE_TYPE, EXECUTION_TIME, IS_ACTIVE, DESCRIPTION, NEXT_EXECUTION_AT, CREATED_BY, CREATED_AT)
VALUES
    ('SNOP_RFC_001', '자재마스터',       'DAILY', '06:00', 1, 'SAP 자재마스터 일일 동기화',       DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,  'SYSTEM', NOW()),
    ('SNOP_RFC_002', '일자별재고',       'DAILY', '06:00', 1, 'SAP 일자별재고 일일 동기화',       DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,  'SYSTEM', NOW()),
    ('SNOP_RFC_003', '생산실적',         'DAILY', '06:00', 1, 'SAP 생산실적 일일 동기화',         DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,  'SYSTEM', NOW()),
    ('SNOP_RFC_004', '판매실적',         'DAILY', '06:00', 1, 'SAP 판매실적 일일 동기화',         DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,  'SYSTEM', NOW()),
    ('SNOP_RFC_005', '월말마감실적',     'DAILY', '23:00', 1, 'SAP 월말마감실적 일일 동기화',     CURDATE() + INTERVAL 23 HOUR,                           'SYSTEM', NOW()),
    ('SNOP_RFC_006', '리뉴얼자재연결',   'DAILY', '07:00', 1, 'SAP 리뉴얼자재연결 일일 동기화',   DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,  'SYSTEM', NOW());

-- ────────────────────────────────────────────
-- 4. 플랜트 저장위치 시드 데이터
-- ────────────────────────────────────────────

-- P200 플랜트
INSERT IGNORE INTO mod_sales_plant_storage_location (PLANT_CODE, PLANT_NAME, STORAGE_LOCATION, IS_SELECTED, CREATED_BY, CREATED_AT)
VALUES
    ('P200', 'P200', '1100', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '1110', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '2000', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '2100', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '2999', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '3000', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '3100', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '3500', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '3800', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '3900', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '5100', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '6000', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '7300', 0, 'SYSTEM', NOW()),
    ('P200', 'P200', '7600', 0, 'SYSTEM', NOW());

-- P300 플랜트
INSERT IGNORE INTO mod_sales_plant_storage_location (PLANT_CODE, PLANT_NAME, STORAGE_LOCATION, IS_SELECTED, CREATED_BY, CREATED_AT)
VALUES
    ('P300', 'P300', '1200', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '1500', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '1600', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '1700', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '1900', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '2000', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '2300', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '2400', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '2500', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '2600', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '3000', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '3100', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '3900', 0, 'SYSTEM', NOW()),
    ('P300', 'P300', '5100', 0, 'SYSTEM', NOW());

-- P400 플랜트
INSERT IGNORE INTO mod_sales_plant_storage_location (PLANT_CODE, PLANT_NAME, STORAGE_LOCATION, IS_SELECTED, CREATED_BY, CREATED_AT)
VALUES
    ('P400', 'P400', '4100', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', '4200', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', '4300', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', '4400', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', '4500', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', '4700', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', '4800', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', '6001', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', '6003', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', '6005', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', 'B004', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', 'B007', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', 'B008', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', 'B009', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', 'B010', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', 'B011', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', 'B013', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', 'DELI', 0, 'SYSTEM', NOW()),
    ('P400', 'P400', 'S001', 0, 'SYSTEM', NOW());

-- P500 플랜트
INSERT IGNORE INTO mod_sales_plant_storage_location (PLANT_CODE, PLANT_NAME, STORAGE_LOCATION, IS_SELECTED, CREATED_BY, CREATED_AT)
VALUES
    ('P500', 'P500', '1200', 0, 'SYSTEM', NOW()),
    ('P500', 'P500', '1600', 0, 'SYSTEM', NOW()),
    ('P500', 'P500', '2200', 0, 'SYSTEM', NOW()),
    ('P500', 'P500', '5100', 0, 'SYSTEM', NOW()),
    ('P500', 'P500', '2500', 0, 'SYSTEM', NOW()),
    ('P500', 'P500', '3000', 0, 'SYSTEM', NOW()),
    ('P500', 'P500', '3100', 0, 'SYSTEM', NOW()),
    ('P500', 'P500', '3900', 0, 'SYSTEM', NOW()),
    ('P500', 'P500', '2000', 0, 'SYSTEM', NOW()),
    ('P500', 'P500', '7200', 0, 'SYSTEM', NOW());
