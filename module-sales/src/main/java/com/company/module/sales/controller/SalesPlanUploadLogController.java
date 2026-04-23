package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.entity.SalesPlanUploadLog;
import com.company.module.sales.service.SalesPlanUploadLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales-api/sales-plan-upload-logs")
@RequiredArgsConstructor
public class SalesPlanUploadLogController {

    private final SalesPlanUploadLogService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SalesPlanUploadLog>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }
}
