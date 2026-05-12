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
    public ResponseEntity<ApiResponse<SnopRecord>> create(@Valid @RequestBody SnopRecordDto dto) {
        try {
            SnopRecord saved = service.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(saved, "등록 완료"));
        } catch (IllegalStateException e) {
            String msg = e.getMessage();
            if (msg != null && msg.startsWith("DUPLICATE:")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.error("DUPLICATE", "이미 등록된 자재입니다."));
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
