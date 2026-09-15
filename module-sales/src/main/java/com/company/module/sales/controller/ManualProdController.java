package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.entity.ManualProd;
import com.company.module.sales.service.ManualProdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 수작업 생산계획 REST API
 *
 * GET    /sales-api/manual-prods          — 전체 조회
 * GET    /sales-api/manual-prods/{id}     — 단건 조회
 * POST   /sales-api/manual-prods          — 단건 생성
 * DELETE /sales-api/manual-prods/{id}     — 단건 삭제
 * POST   /sales-api/manual-prods/bulk     — 벌크 저장 (엑셀 업로드)
 * DELETE /sales-api/manual-prods/bulk     — 다건 삭제
 */
@RestController
@RequestMapping("/sales-api/manual-prods")
@RequiredArgsConstructor
public class ManualProdController {

    private final ManualProdService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ManualProd>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ManualProd>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ManualProd>> create(@RequestBody ManualProd entity) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(entity), "등록 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

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

        List<ManualProd> entities = rawRecords.stream().map(r -> {
            ManualProd p = new ManualProd();
            p.setPlanDate(str(r, "plan_date"));
            p.setProductionLine(str(r, "production_line"));
            p.setType(str(r, "type"));
            p.setComposition(str(r, "composition"));
            p.setProductCode(str(r, "product_code"));
            p.setProductionQty(dbl(r, "production_qty"));
            p.setInputItem1Code(str(r, "input_item1_code"));
            p.setConvertedQty1(dbl(r, "converted_qty1"));
            p.setInputItem2Code(str(r, "input_item2_code"));
            p.setConvertedQty2(dbl(r, "converted_qty2"));
            p.setInputItem3Code(str(r, "input_item3_code"));
            p.setConvertedQty3(dbl(r, "converted_qty3"));
            p.setInputItem4Code(str(r, "input_item4_code"));
            p.setConvertedQty4(dbl(r, "converted_qty4"));
            p.setRemark(str(r, "remark"));
            return p;
        }).collect(Collectors.toList());

        Map<String, Object> result = service.bulkSave(entities, mode);
        return ResponseEntity.ok(ApiResponse.ok(result, "벌크 저장 완료"));
    }

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
        return ResponseEntity.ok(ApiResponse.ok(Map.of("deleted", ids.size()), "삭제 완료"));
    }

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
