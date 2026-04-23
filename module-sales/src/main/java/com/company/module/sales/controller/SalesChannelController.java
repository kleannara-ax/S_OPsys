package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.SalesChannelDto;
import com.company.module.sales.entity.SalesChannel;
import com.company.module.sales.service.SalesChannelService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.company.module.sales.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/sales-api/sales-channels")
@RequiredArgsConstructor
public class SalesChannelController {

    private final SalesChannelService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<SalesChannel>>> list(
            @PageableDefault(size = 500, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.findAll(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SalesChannel>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SalesChannel>> create(@Valid @RequestBody SalesChannelDto dto) {
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
