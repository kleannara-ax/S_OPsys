package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.SalesPlanUploadHistoryDto;
import com.company.module.sales.entity.SalesPlanUploadHistory;
import com.company.module.sales.service.SalesPlanUploadHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/sales-api/sales-plan-upload-history")
@RequiredArgsConstructor
public class SalesPlanUploadHistoryController {

    private final SalesPlanUploadHistoryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SalesPlanUploadHistory>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SalesPlanUploadHistory>> create(@Valid @RequestBody SalesPlanUploadHistoryDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.create(dto), "이력 저장 완료"));
    }
}
