package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.SalesPlanUploadDto;
import com.company.module.sales.entity.SalesPlanUpload;
import com.company.module.sales.service.SalesPlanSyncService;
import com.company.module.sales.service.SalesPlanUploadService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales-api/sales-plan-uploads")
@RequiredArgsConstructor
public class SalesPlanUploadController {

    private final SalesPlanUploadService service;
    private final SalesPlanSyncService syncService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SalesPlanUpload>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SalesPlanUpload>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SalesPlanUpload>> create(@Valid @RequestBody SalesPlanUploadDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SalesPlanUpload>> update(@PathVariable Long id,
                                                                @Valid @RequestBody SalesPlanUploadDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    /**
     * 판매계획 업로드 → 생산계획현황(SnopRecord) 전체 동기화.
     * 기존 데이터 마이그레이션 또는 수동 전체 동기화가 필요할 때 호출.
     */
    @PostMapping("/sync-to-snop")
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncAllToSnop() {
        int synced = syncService.syncAll();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("synced_count", synced);
        return ResponseEntity.ok(ApiResponse.ok(result, synced + "건 동기화 완료"));
    }
}
