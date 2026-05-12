package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.RenewalMaterialLinkageDto;
import com.company.module.sales.entity.RenewalMaterialLinkage;
import com.company.module.sales.repository.RenewalMaterialLinkageRepository;
import com.company.module.sales.service.RenewalMaterialLinkageService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/sales-api/renewal-material-linkages")
@RequiredArgsConstructor
@Slf4j
public class RenewalMaterialLinkageController {

    private final RenewalMaterialLinkageService service;
    private final RenewalMaterialLinkageRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RenewalMaterialLinkage>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(repo.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RenewalMaterialLinkage>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RenewalMaterialLinkage>> create(
            @Valid @RequestBody RenewalMaterialLinkageDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RenewalMaterialLinkage>> update(
            @PathVariable Long id, @Valid @RequestBody RenewalMaterialLinkageDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<RenewalMaterialLinkage>> toggleActive(@PathVariable Long id) {
        RenewalMaterialLinkage existing = service.findById(id);
        existing.setIsActive(!Boolean.TRUE.equals(existing.getIsActive()));
        return ResponseEntity.ok(ApiResponse.ok(repo.save(existing)));
    }

    @PatchMapping("/{id}/effective-month")
    public ResponseEntity<ApiResponse<RenewalMaterialLinkage>> updateEffectiveMonth(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        RenewalMaterialLinkage existing = service.findById(id);
        String month = body.get("effective_month");
        existing.setEffectiveMonth(month != null ? month.trim() : null);
        return ResponseEntity.ok(ApiResponse.ok(repo.save(existing)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    @PostMapping("/bulk")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkUpsert(@RequestBody Map<String, Object> request) {
        Object dataObj = request.get("data");
        if (!(dataObj instanceof List)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("INVALID_FORMAT", "data 필드는 배열이어야 합니다."));
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> dataList = (List<Map<String, Object>>) dataObj;

        int insertCount = 0, deleteCount = 0;
        List<String> errors = new ArrayList<>();

        for (int i = 0; i < dataList.size(); i++) {
            Map<String, Object> item = dataList.get(i);
            try {
                String legacyCode = getStr(item, "legacy_item_code");
                if (legacyCode == null || legacyCode.isBlank()) {
                    errors.add("Row " + (i + 1) + ": legacy_item_code 누락");
                    continue;
                }
                List<RenewalMaterialLinkage> existing = repo.findByLegacyItemCode(legacyCode);
                if (!existing.isEmpty()) {
                    repo.deleteAll(existing);
                    deleteCount += existing.size();
                }
                RenewalMaterialLinkage entity = RenewalMaterialLinkage.builder()
                        .legacyItemCode(legacyCode)
                        .legacyItemName(getStr(item, "legacy_item_name"))
                        .renewalItemCode1(getStr(item, "renewal_item_code_1"))
                        .renewalItemName1(getStr(item, "renewal_item_name_1"))
                        .renewalItemCode2(getStr(item, "renewal_item_code_2"))
                        .renewalItemName2(getStr(item, "renewal_item_name_2"))
                        .renewalItemCode3(getStr(item, "renewal_item_code_3"))
                        .renewalItemName3(getStr(item, "renewal_item_name_3"))
                        .renewalItemCode4(getStr(item, "renewal_item_code_4"))
                        .renewalItemName4(getStr(item, "renewal_item_name_4"))
                        .renewalItemCode5(getStr(item, "renewal_item_code_5"))
                        .renewalItemName5(getStr(item, "renewal_item_name_5"))
                        .effectiveMonth(getStr(item, "effective_month"))
                        .note(getStr(item, "note"))
                        .hierarchyName(getStr(item, "hierarchy_name"))
                        .isActive(true)
                        .build();
                repo.save(entity);
                insertCount++;
            } catch (Exception e) {
                log.error("Row {} 처리 중 오류: {}", i + 1, e.getMessage());
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", errors.isEmpty() ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("inserted", insertCount);
        result.put("deleted", deleteCount);
        if (!errors.isEmpty()) result.put("errors", errors);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    private String getStr(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString().trim() : null;
    }
}
