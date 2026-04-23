-- ============================================================
-- module-sales: S&OP 생산계획 관리 모듈 DDL
-- MariaDB 10.11+  |  ENGINE=InnoDB  |  CHARSET=utf8mb4
-- 실행 순서: 01_schema.sql → 02_seed_data.sql
-- ============================================================

-- 1. 데이터 변경 이력
CREATE TABLE IF NOT EXISTS mod_data_change_history (
    id              BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    TABLE_NAME      VARCHAR(100) NOT NULL                COMMENT '변경 테이블명',
    RECORD_ID       VARCHAR(50)  NOT NULL                COMMENT '변경 레코드 PK',
    CHANGE_TYPE     VARCHAR(10)  NOT NULL                COMMENT '변경유형 (INSERT/UPDATE)',
    CHANGED_FIELDS  TEXT                                 COMMENT '변경 필드목록',
    OLD_VALUES      TEXT                                 COMMENT '변경 전 JSON',
    NEW_VALUES      TEXT                                 COMMENT '변경 후 JSON',
    CHANGED_BY      VARCHAR(50)                          COMMENT '변경자',
    CHANGED_AT      DATETIME     NOT NULL                COMMENT '변경일시',
    PRIMARY KEY (id),
    INDEX idx_dch_table   (TABLE_NAME),
    INDEX idx_dch_record  (RECORD_ID),
    INDEX idx_dch_user    (CHANGED_BY),
    INDEX idx_dch_time    (CHANGED_AT)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='데이터 변경 이력';

-- 2. 사용자
CREATE TABLE IF NOT EXISTS mod_sales_user (
    id              BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    USER_ID         VARCHAR(50)  NOT NULL                COMMENT '사용자 ID',
    USER_NAME       VARCHAR(100) NOT NULL                COMMENT '사용자명',
    PASSWORD        VARCHAR(200) NOT NULL                COMMENT '비밀번호',
    EMAIL           VARCHAR(200)                         COMMENT '이메일',
    DEPARTMENT      VARCHAR(100)                         COMMENT '부서',
    ROLE            VARCHAR(20)  NOT NULL DEFAULT 'USER' COMMENT '권한 (ADMIN/USER)',
    IS_ACTIVE       TINYINT(1)   DEFAULT 1               COMMENT '활성여부',
    LAST_LOGIN_AT   DATETIME                             COMMENT '최종 로그인',
    CREATED_BY      VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT      DATETIME                             COMMENT '등록일시',
    UPDATED_BY      VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT      DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_id (USER_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자';

-- 3. 기준 자재 마스터
CREATE TABLE IF NOT EXISTS mod_sales_base_material_master (
    id               BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    SCM_AREA         VARCHAR(100)                         COMMENT 'SCM 영역',
    HIERARCHY_NAME   VARCHAR(200)                         COMMENT '계층명(카테고리)',
    PRODUCTION_UNIT  VARCHAR(100)                         COMMENT '생산단위',
    ITEM_CODE        VARCHAR(50)                          COMMENT '자재코드',
    ITEM_NAME        VARCHAR(200)                         COMMENT '자재명',
    CONVERSION1      DOUBLE                               COMMENT '환산계수1',
    CONVERSION2      DOUBLE                               COMMENT '환산계수2',
    CONVERSION3      DOUBLE                               COMMENT '환산계수3',
    CONVERSION5      DOUBLE                               COMMENT '환산계수5',
    CONVERSION_RATIO DOUBLE                               COMMENT '환산비율 (자동계산)',
    VENDOR_NAME      VARCHAR(200)                         COMMENT '거래처명',
    MOQ              BIGINT                               COMMENT '최소주문수량',
    CREATED_BY       VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT       DATETIME                             COMMENT '등록일시',
    UPDATED_BY       VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT       DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id),
    INDEX idx_base_mat_scm_area  (SCM_AREA),
    INDEX idx_base_mat_item_code (ITEM_CODE)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='기준 자재 마스터';

-- 4. S&OP 생산계획 레코드
CREATE TABLE IF NOT EXISTS mod_sales_snop_record (
    id                       BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    ITEM_CODE                VARCHAR(50)                          COMMENT '자재코드',
    ITEM_NAME                VARCHAR(200)                         COMMENT '자재명',
    CATEGORY                 VARCHAR(100)                         COMMENT '카테고리',
    PRODUCTION_LINE          VARCHAR(50)                          COMMENT '생산라인',
    PLANT_CODE               VARCHAR(10)                          COMMENT '플랜트코드',
    VENDOR_NAME              VARCHAR(200)                         COMMENT '거래처명',
    MOQ                      BIGINT                               COMMENT '최소주문수량',
    PLAN_MONTH               VARCHAR(7)                           COMMENT '계획월 (YYYY-MM)',
    SALES_PLAN               BIGINT                               COMMENT '판매계획',
    SALES_ACTUAL             BIGINT                               COMMENT '판매실적',
    PRODUCTION_PLAN          BIGINT                               COMMENT '생산계획',
    PRODUCTION_ACTUAL        BIGINT                               COMMENT '생산실적',
    PRODUCTION_REMAINING     BIGINT                               COMMENT '생산잔량',
    BEGINNING_INVENTORY      BIGINT                               COMMENT '기초재고',
    AVAILABLE_INVENTORY      BIGINT                               COMMENT '가용재고',
    INVENTORY_UNIT           VARCHAR(10)                          COMMENT '재고단위',
    TARGET_ENDING_INVENTORY  BIGINT                               COMMENT '목표기말재고',
    OPTIMAL_INVENTORY_2025   BIGINT                               COMMENT '적정재고',
    CAPACITY_LIMIT           BIGINT                               COMMENT '생산능력한도',
    MANUAL_INPUT_QUANTITY    BIGINT                               COMMENT '수동입력수량',
    NOTES                    VARCHAR(500)                         COMMENT '비고',
    PRIORITY                 INT                                  COMMENT '우선순위',
    CREATED_BY               VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT               DATETIME                             COMMENT '등록일시',
    UPDATED_BY               VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT               DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='S&OP 생산계획 레코드';

-- 5. 개발 일정
CREATE TABLE IF NOT EXISTS mod_sales_dev_schedule (
    id              BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    SCHEDULE_DATE   DATE         NOT NULL                COMMENT '일정일자',
    SCHEDULE_TIME   TIME                                 COMMENT '일정시간',
    TITLE           VARCHAR(500) NOT NULL                COMMENT '제목',
    DESCRIPTION     VARCHAR(2000)                        COMMENT '설명',
    CATEGORY        VARCHAR(100)                         COMMENT '분류',
    STATUS          VARCHAR(50)  DEFAULT 'planned'       COMMENT '상태',
    PRIORITY        VARCHAR(20)  DEFAULT 'medium'        COMMENT '중요도',
    ASSIGNEE        VARCHAR(200)                         COMMENT '담당자',
    PROGRESS        INT          DEFAULT 0               COMMENT '진행률(%)',
    NOTES           VARCHAR(2000)                        COMMENT '메모',
    CREATED_BY      VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT      DATETIME                             COMMENT '등록일시',
    UPDATED_BY      VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT      DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='개발 일정';

-- 6. 인터페이스 마스터
CREATE TABLE IF NOT EXISTS mod_sales_interface_master (
    id              BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    INTERFACE_ID    VARCHAR(30)  NOT NULL                COMMENT '인터페이스 ID',
    INTERFACE_NAME  VARCHAR(200) NOT NULL                COMMENT '인터페이스명',
    SENDER          VARCHAR(50)                          COMMENT '송신시스템',
    RECEIVER        VARCHAR(50)                          COMMENT '수신시스템',
    RFC_URL         VARCHAR(500)                         COMMENT 'RFC URL',
    RFC_PARAM       TEXT                                 COMMENT 'RFC 파라미터 (JSON)',
    EXEC_COMMAND    TEXT                                 COMMENT '실행명령어',
    CREATED_BY      VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT      DATETIME                             COMMENT '등록일시',
    UPDATED_BY      VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT      DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id),
    UNIQUE KEY uk_if_master_id (INTERFACE_ID),
    INDEX idx_if_master_if_id (INTERFACE_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='인터페이스 마스터';

-- 7. 인터페이스 수행관리
CREATE TABLE IF NOT EXISTS mod_sales_interface_execution (
    id                BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    INTERFACE_ID      VARCHAR(30)  NOT NULL                COMMENT '인터페이스 ID',
    INTERFACE_NAME    VARCHAR(200)                         COMMENT '인터페이스명',
    SCHEDULE_TYPE     VARCHAR(20)  NOT NULL                COMMENT '스케줄유형 (DAILY/HOURLY/CRON)',
    EXECUTION_TIME    VARCHAR(10)                          COMMENT '실행시간 (HH:mm)',
    INTERVAL_MINUTES  INT                                  COMMENT '실행간격(분)',
    CRON_EXPRESSION   VARCHAR(100)                         COMMENT 'CRON식',
    IS_ACTIVE         TINYINT(1)   DEFAULT 1               COMMENT '활성여부',
    LAST_EXECUTED_AT  DATETIME                             COMMENT '최근실행일시',
    NEXT_EXECUTION_AT DATETIME                             COMMENT '다음실행예정',
    DESCRIPTION       VARCHAR(500)                         COMMENT '설명',
    CREATED_BY        VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT        DATETIME                             COMMENT '등록일시',
    UPDATED_BY        VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT        DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id),
    INDEX idx_if_exec_if_id (INTERFACE_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='인터페이스 수행관리';

-- 8. 인터페이스 이력
CREATE TABLE IF NOT EXISTS mod_sales_interface_history (
    id               BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    INTERFACE_ID     VARCHAR(30)  NOT NULL                COMMENT '인터페이스 ID',
    INTERFACE_NAME   VARCHAR(200)                         COMMENT '인터페이스명',
    EXECUTION_TYPE   VARCHAR(20)                          COMMENT '실행유형 (SCHEDULED/MANUAL/RETRY)',
    START_TIME       DATETIME                             COMMENT '시작시간',
    END_TIME         DATETIME                             COMMENT '종료시간',
    DURATION_MS      BIGINT                               COMMENT '소요시간(ms)',
    PROCESSED_COUNT  INT                                  COMMENT '처리건수',
    ERROR_COUNT      INT                                  COMMENT '오류건수',
    STATUS           VARCHAR(20)  NOT NULL                COMMENT '상태 (SUCCESS/ERROR/RUNNING)',
    ERROR_MESSAGE    TEXT                                  COMMENT '오류메시지',
    EXEC_COMMAND     TEXT                                  COMMENT '실행명령어',
    RETRY_OF_ID      BIGINT                               COMMENT '재수행 원본 ID',
    CREATED_BY       VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT       DATETIME                             COMMENT '등록일시',
    UPDATED_BY       VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT       DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id),
    INDEX idx_if_hist_if_id  (INTERFACE_ID),
    INDEX idx_if_hist_status (STATUS),
    INDEX idx_if_hist_start  (START_TIME)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='인터페이스 이력';

-- 9. 라인 CAPA 계획
CREATE TABLE IF NOT EXISTS mod_sales_line_capa_plan (
    id                    BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    LINE_CATEGORY         VARCHAR(100)                         COMMENT '라인분류',
    PRODUCTION_LINE       VARCHAR(50)                          COMMENT '생산라인',
    PLAN_MONTH            VARCHAR(7)                           COMMENT '계획월',
    DAILY_CAPA            DOUBLE                               COMMENT '일일생산능력',
    DAILY_OPERATING_HOURS DOUBLE                               COMMENT '일일가동시간',
    PLANNED_OPERATING_DAYS INT                                 COMMENT '계획가동일수',
    COMPUTED_CAPA         DOUBLE                               COMMENT '산출CAPA (자동계산)',
    NOTE                  VARCHAR(500)                         COMMENT '비고',
    CREATED_BY            VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT            DATETIME                             COMMENT '등록일시',
    UPDATED_BY            VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT            DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='라인 CAPA 계획';

-- 10. 라인별 자재 마스터
CREATE TABLE IF NOT EXISTS mod_sales_line_item_master (
    id                BIGINT      NOT NULL AUTO_INCREMENT COMMENT 'PK',
    ITEM_CODE         VARCHAR(50)                         COMMENT '자재코드',
    PRODUCTION_LINE   VARCHAR(50)                         COMMENT '생산라인',
    HOURLY_THROUGHPUT BIGINT                              COMMENT '시간당 생산량',
    CREATED_BY        VARCHAR(50)                         COMMENT '등록자',
    CREATED_AT        DATETIME                            COMMENT '등록일시',
    UPDATED_BY        VARCHAR(50)                         COMMENT '수정자',
    UPDATED_AT        DATETIME                            COMMENT '수정일시',
    PRIMARY KEY (id),
    UNIQUE KEY uk_line_item_code (ITEM_CODE)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='라인별 자재 마스터';

-- 11. 자재 연결 (레거시↔리뉴얼)
CREATE TABLE IF NOT EXISTS mod_sales_material_linkage (
    id                BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    LEGACY_ITEM_CODE  VARCHAR(50)                          COMMENT '기존자재코드',
    LEGACY_ITEM_NAME  VARCHAR(200)                         COMMENT '기존자재명',
    RENEWAL_ITEM_CODE VARCHAR(50)                          COMMENT '리뉴얼자재코드',
    RENEWAL_ITEM_NAME VARCHAR(200)                         COMMENT '리뉴얼자재명',
    EFFECTIVE_MONTH   VARCHAR(7)                           COMMENT '적용시작월',
    NOTE              VARCHAR(500)                         COMMENT '비고',
    CREATED_BY        VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT        DATETIME                             COMMENT '등록일시',
    UPDATED_BY        VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT        DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='자재 연결';

-- 12. 월말 마감 데이터
CREATE TABLE IF NOT EXISTS mod_sales_monthly_closing (
    id               BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    ITEM_CODE        VARCHAR(50)                          COMMENT '자재코드',
    ITEM_NAME        VARCHAR(200)                         COMMENT '자재명',
    HIERARCHY_NAME   VARCHAR(200)                         COMMENT '카테고리',
    CLOSING_MONTH    VARCHAR(7)                           COMMENT '마감월',
    ENDING_INVENTORY BIGINT                               COMMENT '월말재고',
    PRODUCTION_ACTUAL BIGINT                              COMMENT '월생산실적',
    SALES_ACTUAL     BIGINT                               COMMENT '월판매실적',
    UNIT             VARCHAR(20)                          COMMENT '단위',
    NOTES            VARCHAR(500)                         COMMENT '비고',
    CREATED_BY       VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT       DATETIME                             COMMENT '등록일시',
    UPDATED_BY       VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT       DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id),
    UNIQUE KEY uk_monthly_closing_item_month (ITEM_CODE, CLOSING_MONTH),
    INDEX idx_monthly_closing_month     (CLOSING_MONTH),
    INDEX idx_monthly_closing_item      (ITEM_CODE),
    INDEX idx_monthly_closing_hierarchy (HIERARCHY_NAME)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='월말 마감 데이터';

-- 13. 적정재고 기준값
CREATE TABLE IF NOT EXISTS mod_sales_optimal_inventory_baseline (
    id               BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    BASE_YEAR        VARCHAR(4)                           COMMENT '기준년도',
    CATEGORY         VARCHAR(100)                         COMMENT '카테고리',
    OPTIMAL_QUANTITY BIGINT                               COMMENT '적정재고수량',
    NOTES            VARCHAR(500)                         COMMENT '비고',
    CREATED_BY       VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT       DATETIME                             COMMENT '등록일시',
    UPDATED_BY       VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT       DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='적정재고 기준값';

-- 14. 플랜트 저장위치 재고
CREATE TABLE IF NOT EXISTS mod_sales_plant_storage_location (
    id                  BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    PLAN_MONTH          VARCHAR(10)                          COMMENT '계획월',
    ITEM_CODE           VARCHAR(50)                          COMMENT '자재코드',
    PLANT_CODE          VARCHAR(10)                          COMMENT '플랜트코드',
    PLANT_NAME          VARCHAR(50)                          COMMENT '플랜트명',
    STORAGE_LOCATION    VARCHAR(20)                          COMMENT '저장위치',
    IS_SELECTED         TINYINT(1)   DEFAULT 0               COMMENT '선택여부',
    STOCK_UNIT          VARCHAR(10)                          COMMENT '재고단위',
    BEGINNING_INVENTORY BIGINT                               COMMENT '기초재고',
    AVAILABLE_INVENTORY BIGINT                               COMMENT '가용재고',
    AVAILABLE_STOCK     BIGINT                               COMMENT '가용재고(재고)',
    CURRENT_STOCK       BIGINT                               COMMENT '현재재고',
    SAP_SYNC_AT         DATETIME                             COMMENT 'SAP 동기화일시',
    CREATED_BY          VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT          DATETIME                             COMMENT '등록일시',
    UPDATED_BY          VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT          DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id),
    INDEX idx_psl_plant_code (PLANT_CODE),
    INDEX idx_psl_item_code  (ITEM_CODE),
    INDEX idx_psl_plan_month (PLAN_MONTH)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='플랜트 저장위치 재고';

-- 15. 생산계획 변경 이력
CREATE TABLE IF NOT EXISTS mod_sales_production_change_log (
    id                       BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    RECORD_ID                VARCHAR(255)                         COMMENT '원본 레코드 ID',
    ITEM_CODE                VARCHAR(50)                          COMMENT '자재코드',
    ITEM_NAME                VARCHAR(200)                         COMMENT '자재명',
    PLAN_MONTH               VARCHAR(7)                           COMMENT '계획월',
    PRODUCTION_LINE          VARCHAR(50)                          COMMENT '생산라인',
    CHANGE_TYPE              VARCHAR(20)                          COMMENT '변경유형',
    PREVIOUS_PRODUCTION_PLAN BIGINT                               COMMENT '변경전 생산계획',
    NEW_PRODUCTION_PLAN      BIGINT                               COMMENT '변경후 생산계획',
    SALES_PLAN               BIGINT                               COMMENT '판매계획',
    BEGINNING_INVENTORY      BIGINT                               COMMENT '기초재고',
    TARGET_ENDING_INVENTORY  BIGINT                               COMMENT '목표기말재고',
    ENDING_INVENTORY         BIGINT                               COMMENT '기말재고',
    NOTE                     VARCHAR(500)                         COMMENT '비고',
    CONFIRMED_AT             VARCHAR(255)                         COMMENT '확정일시',
    CREATED_BY               VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT               DATETIME                             COMMENT '등록일시',
    UPDATED_BY               VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT               DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='생산계획 변경 이력';

-- 16. 최근 판매평균
CREATE TABLE IF NOT EXISTS mod_sales_recent_sales_average (
    id          BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    BASE_MONTH  VARCHAR(7)                           COMMENT '기준월',
    ITEM_CODE   VARCHAR(50)                          COMMENT '자재코드',
    M3          BIGINT                               COMMENT '3개월전 판매',
    M2          BIGINT                               COMMENT '2개월전 판매',
    M1          BIGINT                               COMMENT '1개월전 판매',
    TOTAL       BIGINT                               COMMENT '합계 (자동계산)',
    AVERAGE     BIGINT                               COMMENT '평균 (자동계산)',
    NOTE        VARCHAR(500)                         COMMENT '비고',
    CREATED_BY  VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT  DATETIME                             COMMENT '등록일시',
    UPDATED_BY  VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT  DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='최근 판매평균';

-- 17. 리뉴얼 자재 연결 (SAP 인터페이스)
CREATE TABLE IF NOT EXISTS mod_sales_renewal_material_linkage (
    id                   BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    HIERARCHY_NAME       VARCHAR(100)                         COMMENT '카테고리',
    LEGACY_ITEM_CODE     VARCHAR(50)  NOT NULL                COMMENT '기존자재코드',
    LEGACY_ITEM_NAME     VARCHAR(200)                         COMMENT '기존자재명',
    RENEWAL_ITEM_CODE_1  VARCHAR(50)                          COMMENT '리뉴얼자재코드1',
    RENEWAL_ITEM_NAME_1  VARCHAR(200)                         COMMENT '리뉴얼자재명1',
    RENEWAL_ITEM_CODE_2  VARCHAR(50)                          COMMENT '리뉴얼자재코드2',
    RENEWAL_ITEM_NAME_2  VARCHAR(200)                         COMMENT '리뉴얼자재명2',
    RENEWAL_ITEM_CODE_3  VARCHAR(50)                          COMMENT '리뉴얼자재코드3',
    RENEWAL_ITEM_NAME_3  VARCHAR(200)                         COMMENT '리뉴얼자재명3',
    RENEWAL_ITEM_CODE_4  VARCHAR(50)                          COMMENT '리뉴얼자재코드4',
    RENEWAL_ITEM_NAME_4  VARCHAR(200)                         COMMENT '리뉴얼자재명4',
    RENEWAL_ITEM_CODE_5  VARCHAR(50)                          COMMENT '리뉴얼자재코드5',
    RENEWAL_ITEM_NAME_5  VARCHAR(200)                         COMMENT '리뉴얼자재명5',
    EFFECTIVE_MONTH      VARCHAR(7)                           COMMENT '적용시작월',
    NOTE                 VARCHAR(500)                         COMMENT '메모',
    IS_ACTIVE            TINYINT(1)   NOT NULL DEFAULT 1      COMMENT '활성여부',
    CREATED_BY           VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT           DATETIME                             COMMENT '등록일시',
    UPDATED_BY           VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT           DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id),
    INDEX idx_renewal_linkage_legacy_code   (LEGACY_ITEM_CODE),
    INDEX idx_renewal_linkage_renewal1_code (RENEWAL_ITEM_CODE_1),
    INDEX idx_renewal_linkage_renewal2_code (RENEWAL_ITEM_CODE_2),
    INDEX idx_renewal_linkage_renewal3_code (RENEWAL_ITEM_CODE_3),
    INDEX idx_renewal_linkage_renewal4_code (RENEWAL_ITEM_CODE_4),
    INDEX idx_renewal_linkage_renewal5_code (RENEWAL_ITEM_CODE_5),
    INDEX idx_renewal_linkage_hierarchy     (HIERARCHY_NAME)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='리뉴얼 자재 연결';

-- 18. 판매채널
CREATE TABLE IF NOT EXISTS mod_sales_channel (
    id           BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    CHANNEL_KEY  VARCHAR(50)                          COMMENT '채널키',
    CHANNEL_NAME VARCHAR(100)                         COMMENT '채널명',
    DESCRIPTION  VARCHAR(500)                         COMMENT '설명',
    CREATED_BY   VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT   DATETIME                             COMMENT '등록일시',
    UPDATED_BY   VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT   DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id),
    UNIQUE KEY uk_channel_key (CHANNEL_KEY)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='판매채널';

-- 19. 판매계획 업로드
CREATE TABLE IF NOT EXISTS mod_sales_plan_upload (
    id                 BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    PLAN_MONTH         VARCHAR(7)                           COMMENT '계획월',
    ITEM_CODE          VARCHAR(50)                          COMMENT '자재코드',
    CHANNEL            VARCHAR(50)                          COMMENT '채널',
    STANDARD_QUANTITY  BIGINT                               COMMENT '기준수량',
    PROMOTION_QUANTITY BIGINT                               COMMENT '프로모션수량',
    QUANTITY           BIGINT                               COMMENT '합계수량',
    NOTE               VARCHAR(500)                         COMMENT '비고',
    CREATED_BY         VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT         DATETIME                             COMMENT '등록일시',
    UPDATED_BY         VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT         DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='판매계획 업로드';

-- 20. 판매계획 업로드 이력
CREATE TABLE IF NOT EXISTS mod_sales_plan_upload_history (
    id                          BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    PLAN_MONTH                  VARCHAR(7)                           COMMENT '계획월',
    ITEM_CODE                   VARCHAR(50)                          COMMENT '자재코드',
    CHANNEL                     VARCHAR(50)                          COMMENT '채널',
    QUANTITY                    BIGINT                               COMMENT '수량',
    STANDARD_QUANTITY           BIGINT                               COMMENT '기준수량',
    PROMOTION_QUANTITY          BIGINT                               COMMENT '프로모션수량',
    UPLOAD_TYPE                 VARCHAR(50)                          COMMENT '업로드유형',
    UPLOAD_REFERENCE            VARCHAR(500)                         COMMENT '업로드참조',
    NOTE                        VARCHAR(500)                         COMMENT '비고',
    PREVIOUS_QUANTITY           BIGINT                               COMMENT '이전수량',
    PREVIOUS_STANDARD_QUANTITY  BIGINT                               COMMENT '이전기준수량',
    PREVIOUS_PROMOTION_QUANTITY BIGINT                               COMMENT '이전프로모션수량',
    PREVIOUS_NOTE               VARCHAR(500)                         COMMENT '이전비고',
    ACTION                      VARCHAR(50)                          COMMENT '액션',
    TARGET_RECORD_ID            VARCHAR(50)                          COMMENT '대상레코드ID',
    CREATED_BY                  VARCHAR(50)                          COMMENT '등록자',
    CREATED_AT                  DATETIME                             COMMENT '등록일시',
    UPDATED_BY                  VARCHAR(50)                          COMMENT '수정자',
    UPDATED_AT                  DATETIME                             COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='판매계획 업로드 이력';

-- 21. 판매계획 업로드 로그
CREATE TABLE IF NOT EXISTS mod_sales_plan_upload_log (
    id              BIGINT        NOT NULL AUTO_INCREMENT COMMENT 'PK',
    UPLOAD_TYPE     VARCHAR(50)                           COMMENT '업로드유형',
    FILE_NAME       VARCHAR(500)                          COMMENT '파일명',
    RECORD_COUNT    INT                                   COMMENT '레코드건수',
    CHECKSUM        VARCHAR(128)                          COMMENT '체크섬',
    FILE_SIZE       BIGINT                                COMMENT '파일크기',
    ROW_COUNT       INT                                   COMMENT '행수',
    PROCESSED_COUNT INT                                   COMMENT '처리건수',
    MERGED_ROWS     INT                                   COMMENT '병합행수',
    STATUS          VARCHAR(50)                           COMMENT '상태',
    MESSAGE         VARCHAR(1000)                         COMMENT '메시지',
    UPLOADED_BY     VARCHAR(100)                          COMMENT '업로드자',
    CREATED_BY      VARCHAR(50)                           COMMENT '등록자',
    CREATED_AT      DATETIME                              COMMENT '등록일시',
    UPDATED_BY      VARCHAR(50)                           COMMENT '수정자',
    UPDATED_AT      DATETIME                              COMMENT '수정일시',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='판매계획 업로드 로그';
