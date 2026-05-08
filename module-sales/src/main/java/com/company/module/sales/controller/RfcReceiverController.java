package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.service.RfcReceiverService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * RFC 수신 컨트롤러
 * SAP에서 RFC를 통해 전송하는 데이터를 수신하는 REST API 엔드포인트
 */
@RestController
@RequestMapping("/sales-api/rfc")
@RequiredArgsConstructor
@Slf4j
public class RfcReceiverController {

    private final RfcReceiverService rfcReceiverService;

    @PostMapping("/SNOP_RFC_001")
    public ResponseEntity<ApiResponse<Map<String, Object>>> receiveRfc001(@RequestBody Map<String, Object> request) {
        log.info("[RFC-RECEIVER] SNOP_RFC_001 자재마스터 수신 요청");
        return processRfcRequest("SNOP_RFC_001", request);
    }

    @PostMapping("/SNOP_RFC_002")
    public ResponseEntity<ApiResponse<Map<String, Object>>> receiveRfc002(@RequestBody Map<String, Object> request) {
        log.info("[RFC-RECEIVER] SNOP_RFC_002 일자별재고 수신 요청");
        return processRfcRequest("SNOP_RFC_002", request);
    }

    @PostMapping("/SNOP_RFC_003")
    public ResponseEntity<ApiResponse<Map<String, Object>>> receiveRfc003(@RequestBody Map<String, Object> request) {
        log.info("[RFC-RECEIVER] SNOP_RFC_003 생산실적 수신 요청");
        return processRfcRequest("SNOP_RFC_003", request);
    }

    @PostMapping("/SNOP_RFC_004")
    public ResponseEntity<ApiResponse<Map<String, Object>>> receiveRfc004(@RequestBody Map<String, Object> request) {
        log.info("[RFC-RECEIVER] SNOP_RFC_004 판매실적 수신 요청");
        return processRfcRequest("SNOP_RFC_004", request);
    }

    @PostMapping("/SNOP_RFC_005")
    public ResponseEntity<ApiResponse<Map<String, Object>>> receiveRfc005(@RequestBody Map<String, Object> request) {
        log.info("[RFC-RECEIVER] SNOP_RFC_005 월말마감실적 수신 요청");
        return processRfcRequest("SNOP_RFC_005", request);
    }

    @PostMapping("/SNOP_RFC_006")
    public ResponseEntity<ApiResponse<Map<String, Object>>> receiveRfc006(@RequestBody Map<String, Object> request) {
        log.info("[RFC-RECEIVER] SNOP_RFC_006 리뉴얼자재연결 수신 요청");
        return processRfcRequest("SNOP_RFC_006", request);
    }

    @PostMapping("/{rfcId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> receiveRfc(
            @PathVariable String rfcId, @RequestBody Map<String, Object> request) {
        log.info("[RFC-RECEIVER] RFC 수신 요청: {}", rfcId);
        return processRfcRequest(rfcId, request);
    }

    @GetMapping("/mappings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRfcMappings() {
        Map<String, Object> mappings = new LinkedHashMap<>();

        mappings.put("SNOP_RFC_001", Map.of(
                "rfc_name", "자재마스터", "target_table", "MOD_SALES_BASE_MATERIAL_MASTER",
                "direction", "SAP → S&OP", "key_field", "item_code"));
        mappings.put("SNOP_RFC_002", Map.of(
                "rfc_name", "일자별재고", "target_table", "MOD_PLANT_STORAGE_LOCATION",
                "direction", "SAP → S&OP", "key_fields", "plan_month (삭제 후 재등록)"));
        mappings.put("SNOP_RFC_003", Map.of(
                "rfc_name", "생산실적", "target_table", "MOD_SALES_SNOP_RECORD",
                "direction", "SAP → S&OP", "key_fields", "item_code + plan_month + plant_code"));
        mappings.put("SNOP_RFC_004", Map.of(
                "rfc_name", "판매실적", "target_table", "MOD_SALES_SNOP_RECORD",
                "direction", "SAP → S&OP", "key_fields", "item_code + plan_month"));
        mappings.put("SNOP_RFC_005", Map.of(
                "rfc_name", "월말마감실적", "target_table", "MOD_SALES_MONTHLY_CLOSING",
                "direction", "SAP → S&OP", "key_fields", "item_code + closing_month"));
        mappings.put("SNOP_RFC_006", Map.of(
                "rfc_name", "리뉴얼자재연결", "target_table", "MOD_SALES_RENEWAL_MATERIAL_LINKAGE",
                "direction", "SAP → S&OP", "key_field", "legacy_item_code"));

        return ResponseEntity.ok(ApiResponse.ok(mappings));
    }

