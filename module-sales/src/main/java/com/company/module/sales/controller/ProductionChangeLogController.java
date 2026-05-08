package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.entity.ProductionChangeLog;
import com.company.module.sales.service.ProductionChangeLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales-api/production-change-logs")
@RequiredArgsConstructor
public class ProductionChangeLogController {

    private final ProductionChangeLogService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductionChangeLog>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @GetMapping("/by-item/{itemCode}")
    public ResponseEntity<ApiResponse<List<ProductionChangeLog>>> listByItem(@PathVariable String itemCode) {
        return ResponseEntity.ok(ApiResponse.ok(service.findByItemCode(itemCode)));
    }
}
