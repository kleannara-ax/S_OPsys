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
}
