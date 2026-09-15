package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.entity.ManualBom;
import com.company.module.sales.service.ManualBomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 수작업 BOM REST API
 *
 * GET    /sales-api/manual-boms          — 전체 조회
 * GET    /sales-api/manual-boms/{id}     — 단건 조회
 * POST   /sales-api/manual-boms          — 단건 생성
 * PUT    /sales-api/manual-boms/{id}     — 단건 수정
 * DELETE /sales-api/manual-boms/{id}     — 단건 삭제
 * POST   /sales-api/manual-boms/bulk     — 벌크 저장 (엑셀 업로드)
 * DELETE /sales-api/manual-boms/bulk     — 다건 삭제
 */
@RestController
@RequestMapping("/sales-api/manual-boms")
@RequiredArgsConstructor
public class ManualBomController {

    private final ManualBomService service;

    /**
     * 전체 조회 (구분 → 제품코드 순 정렬)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ManualBom>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    /**
     * 단건 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ManualBom>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    /**
     * 단건 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ManualBom>> create(@RequestBody ManualBom entity) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(entity), "등록 완료"));
    }

    /**
     * 단건 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ManualBom>> update(@PathVariable Long id,
                                                          @RequestBody ManualBom entity) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, entity), "수정 완료"));
    }

    /**
     * 단건 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    /**
     * 벌크 저장 — 엑셀 업로드용
     * body: { "mode": "append"|"replace", "records": [ ... ] }
     */
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkSave(
            @RequestBody Map<String, Object> payload) {

        String mode = payload.getOrDefault("mode", "append").toString();

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rawRecords = (List<Map<String, Object>>) payload.get("records");
        if (rawRecords == null || rawRecords.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("records 항목이 비어 있습니다."));
        }

        List<ManualBom> entities = rawRecords.stream().map(r -> {
            ManualBom bom = new ManualBom();
            bom.setType(str(r, "type"));
            bom.setComposition(str(r, "composition"));
            bom.setProductCode(str(r, "product_code"));
            bom.setInputItem1Code(str(r, "input_item1_code"));
            bom.setInputQty1(dbl(r, "input_qty1"));
            bom.setInputItem2Code(str(r, "input_item2_code"));
            bom.setInputQty2(dbl(r, "input_qty2"));
            bom.setInputItem3Code(str(r, "input_item3_code"));
            bom.setInputQty3(dbl(r, "input_qty3"));
            bom.setInputItem4Code(str(r, "input_item4_code"));
            bom.setInputQty4(dbl(r, "input_qty4"));
            return bom;
        }).collect(Collectors.toList());

        Map<String, Object> result = service.bulkSave(entities, mode);
        return ResponseEntity.ok(ApiResponse.ok(result, "벌크 저장 완료"));
    }

    /**
     * 다건 삭제
     * body: { "ids": [1, 2, 3] }
     */
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkDelete(
            @RequestBody Map<String, Object> payload) {

        @SuppressWarnings("unchecked")
        List<Object> rawIds = (List<Object>) payload.get("ids");
        if (rawIds == null || rawIds.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ids 항목이 비어 있습니다."));
        }

        List<Long> ids = rawIds.stream()
                .map(o -> Long.valueOf(o.toString()))
                .collect(Collectors.toList());

        service.deleteByIds(ids);

        Map<String, Object> result = Map.of("deleted", ids.size());
        return ResponseEntity.ok(ApiResponse.ok(result, "삭제 완료"));
    }

    /* ── 유틸 ── */

    private static String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString().trim() : null;
    }

    private static Double dbl(Map<String, Object> map, String key) {
        Object v = map.get(key);
        if (v == null) return null;
        try {
            return Double.valueOf(v.toString().replaceAll(",", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
