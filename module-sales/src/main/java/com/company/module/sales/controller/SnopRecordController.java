package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.PageResponse;
import com.company.module.sales.dto.SnopRecordDto;
import com.company.module.sales.entity.SnopRecord;
import com.company.module.sales.service.SnopRecordService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/sales-api/snop-records")
@RequiredArgsConstructor
public class SnopRecordController {

    private final SnopRecordService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<SnopRecord>>> list(
            @PageableDefault(size = 500, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.findAll(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SnopRecord>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @GetMapping("/check-duplicate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkDuplicate(
            @RequestParam("item_code") String itemCode,
            @RequestParam("month") String month) {
        return ResponseEntity.ok(ApiResponse.ok(service.checkDuplicate(itemCode, month)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(@Valid @RequestBody SnopRecordDto dto) {
        try {
            SnopRecord saved = service.create(dto);
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("id", saved.getId());
            data.put("item_code", saved.getItemCode());
            data.put("plan_month", saved.getPlanMonth());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(data, "등록 완료"));
        } catch (IllegalStateException e) {
            String msg = e.getMessage();
            if (msg != null && msg.startsWith("DUPLICATE:")) {
                // DUPLICATE:itemCode:planMonth:existingId 형식에서 existing_id 추출
                String[] parts = msg.split(":");
                Map<String, Object> dupInfo = new LinkedHashMap<>();
                dupInfo.put("duplicate", true);
                if (parts.length > 1) dupInfo.put("item_code", parts[1]);
                if (parts.length > 2) dupInfo.put("plan_month", parts[2]);
                if (parts.length > 3) {
                    try { dupInfo.put("existing_id", Long.parseLong(parts[3])); }
                    catch (NumberFormatException ignored) {}
                }
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.<Map<String, Object>>builder()
                                .success(false)
                                .error("DUPLICATE")
                                .message("이미 등록된 자재입니다.")
                                .data(dupInfo)
                                .build());
            }
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SnopRecord>> update(@PathVariable Long id,
                                                           @Valid @RequestBody SnopRecordDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    /**
     * 기존 SnopRecord 중 자재명/카테고리/생산라인이 비어있는 레코드에
     * BaseMaterialMaster 정보를 일괄 보충한다.
     * 배포 후 1회 호출하면 기존 데이터가 보정된다.
     */
    @PostMapping("/enrich-from-master")
    public ResponseEntity<ApiResponse<Map<String, Object>>> enrichFromMaster() {
        Map<String, Object> result = service.enrichAllFromMaterialMaster();
        int enrichedCount = (int) result.getOrDefault("enriched_count", 0);
        return ResponseEntity.ok(ApiResponse.ok(result, enrichedCount + "건 자재정보 보충 완료"));
    }

    /**
     * 자재마스터 기준으로 SnopRecord의 카테고리/자재명/생산라인 등을 강제 동기화.
     * 기존 값이 있어도 마스터 값으로 덮어씀.
     */
    @PostMapping("/sync-from-master")
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncFromMaster() {
        Map<String, Object> result = service.syncAllFromMaterialMaster();
        int syncedCount = (int) result.getOrDefault("synced_count", 0);
        return ResponseEntity.ok(ApiResponse.ok(result, syncedCount + "건 자재정보 동기화 완료"));
    }
}
