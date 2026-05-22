package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.service.SapRfcCallerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * SAP RFC 호출 API.
 * 수동 실행 또는 스케줄링 트리거를 통해 SAP RFC를 호출합니다.
 *
 * <h3>엔드포인트 목록</h3>
 * <ul>
 *   <li>{@code POST /sales-api/sap/rfc/execute-all} — 6개 RFC 일괄 실행</li>
 *   <li>{@code POST /sales-api/sap/rfc/001} — RFC_001 자재마스터</li>
 *   <li>{@code POST /sales-api/sap/rfc/002} — RFC_002 일자별재고</li>
 *   <li>{@code POST /sales-api/sap/rfc/003} — RFC_003 생산실적</li>
 *   <li>{@code POST /sales-api/sap/rfc/004} — RFC_004 판매실적</li>
 *   <li>{@code POST /sales-api/sap/rfc/005} — RFC_005 월말마감실적</li>
 *   <li>{@code POST /sales-api/sap/rfc/006} — RFC_006 리뉴얼자재연결</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/sales-api/sap/rfc")
@RequiredArgsConstructor
public class SapRfcController {

    private final SapRfcCallerService sapRfcCallerService;

    /**
     * 6개 RFC 일괄 실행.
     * 순서: 001(자재마스터) → 002(일자별재고) → 003(생산실적)
     *       → 004(판매실적) → 005(월말마감) → 006(리뉴얼자재)
     */
    @PostMapping("/execute-all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeAll() {
        log.info("SAP RFC 일괄 실행 요청 수신");
        Map<String, Object> result = sapRfcCallerService.executeAllRfcs("MANUAL");
        return ResponseEntity.ok(ApiResponse.ok(result, "SAP RFC 일괄 실행 완료"));
    }

    /**
     * RFC_001: 자재마스터 송신.
     *
     * @param type A=전체(기본), B=변경분
     */
    @PostMapping("/001")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc001(
            @RequestParam(value = "type", defaultValue = "A") String type) {
        log.info("SAP RFC_001 자재마스터 실행 요청 — type={}", type);
        Map<String, Object> result = sapRfcCallerService.callRfc001(type, "MANUAL");
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_001 자재마스터 실행 완료"));
    }

    /**
     * RFC_002: 일자별재고.
     */
    @PostMapping("/002")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc002() {
        log.info("SAP RFC_002 일자별재고 실행 요청");
        Map<String, Object> result = sapRfcCallerService.callRfc002("MANUAL");
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_002 일자별재고 실행 완료"));
    }

    /**
     * RFC_003: 일자별 생산 실적.
     */
    @PostMapping("/003")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc003() {
        log.info("SAP RFC_003 생산실적 실행 요청");
        Map<String, Object> result = sapRfcCallerService.callRfc003("MANUAL");
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_003 생산실적 실행 완료"));
    }

    /**
     * RFC_004: 판매실적.
     */
    @PostMapping("/004")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc004() {
        log.info("SAP RFC_004 판매실적 실행 요청");
        Map<String, Object> result = sapRfcCallerService.callRfc004("MANUAL");
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_004 판매실적 실행 완료"));
    }

    /**
     * RFC_005: 전월 마감실적.
     *
     * @param yearMonth 마감 대상 년월 (YYYYMM 형식, 미입력 시 전월 자동)
     */
    @PostMapping("/005")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc005(
            @RequestParam(value = "yearMonth", required = false) String yearMonth) {
        log.info("SAP RFC_005 월말마감실적 실행 요청 — yearMonth={}", yearMonth);
        Map<String, Object> result = sapRfcCallerService.callRfc005(yearMonth, "MANUAL");
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_005 월말마감실적 실행 완료"));
    }

    /**
     * RFC_006: 리뉴얼 자재 송신.
     *
     * @param type A=전체(기본), B=변경분
     */
    @PostMapping("/006")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeRfc006(
            @RequestParam(value = "type", defaultValue = "A") String type) {
        log.info("SAP RFC_006 리뉴얼자재연결 실행 요청 — type={}", type);
        Map<String, Object> result = sapRfcCallerService.callRfc006(type, "MANUAL");
        return ResponseEntity.ok(ApiResponse.ok(result, "RFC_006 리뉴얼자재연결 실행 완료"));
    }
}
