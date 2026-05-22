package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.service.SapRfcCallerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

/**
 * SAP RFC 호출 API.
 * 수동 실행 또는 스케줄링 트리거를 통해 SAP RFC를 호출합니다.
 *
 * <h3>호출 방식</h3>
 * <p>인터페이스 수행관리 화면에서 수동실행 버튼 클릭 시,
 * {@code InterfaceSchedulerService.executeViaRfcUrl()}이 HTTP POST로 호출합니다.</p>
 * <pre>
 * 요청 본문 예시:
 * {"data":[], "execution_type":"MANUAL", "rfc_param":"A"}
 * </pre>
 * <p>각 엔드포인트는 요청 본문의 {@code rfc_param} 값을 SAP IMPORT 파라미터로 사용합니다.
 * 쿼리 파라미터도 지원하며, 본문 {@code rfc_param} 값이 우선 적용됩니다.</p>
 *
 * <h3>엔드포인트 목록</h3>
 * <ul>
 *   <li>{@code POST /sales-api/sap/rfc/execute-all} — 6개 RFC 일괄 실행</li>
 *   <li>{@code POST /sales-api/sap/rfc/001} — RFC_001 자재마스터 (rfc_param → I_TYPE: A=전체, B=변경분)</li>
 *   <li>{@code POST /sales-api/sap/rfc/002} — RFC_002 일자별재고 (파라미터 없음)</li>
 *   <li>{@code POST /sales-api/sap/rfc/003} — RFC_003 생산실적 (파라미터 없음)</li>
 *   <li>{@code POST /sales-api/sap/rfc/004} — RFC_004 판매실적 (파라미터 없음)</li>
 *   <li>{@code POST /sales-api/sap/rfc/005} — RFC_005 월말마감실적 (rfc_param → I_YYYYMM: 대상년월)</li>
 *   <li>{@code POST /sales-api/sap/rfc/006} — RFC_006 리뉴얼자재연결 (rfc_param → I_TYPE: A=전체, B=변경분)</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/sales-api/sap/rfc")
@RequiredArgsConstructor
public class SapRfcController {

    private final SapRfcCallerService sapRfcCallerService;

    // ──────────────────────────────────────────────
    // 공통: 요청 본문에서 값 추출 헬퍼
    // ──────────────────────────────────────────────

    /**
     * 요청 본문에서 execution_type 추출. 없으면 "MANUAL".
     */
    private String extractExecutionType(Map<String, Object> body) {
        if (body == null) return "MANUAL";
        Object val = body.get("execution_type");
        return (val != null && !val.toString().trim().isEmpty())
                ? val.toString().trim() : "MANUAL";
    }

    /**
     * 요청 본문에서 rfc_param 추출. 없으면 null.
     * <p>인터페이스 마스터관리 화면에서 입력한 RFC Param 값이
     * 따옴표 포함(예: {@code "A"}) 형태로 전송될 수 있으므로 따옴표 제거.</p>
     */
    private String extractRfcParam(Map<String, Object> body) {
        if (body == null) return null;
        Object val = body.get("rfc_param");
        if (val == null) return null;
        String s = val.toString().trim();
        // 앞뒤 따옴표 제거 (인터페이스 마스터에서 "A" 형태로 입력한 경우 대비)
        if (s.length() >= 2 && s.startsWith("\"") && s.endsWith("\"")) {
            s = s.substring(1, s.length() - 1).trim();
        }
        return s.isEmpty() ? null : s;
    }

    // ──────────────────────────────────────────────
    // 일괄 실행
    // ──────────────────────────────────────────────

    /**
     * 6개 RFC 일괄 실행.
     * 순서: 001(자재마스터) → 002(일자별재고) → 003(생산실적)
     *       → 004(판매실적) → 005(월말마감) → 006(리뉴얼자재)
     */
    @PostMapping("/execute-all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeAll(
            @RequestBody(required = false) Map<String, Object> body) {
        String executionType = extractExecutionType(body);
        log.info("SAP RFC 일괄 실행 요청 수신 — executionType={}", executionType);
        Map<String, Object> result = sapRfcCallerService.executeAllRfcs(executionType);
        return ResponseEntity.ok(ApiResponse.ok(result, "SAP RFC 일괄 실행 완료"));
    }

    // ──────────────────────────────────────────────
    // 개별 RFC 엔드포인트
    // ──────────────────────────────────────────────

    /**
     * RFC_001: 자재마스터 송신.
     * <p>rfc_param → I_TYPE: A=전체(기본), B=변경분</p>
     * <p>쿼리 파라미터 {@code ?type=B}도 지원하며, 본문 rfc_param이 우선.</p>
     */
    @PostMapping("/001")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc001(
            @RequestParam(value = "type", required = false) String type,
            @RequestBody(required = false) Map<String, Object> body) {
        String rfcParam = extractRfcParam(body);
        String executionType = extractExecutionType(body);
        // 본문 rfc_param 우선 → 쿼리 파라미터 fallback → 기본값 "A"
        String effectiveType = (rfcParam != null) ? rfcParam : (type != null ? type : "A");
        log.info("SAP RFC_001 자재마스터 실행 요청 — type={}, executionType={} (body.rfc_param={}, query.type={})",
                effectiveType, executionType, rfcParam, type);
        Map<String, Object> result = sapRfcCallerService.callRfc001(effectiveType, executionType);
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_001 자재마스터 실행 완료"));
    }

    /**
     * RFC_002: 일자별재고.
     * <p>IMPORT 파라미터 없음. rfc_param은 무시됩니다.</p>
     */
    @PostMapping("/002")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc002(
            @RequestBody(required = false) Map<String, Object> body) {
        String executionType = extractExecutionType(body);
        log.info("SAP RFC_002 일자별재고 실행 요청 — executionType={}", executionType);
        Map<String, Object> result = sapRfcCallerService.callRfc002(executionType);
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_002 일자별재고 실행 완료"));
    }

    /**
     * RFC_003: 일자별 생산 실적.
     * <p>IMPORT 파라미터 없음. rfc_param은 무시됩니다.</p>
     */
    @PostMapping("/003")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc003(
            @RequestBody(required = false) Map<String, Object> body) {
        String executionType = extractExecutionType(body);
        log.info("SAP RFC_003 생산실적 실행 요청 — executionType={}", executionType);
        Map<String, Object> result = sapRfcCallerService.callRfc003(executionType);
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_003 생산실적 실행 완료"));
    }

    /**
     * RFC_004: 판매실적.
     * <p>IMPORT 파라미터 없음. rfc_param은 무시됩니다.</p>
     */
    @PostMapping("/004")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc004(
            @RequestBody(required = false) Map<String, Object> body) {
        String executionType = extractExecutionType(body);
        log.info("SAP RFC_004 판매실적 실행 요청 — executionType={}", executionType);
        Map<String, Object> result = sapRfcCallerService.callRfc004(executionType);
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_004 판매실적 실행 완료"));
    }

    /**
     * RFC_005: 전월 마감실적.
     * <p>rfc_param → I_YYYYMM: 마감 대상 년월 (YYYYMM 형식, 미입력 시 전월 자동)</p>
     * <p>쿼리 파라미터 {@code ?yearMonth=202605}도 지원하며, 본문 rfc_param이 우선.</p>
     */
    @PostMapping("/005")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc005(
            @RequestParam(value = "yearMonth", required = false) String yearMonth,
            @RequestBody(required = false) Map<String, Object> body) {
        String rfcParam = extractRfcParam(body);
        String executionType = extractExecutionType(body);
        // 본문 rfc_param 우선 → 쿼리 파라미터 fallback → null(서비스에서 전월 자동 계산)
        String effectiveYearMonth = (rfcParam != null) ? rfcParam : yearMonth;
        log.info("SAP RFC_005 월말마감실적 실행 요청 — yearMonth={}, executionType={} (body.rfc_param={}, query.yearMonth={})",
                effectiveYearMonth, executionType, rfcParam, yearMonth);
        Map<String, Object> result = sapRfcCallerService.callRfc005(effectiveYearMonth, executionType);
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_005 월말마감실적 실행 완료"));
    }

    /**
     * RFC_006: 리뉴얼 자재 송신.
     * <p>rfc_param → I_TYPE: A=전체(기본), B=변경분</p>
     * <p>쿼리 파라미터 {@code ?type=B}도 지원하며, 본문 rfc_param이 우선.</p>
     */
    @PostMapping("/006")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc006(
            @RequestParam(value = "type", required = false) String type,
            @RequestBody(required = false) Map<String, Object> body) {
        String rfcParam = extractRfcParam(body);
        String executionType = extractExecutionType(body);
        // 본문 rfc_param 우선 → 쿼리 파라미터 fallback → 기본값 "A"
        String effectiveType = (rfcParam != null) ? rfcParam : (type != null ? type : "A");
        log.info("SAP RFC_006 리뉴얼자재연결 실행 요청 — type={}, executionType={} (body.rfc_param={}, query.type={})",
                effectiveType, executionType, rfcParam, type);
        Map<String, Object> result = sapRfcCallerService.callRfc006(effectiveType, executionType);
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_006 리뉴얼자재연결 실행 완료"));
    }
}
