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
     * SnopRecord 중복 데이터 정리 (Task 46)
     * 동일 item_code(대소문자 무시) + plan_month 조합에 2건 이상 존재하는 경우,
     * 데이터가 더 풍부한 레코드 1건을 남기고 나머지를 병합 후 삭제한다.
     * 배포 후 1회 호출하면 기존 중복 데이터가 정리된다.
     */
    @PostMapping("/cleanup-duplicates")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cleanupDuplicates() {
        Map<String, Object> result = service.cleanupDuplicateRecords();
        int deletedCount = (int) result.getOrDefault("deleted_count", 0);
        int groupCount = (int) result.getOrDefault("duplicate_group_count", 0);
        String message = groupCount > 0
                ? groupCount + "개 중복 그룹에서 " + deletedCount + "건 삭제 완료"
                : "중복 데이터가 없습니다.";
        return ResponseEntity.ok(ApiResponse.ok(result, message));
    }
}
