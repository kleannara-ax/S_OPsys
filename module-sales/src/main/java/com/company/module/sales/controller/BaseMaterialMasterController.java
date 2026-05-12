package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.BaseMaterialMasterDto;
import com.company.module.sales.dto.PageResponse;
import com.company.module.sales.entity.BaseMaterialMaster;
import com.company.module.sales.service.BaseMaterialMasterService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales-api/base-material-masters")
@RequiredArgsConstructor
public class BaseMaterialMasterController {

    private final BaseMaterialMasterService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BaseMaterialMaster>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<PageResponse<BaseMaterialMaster>>> listPaged(
            @PageableDefault(size = 500, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.findAll(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BaseMaterialMaster>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @GetMapping("/filter-options")
    public ResponseEntity<ApiResponse<Map<String, Object>>> filterOptions() {
        return ResponseEntity.ok(ApiResponse.ok(service.getFilterOptions()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BaseMaterialMaster>> create(@Valid @RequestBody BaseMaterialMasterDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BaseMaterialMaster>> update(@PathVariable Long id,
                                                                   @Valid @RequestBody BaseMaterialMasterDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    @PutMapping("/oem-vendor-moq-bulk")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkUpdateOemVendorMoq(
            @RequestBody List<Map<String, Object>> items) {
        return ResponseEntity.ok(ApiResponse.ok(service.bulkUpdateOemVendorMoq(items)));
    }
}
