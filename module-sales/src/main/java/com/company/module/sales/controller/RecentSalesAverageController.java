package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.RecentSalesAverageDto;
import com.company.module.sales.entity.RecentSalesAverage;
import com.company.module.sales.service.RecentSalesAverageService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales-api/recent-sales-averages")
@RequiredArgsConstructor
public class RecentSalesAverageController {

    private final RecentSalesAverageService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecentSalesAverage>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RecentSalesAverage>> create(@Valid @RequestBody RecentSalesAverageDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }
}
