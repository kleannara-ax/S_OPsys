package com.company.module.sales.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * SAP RFC 호출 서비스.
 * RFC 목록 매핑표에 따라 6개 SAP Function Module을 호출하고,
 * 수신 데이터를 RfcReceiverService의 processRfc001~006에 전달합니다.
 *
 * <h3>RFC 매핑표</h3>
 * <table>
 *   <tr><th>RFC ID</th><th>SAP Function Module</th><th>SAP 모듈</th><th>용도</th></tr>
 *   <tr><td>SNOP_RFC_001</td><td>Z_MM_SNOP_RFC_001</td><td>MM</td><td>자재마스터 송신</td></tr>
 *   <tr><td>SNOP_RFC_002</td><td>Z_SD_SNOP_RFC_002</td><td>SD</td><td>일자별재고</td></tr>
 *   <tr><td>SNOP_RFC_003</td><td>Z_PP_SNOP_RFC_003</td><td>PP</td><td>일자별 생산 실적</td></tr>
 *   <tr><td>SNOP_RFC_004</td><td>Z_SD_SNOP_RFC_004</td><td>SD</td><td>판매실적</td></tr>
 *   <tr><td>SNOP_RFC_005</td><td>Z_SD_SNOP_RFC_005</td><td>SD,MM,PP</td><td>전월 마감실적</td></tr>
 *   <tr><td>SNOP_RFC_006</td><td>Z_MM_SNOP_RFC_006</td><td>MM</td><td>리뉴얼 자재 송신</td></tr>
 * </table>
 *
 * <h3>SAP 테이블 파라미터 네이밍 규칙</h3>
 * <p>SAP 표준 네이밍: ET_(Export Table) + 용도 약어.
 * 실제 SAP 개발 시 파라미터명이 다를 수 있으므로,
 * {@code TABLE_PARAM_*} 상수를 수정하여 대응할 수 있습니다.</p>
 *
 * <h3>SAP→S&OP 필드 매핑</h3>
 * <p>SAP 필드명(대문자/언더스코어)을 S&OP 필드명(소문자/언더스코어)으로 변환합니다.
 * 예: ITEM_CODE → item_code, PLAN_MONTH_DAY → plan_month_day</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SapRfcCallerService {

    private final SapRfcService sapRfcService;
    private final RfcReceiverService rfcReceiverService;

    // ─── SAP Function Module 이름 ───
    private static final String FM_RFC_001 = "Z_MM_SNOP_RFC_001";
    private static final String FM_RFC_002 = "Z_SD_SNOP_RFC_002";
    private static final String FM_RFC_003 = "Z_PP_SNOP_RFC_003";
    private static final String FM_RFC_004 = "Z_SD_SNOP_RFC_004";
    private static final String FM_RFC_005 = "Z_SD_SNOP_RFC_005";
    private static final String FM_RFC_006 = "Z_MM_SNOP_RFC_006";

    // ─── SAP 테이블 출력 파라미터 이름 ───
    // SAP 개발자 확인 완료 (2026-05-22)
    private static final String TABLE_PARAM_001 = "O_TABLE";   // Z_MM_SNOP_RFC_001
    private static final String TABLE_PARAM_002 = "T_OUTPUT";  // Z_SD_SNOP_RFC_002
    private static final String TABLE_PARAM_003 = "T_OUTPUT";  // Z_PP_SNOP_RFC_003
    private static final String TABLE_PARAM_004 = "T_OUTPUT";  // Z_SD_SNOP_RFC_004
    private static final String TABLE_PARAM_005 = "T_OUTPUT";  // Z_SD_SNOP_RFC_005
    private static final String TABLE_PARAM_006 = "O_TABLE";   // Z_MM_SNOP_RFC_006

    // ─── SAP IMPORT 파라미터 이름 ───
    // RFC_001, RFC_006: I_FLAG (A=전체, B=신규/수정)
    private static final String IMPORT_PARAM_TYPE = "I_FLAG";
    // RFC_005: I_YYYYMM (마감 대상 년월)
    private static final String IMPORT_PARAM_YEARMONTH = "I_YYYYMM";

    // ─── 실행유형 상수 ───
    private static final String EXEC_TYPE_MANUAL = "MANUAL";
    private static final String EXEC_TYPE_SCHEDULED = "SCHEDULED";

    // ─── RFC_001 → RFC_006 SAP 필드명 → S&OP 필드명 매핑 ───

    /** RFC_001 자재마스터: SAP 필드 → S&OP 필드 */
    private static final Map<String, String> FIELD_MAP_001 = new LinkedHashMap<>();
    static {
        FIELD_MAP_001.put("SCM_AREA", "scm_area");
        FIELD_MAP_001.put("HIERARCHY_NAME", "hierarchy_name");
        FIELD_MAP_001.put("PRODUCTION_UNIT", "production_unit");
        FIELD_MAP_001.put("ITEM_CODE", "item_code");
        FIELD_MAP_001.put("ITEM_NAME", "item_name");
        FIELD_MAP_001.put("CONVERSION1", "conversion1");
        FIELD_MAP_001.put("CONVERSION2", "conversion2");
        FIELD_MAP_001.put("CONVERSION3", "conversion3");
        FIELD_MAP_001.put("CONVERSION5", "conversion5");
        FIELD_MAP_001.put("VENDOR_NAME", "vendor_name");
        FIELD_MAP_001.put("NEW_UPDATE_TYPE", "new_update_type");
    }

    /** RFC_002 일자별재고: SAP 필드 → S&OP 필드 */
    private static final Map<String, String> FIELD_MAP_002 = new LinkedHashMap<>();
    static {
        FIELD_MAP_002.put("PLAN_MONTH_DAY", "plan_month_day");
        FIELD_MAP_002.put("ITEM_CODE", "item_code");
        FIELD_MAP_002.put("PLANT_CODE", "plant_code");
        FIELD_MAP_002.put("STORAGE_LOCATION", "storage_location");
        FIELD_MAP_002.put("UNIT", "unit");
        FIELD_MAP_002.put("BEGINNING_INVENTORY", "beginning_inventory");
        FIELD_MAP_002.put("AVAILABLE_INVENTORY", "available_inventory");
    }

    /** RFC_003 생산실적: SAP 필드 → S&OP 필드 */
    private static final Map<String, String> FIELD_MAP_003 = new LinkedHashMap<>();
    static {
        FIELD_MAP_003.put("PLAN_MONTH_DAY", "plan_month_day");
        FIELD_MAP_003.put("ITEM_CODE", "item_code");
        FIELD_MAP_003.put("PLANT_CODE", "plant_code");
        FIELD_MAP_003.put("UNIT", "unit");
        FIELD_MAP_003.put("PRODUCTION_ACTUAL", "production_actual");
        FIELD_MAP_003.put("PRODUCT_ACTUAL", "production_actual");   // SAP 실제 필드명 (PRODUCTION→PRODUCT)
    }

    /** RFC_004 판매실적: SAP 필드 → S&OP 필드 */
    private static final Map<String, String> FIELD_MAP_004 = new LinkedHashMap<>();
    static {
        FIELD_MAP_004.put("PLAN_MONTH_DAY", "plan_month_day");
        FIELD_MAP_004.put("PLAN_MON", "plan_month_day");      // SAP 실제 필드명 (YYYYMM 6자리)
        FIELD_MAP_004.put("ITEM_CODE", "item_code");
        FIELD_MAP_004.put("UNIT", "unit");
        FIELD_MAP_004.put("UNI", "unit");                      // SAP 실제 필드명
        FIELD_MAP_004.put("SALES_ACTUAL", "sales_actual");
    }

    /** RFC_005 월말마감실적: SAP 필드 → S&OP 필드 */
    private static final Map<String, String> FIELD_MAP_005 = new LinkedHashMap<>();
    static {
        FIELD_MAP_005.put("PLAN_MONTH_DAY", "plan_month_day");
        FIELD_MAP_005.put("ITEM_CODE", "item_code");
        FIELD_MAP_005.put("HIERARCHY_NAME", "hierarchy_name");
        FIELD_MAP_005.put("UNIT", "unit");
        FIELD_MAP_005.put("SALES_ACTUAL", "sales_actual");
        FIELD_MAP_005.put("PRODUCTION_ACTUAL", "production_actual");
        FIELD_MAP_005.put("ENDING_INVENTORY", "ending_inventory");
    }

    /** RFC_006 리뉴얼자재연결: SAP 필드 → S&OP 필드 */
    private static final Map<String, String> FIELD_MAP_006 = new LinkedHashMap<>();
    static {
        FIELD_MAP_006.put("HIERARCHY_NAME", "hierarchy_name");
        FIELD_MAP_006.put("ITEM_CODE", "item_code");
        FIELD_MAP_006.put("ITEM_NAME", "item_name");
        FIELD_MAP_006.put("ITEM_CODE_1", "item_code_1");
        FIELD_MAP_006.put("ITEM_NAME_1", "item_name_1");
        FIELD_MAP_006.put("ITEM_CODE_2", "item_code_2");
        FIELD_MAP_006.put("ITEM_NAME_2", "item_name_2");
        FIELD_MAP_006.put("ITEM_CODE_3", "item_code_3");
        FIELD_MAP_006.put("ITEM_NAME_3", "item_name_3");
        FIELD_MAP_006.put("ITEM_CODE_4", "item_code_4");
        FIELD_MAP_006.put("ITEM_NAME_4", "item_name_4");
        FIELD_MAP_006.put("ITEM_CODE_5", "item_code_5");
        FIELD_MAP_006.put("ITEM_NAME_5", "item_name_5");
        FIELD_MAP_006.put("IS_ACTIVE", "is_active");
        FIELD_MAP_006.put("NEW_UPDATE_TYPE", "new_update_type");
    }

    // ═══════════════════════════════════════════════════════
    //  전체 RFC 일괄 실행
    // ═══════════════════════════════════════════════════════

    /**
     * 6개 RFC를 순서대로 일괄 실행합니다.
     *
     * @param executionType 실행유형 (MANUAL / SCHEDULED)
     * @return 각 RFC별 실행 결과 맵
     */
    public Map<String, Object> executeAllRfcs(String executionType) {
        log.info("══════ SAP RFC 일괄 실행 시작 ══════ executionType={}", executionType);
        long startTime = System.currentTimeMillis();

        Map<String, Object> results = new LinkedHashMap<>();

        // RFC_001: 자재마스터 (전체)
        results.put("RFC_001", executeSafely(() -> callRfc001("A", executionType), "RFC_001"));

        // RFC_002: 일자별재고
        results.put("RFC_002", executeSafely(() -> callRfc002(executionType), "RFC_002"));

        // RFC_003: 생산실적
        results.put("RFC_003", executeSafely(() -> callRfc003(executionType), "RFC_003"));

        // RFC_004: 판매실적
        results.put("RFC_004", executeSafely(() -> callRfc004(executionType), "RFC_004"));

        // RFC_005: 월말마감실적 (전월 자동)
        results.put("RFC_005", executeSafely(() -> callRfc005(null, executionType), "RFC_005"));

        // RFC_006: 리뉴얼자재연결 (전체)
        results.put("RFC_006", executeSafely(() -> callRfc006("A", executionType), "RFC_006"));

        long elapsed = System.currentTimeMillis() - startTime;
        results.put("total_elapsed_ms", elapsed);

        log.info("══════ SAP RFC 일괄 실행 완료 ══════ elapsed={}ms", elapsed);
        return results;
    }

    // ═══════════════════════════════════════════════════════
    //  RFC_001: 자재마스터 송신 (Z_MM_SNOP_RFC_001)
    // ═══════════════════════════════════════════════════════

    /**
     * SAP 자재마스터 RFC를 호출하고 결과를 processRfc001에 전달합니다.
     *
     * @param type A=전체, B=변경분
     * @param executionType 실행유형 (MANUAL / SCHEDULED)
     * @return processRfc001 결과
     */
    public Map<String, Object> callRfc001(String type, String executionType) {
        log.info("[RFC-001] SAP 자재마스터 호출 시작 — type={}", type);

        Map<String, Object> importParams = new HashMap<>();
        if (type != null && !type.isEmpty()) {
            importParams.put(IMPORT_PARAM_TYPE, type);
        }

        List<Map<String, Object>> sapData = sapRfcService.callRfc(
                FM_RFC_001, importParams, TABLE_PARAM_001);

        log.info("[RFC-001] SAP 수신 완료 — {}건", sapData.size());

        // SAP 원본 필드명 로그 출력 (필드 매핑 디버깅용)
        logSapFieldNames("RFC-001", sapData);

        // SAP 필드명 → S&OP 필드명 변환
        List<Map<String, Object>> mappedData = convertFieldNames(sapData, FIELD_MAP_001);

        // RfcReceiverService에 전달
        return rfcReceiverService.processRfc001(mappedData, executionType);
    }

    // ═══════════════════════════════════════════════════════
    //  RFC_002: 일자별재고 (Z_SD_SNOP_RFC_002)
    // ═══════════════════════════════════════════════════════

    /**
     * SAP 일자별재고 RFC를 호출하고 결과를 processRfc002에 전달합니다.
     *
     * @param executionType 실행유형 (MANUAL / SCHEDULED)
     * @return processRfc002 결과
     */
    public Map<String, Object> callRfc002(String executionType) {
        log.info("[RFC-002] SAP 일자별재고 호출 시작");

        List<Map<String, Object>> sapData = sapRfcService.callRfc(
                FM_RFC_002, TABLE_PARAM_002);

        log.info("[RFC-002] SAP 수신 완료 — {}건", sapData.size());

        List<Map<String, Object>> mappedData = convertFieldNames(sapData, FIELD_MAP_002);
        return rfcReceiverService.processRfc002(mappedData, executionType);
    }

    // ═══════════════════════════════════════════════════════
    //  RFC_003: 일자별 생산 실적 (Z_PP_SNOP_RFC_003)
    // ═══════════════════════════════════════════════════════

    /**
     * SAP 생산실적 RFC를 호출하고 결과를 processRfc003에 전달합니다.
     *
     * @param executionType 실행유형 (MANUAL / SCHEDULED)
     * @return processRfc003 결과
     */
    public Map<String, Object> callRfc003(String executionType) {
        log.info("[RFC-003] SAP 생산실적 호출 시작");

        List<Map<String, Object>> sapData = sapRfcService.callRfc(
                FM_RFC_003, TABLE_PARAM_003);

        log.info("[RFC-003] SAP 수신 완료 — {}건", sapData.size());

        List<Map<String, Object>> mappedData = convertFieldNames(sapData, FIELD_MAP_003);
        return rfcReceiverService.processRfc003(mappedData, executionType);
    }

    // ═══════════════════════════════════════════════════════
    //  RFC_004: 판매실적 (Z_SD_SNOP_RFC_004)
    // ═══════════════════════════════════════════════════════

    /**
     * SAP 판매실적 RFC를 호출하고 결과를 processRfc004에 전달합니다.
     *
     * @param executionType 실행유형 (MANUAL / SCHEDULED)
     * @return processRfc004 결과
     */
    public Map<String, Object> callRfc004(String executionType) {
        log.info("[RFC-004] SAP 판매실적 호출 시작");

        List<Map<String, Object>> sapData = sapRfcService.callRfc(
                FM_RFC_004, TABLE_PARAM_004);

        log.info("[RFC-004] SAP 수신 완료 — {}건", sapData.size());

        List<Map<String, Object>> mappedData = convertFieldNames(sapData, FIELD_MAP_004);
        return rfcReceiverService.processRfc004(mappedData, executionType);
    }

    // ═══════════════════════════════════════════════════════
    //  RFC_005: 전월 마감실적 (Z_SD_SNOP_RFC_005)
    // ═══════════════════════════════════════════════════════

    /**
     * SAP 월말마감실적 RFC를 호출하고 결과를 processRfc005에 전달합니다.
     *
     * @param yearMonth 조회 대상 년월 (YYYYMM 형식, null이면 전월 자동)
     * @param executionType 실행유형 (MANUAL / SCHEDULED)
     * @return processRfc005 결과
     */
    public Map<String, Object> callRfc005(String yearMonth, String executionType) {
        // 인풋 파라미터: 년월 (YYYYMM)
        // null이면 시스템 날짜 기준 전월 자동 산출
        String inputYearMonth;
        if (yearMonth != null && !yearMonth.trim().isEmpty()) {
            inputYearMonth = yearMonth.trim();
        } else {
            YearMonth prevMonth = YearMonth.now().minusMonths(1);
            inputYearMonth = prevMonth.format(DateTimeFormatter.ofPattern("yyyyMM"));
        }

        log.info("[RFC-005] SAP 월말마감실적 호출 시작 — yearMonth={}", inputYearMonth);

        Map<String, Object> importParams = new HashMap<>();
        importParams.put(IMPORT_PARAM_YEARMONTH, inputYearMonth);

        List<Map<String, Object>> sapData = sapRfcService.callRfc(
                FM_RFC_005, importParams, TABLE_PARAM_005);

        log.info("[RFC-005] SAP 수신 완료 — {}건", sapData.size());

        List<Map<String, Object>> mappedData = convertFieldNames(sapData, FIELD_MAP_005);

        // processRfc005는 inputYearMonth 파라미터를 추가로 받음
        return rfcReceiverService.processRfc005(mappedData, executionType, inputYearMonth);
    }

    // ═══════════════════════════════════════════════════════
    //  RFC_006: 리뉴얼 자재 송신 (Z_MM_SNOP_RFC_006)
    // ═══════════════════════════════════════════════════════

    /**
     * SAP 리뉴얼자재연결 RFC를 호출하고 결과를 processRfc006에 전달합니다.
     *
     * @param type A=전체, B=변경분
     * @param executionType 실행유형 (MANUAL / SCHEDULED)
     * @return processRfc006 결과
     */
    public Map<String, Object> callRfc006(String type, String executionType) {
        log.info("[RFC-006] SAP 리뉴얼자재연결 호출 시작 — type={}", type);

        Map<String, Object> importParams = new HashMap<>();
        if (type != null && !type.isEmpty()) {
            importParams.put(IMPORT_PARAM_TYPE, type);
        }

        List<Map<String, Object>> sapData = sapRfcService.callRfc(
                FM_RFC_006, importParams, TABLE_PARAM_006);

        log.info("[RFC-006] SAP 수신 완료 — {}건", sapData.size());

        List<Map<String, Object>> mappedData = convertFieldNames(sapData, FIELD_MAP_006);
        return rfcReceiverService.processRfc006(mappedData, executionType);
    }

    // ═══════════════════════════════════════════════════════
    //  공통 유틸리티
    // ═══════════════════════════════════════════════════════

    /**
     * SAP 필드명을 S&OP 필드명(소문자)으로 변환합니다.
     * 대소문자를 구분하지 않고(case-insensitive) 매핑합니다.
     * 매핑 테이블에 없는 필드는 소문자 변환하여 그대로 포함합니다.
     *
     * @param sapData SAP에서 수신한 원본 데이터
     * @param fieldMap SAP 필드명(대문자) → S&OP 필드명(소문자) 매핑
     * @return 변환된 데이터
     */
    private List<Map<String, Object>> convertFieldNames(
            List<Map<String, Object>> sapData,
            Map<String, String> fieldMap) {

        // case-insensitive 룩업용 맵 생성 (대문자 키 → S&OP 필드명)
        Map<String, String> upperMap = new HashMap<>();
        for (Map.Entry<String, String> e : fieldMap.entrySet()) {
            upperMap.put(e.getKey().toUpperCase(), e.getValue());
        }

        List<Map<String, Object>> result = new ArrayList<>(sapData.size());
        for (Map<String, Object> sapRow : sapData) {
            Map<String, Object> mappedRow = new LinkedHashMap<>();
            for (Map.Entry<String, Object> entry : sapRow.entrySet()) {
                String sapField = entry.getKey();
                Object value = entry.getValue();

                // 대소문자 무시하여 매핑 테이블에서 찾기
                String snopField = upperMap.get(sapField.toUpperCase());
                if (snopField == null) {
                    // 매핑 테이블에 없으면 소문자 변환하여 포함
                    snopField = sapField.toLowerCase();
                }
                mappedRow.put(snopField, value);
            }
            result.add(mappedRow);
        }
        return result;
    }

    /**
     * SAP 원본 필드명을 로그에 출력합니다 (필드 매핑 디버깅용).
     * 첫 번째 행의 필드명만 출력합니다.
     */
    private void logSapFieldNames(String rfcId, List<Map<String, Object>> sapData) {
        if (sapData == null || sapData.isEmpty()) {
            log.warn("[{}] SAP 데이터 0건 — 필드명 확인 불가", rfcId);
            return;
        }
        Map<String, Object> firstRow = sapData.get(0);
        log.info("[{}] ★ SAP 원본 필드명 (첫 번째 행): {}", rfcId, firstRow.keySet());
        // 첫 번째 행의 값도 출력 (데이터 확인용)
        for (Map.Entry<String, Object> entry : firstRow.entrySet()) {
            Object val = entry.getValue();
            String valStr = (val != null) ? val.toString() : "null";
            if (valStr.length() > 100) valStr = valStr.substring(0, 100) + "...";
            log.info("[{}]   {} = {}", rfcId, entry.getKey(), valStr);
        }
    }

    /**
     * RFC 호출을 안전하게 실행합니다 (예외 발생 시 에러 맵 반환).
     */
    private Map<String, Object> executeSafely(java.util.function.Supplier<Map<String, Object>> task, String rfcId) {
        try {
            return task.get();
        } catch (Exception e) {
            log.error("[{}] RFC 실행 실패: {}", rfcId, e.getMessage(), e);
            Map<String, Object> errorResult = new LinkedHashMap<>();
            errorResult.put("rfc_id", rfcId);
            errorResult.put("status", "ERROR");
            errorResult.put("error_message", e.getMessage());
            errorResult.put("timestamp", LocalDateTime.now().toString());
            return errorResult;
        }
    }
}
