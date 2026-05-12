package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.OptimalInventoryBaselineDto;
import com.company.module.sales.entity.OptimalInventoryBaseline;
import com.company.module.sales.service.OptimalInventoryBaselineService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales-api/optimal-inventory-baselines")
@RequiredArgsConstructor
public class OptimalInventoryBaselineController {

    private final OptimalInventoryBaselineService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OptimalInventoryBaseline>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OptimalInventoryBaseline>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OptimalInventoryBaseline>> create(
            @Valid @RequestBody OptimalInventoryBaselineDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OptimalInventoryBaseline>> update(
            @PathVariable Long id, @Valid @RequestBody OptimalInventoryBaselineDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }
}
