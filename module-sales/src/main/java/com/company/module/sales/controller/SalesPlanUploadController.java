package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.SalesPlanUploadDto;
import com.company.module.sales.entity.SalesPlanUpload;
import com.company.module.sales.service.SalesPlanUploadService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales-api/sales-plan-uploads")
@RequiredArgsConstructor
public class SalesPlanUploadController {

    private final SalesPlanUploadService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SalesPlanUpload>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SalesPlanUpload>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SalesPlanUpload>> create(@Valid @RequestBody SalesPlanUploadDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SalesPlanUpload>> update(@PathVariable Long id,
                                                                @Valid @RequestBody SalesPlanUploadDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }
}