    @SuppressWarnings("unchecked")
    private ResponseEntity<ApiResponse<Map<String, Object>>> processRfcRequest(String rfcId, Map<String, Object> request) {
        try {
            Object dataObj = request.get("data");
            if (dataObj == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("INVALID_REQUEST", "요청 본문에 'data' 배열이 필요합니다."));
            }
            if (!(dataObj instanceof List)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("INVALID_FORMAT", "'data'는 배열(JSON Array) 형식이어야 합니다."));
            }

            String rfcIdUpper = rfcId.toUpperCase();
            List<String> supported = List.of("SNOP_RFC_001","SNOP_RFC_002","SNOP_RFC_003","SNOP_RFC_004","SNOP_RFC_005","SNOP_RFC_006");
            if (!supported.contains(rfcIdUpper)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("UNKNOWN_RFC", "지원하지 않는 RFC ID입니다: " + rfcId));
            }

            List<Map<String, Object>> dataList = (List<Map<String, Object>>) dataObj;
            if (dataList.isEmpty()) {
                Map<String, Object> emptyResult = new LinkedHashMap<>();
                emptyResult.put("rfc_id", rfcId);
                emptyResult.put("status", "SUCCESS");
                emptyResult.put("message", "RFC 수신 엔드포인트 연결 성공 (데이터 0건)");
                emptyResult.put("total_received", 0);
                return ResponseEntity.ok(ApiResponse.ok(emptyResult));
            }

            String executionType = request.containsKey("execution_type")
                    ? request.get("execution_type").toString() : "RFC";

            Map<String, Object> result;
            switch (rfcIdUpper) {
                case "SNOP_RFC_001": result = rfcReceiverService.processRfc001(dataList, executionType); break;
                case "SNOP_RFC_002": result = rfcReceiverService.processRfc002(dataList, executionType); break;
                case "SNOP_RFC_003": result = rfcReceiverService.processRfc003(dataList, executionType); break;
                case "SNOP_RFC_004": result = rfcReceiverService.processRfc004(dataList, executionType); break;
                case "SNOP_RFC_005":
                    String inputYearMonth = null;
                    Object rfcParamObj = request.get("rfc_param");
                    if (rfcParamObj != null) {
                        String paramStr = rfcParamObj.toString().trim().replaceAll("[\"' ]", "");
                        if (!paramStr.isEmpty()) inputYearMonth = paramStr;
                    }
                    result = rfcReceiverService.processRfc005(dataList, executionType, inputYearMonth);
                    break;
                case "SNOP_RFC_006": result = rfcReceiverService.processRfc006(dataList, executionType); break;
                default: return ResponseEntity.badRequest()
                        .body(ApiResponse.error("UNKNOWN_RFC", "지원하지 않는 RFC ID입니다: " + rfcId));
            }
            return ResponseEntity.ok(ApiResponse.ok(result));

        } catch (Exception e) {
            log.error("[RFC-RECEIVER] {} 처리 중 오류: {}", rfcId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("PROCESSING_ERROR", "RFC 처리 중 오류: " + e.getMessage()));
        }
    }
}
