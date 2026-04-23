package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.PageResponse;
import com.company.module.sales.entity.DataChangeHistory;
import com.company.module.sales.service.DataChangeHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/sales-api/data-change-history")
@RequiredArgsConstructor
public class DataChangeHistoryController {

    private final DataChangeHistoryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<DataChangeHistory>>> search(
            @RequestParam(required = false) String tableName,
            @RequestParam(required = false) String changeType,
            @RequestParam(required = false) String changedBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(
                service.search(tableName, changeType, changedBy, from, to,
                        PageRequest.of(page, Math.min(size, 500))))));
    }

    @GetMapping("/record")
    public ResponseEntity<ApiResponse<List<DataChangeHistory>>> getByRecord(
            @RequestParam String tableName,
            @RequestParam String recordId) {
        return ResponseEntity.ok(ApiResponse.ok(service.findByRecord(tableName, recordId)));
    }
}
