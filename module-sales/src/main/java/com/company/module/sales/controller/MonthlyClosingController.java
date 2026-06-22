package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.MonthlyClosingDto;
import com.company.module.sales.entity.MonthlyClosing;
import com.company.module.sales.service.MonthlyClosingService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales-api/monthly-closings")
@RequiredArgsConstructor
public class MonthlyClosingController {

    private final MonthlyClosingService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MonthlyClosing>>> list(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        List<MonthlyClosing> records;
        if (from != null && to != null) {
            records = service.findByRange(from, to);
        } else {
            records = service.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(records));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MonthlyClosing>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @GetMapping("/by-month/{closingMonth}")
    public ResponseEntity<ApiResponse<List<MonthlyClosing>>> getByMonth(@PathVariable String closingMonth) {
        return ResponseEntity.ok(ApiResponse.ok(service.findByClosingMonth(closingMonth)));
    }

    @GetMapping("/months")
    public ResponseEntity<ApiResponse<List<String>>> getMonths() {
        return ResponseEntity.ok(ApiResponse.ok(service.findDistinctMonths()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MonthlyClosing>> create(@Valid @RequestBody MonthlyClosingDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MonthlyClosing>> update(@PathVariable Long id,
                                                               @Valid @RequestBody MonthlyClosingDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    @PostMapping("/bulk/{closingMonth}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkUpsert(
            @PathVariable String closingMonth,
            @RequestBody List<MonthlyClosingDto> items) {
        return ResponseEntity.ok(ApiResponse.ok(service.bulkUpsertByMonth(closingMonth, items)));
    }
}
