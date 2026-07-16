package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.MonthlySalesRecordDto;
import com.company.module.sales.entity.MonthlySalesRecord;
import com.company.module.sales.service.MonthlySalesRecordService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales-api/monthly-sales-records")
@RequiredArgsConstructor
public class MonthlySalesRecordController {

    private final MonthlySalesRecordService service;

    /** 전체 조회 (optional: from, to 범위 필터) */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MonthlySalesRecord>>> list(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        List<MonthlySalesRecord> records;
        if (from != null && to != null) {
            records = service.findByRange(from, to);
        } else {
            records = service.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(records));
    }

    /** 단건 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MonthlySalesRecord>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    /** 특정 마감월 조회 */
    @GetMapping("/by-month/{closingMonth}")
    public ResponseEntity<ApiResponse<List<MonthlySalesRecord>>> getByMonth(@PathVariable String closingMonth) {
        return ResponseEntity.ok(ApiResponse.ok(service.findByClosingMonth(closingMonth)));
    }

    /** 고유 마감월 목록 */
    @GetMapping("/months")
    public ResponseEntity<ApiResponse<List<String>>> getMonths() {
        return ResponseEntity.ok(ApiResponse.ok(service.findDistinctMonths()));
    }

    /** 단건 등록 */
    @PostMapping
    public ResponseEntity<ApiResponse<MonthlySalesRecord>> create(@Valid @RequestBody MonthlySalesRecordDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    /** 단건 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MonthlySalesRecord>> update(@PathVariable Long id,
                                                                    @Valid @RequestBody MonthlySalesRecordDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    /** 단건 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    /** 엑셀 업로드용 bulk upsert (source='UPLOAD') */
    @PostMapping("/bulk/{closingMonth}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkUpsert(
            @PathVariable String closingMonth,
            @RequestBody List<MonthlySalesRecordDto> items) {
        return ResponseEntity.ok(ApiResponse.ok(service.bulkUpsertByMonth(closingMonth, items)));
    }

    /** MonthlyClosing(RFC005) → MonthlySalesRecord 특정 월 동기화 */
    @PostMapping("/sync/{closingMonth}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncFromMonthlyClosing(
            @PathVariable String closingMonth) {
        return ResponseEntity.ok(ApiResponse.ok(service.syncFromMonthlyClosing(closingMonth),
                closingMonth + " 동기화 완료"));
    }

    /** MonthlyClosing(RFC005) → MonthlySalesRecord 전체 월 동기화 */
    @PostMapping("/sync-all")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> syncAllFromMonthlyClosing() {
        return ResponseEntity.ok(ApiResponse.ok(service.syncAllFromMonthlyClosing(), "전체 동기화 완료"));
    }

}
