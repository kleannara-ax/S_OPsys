package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.entity.InterfaceHistory;
import com.company.module.sales.service.InterfaceHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales-api/interface-histories")
@RequiredArgsConstructor
public class InterfaceHistoryController {

    private final InterfaceHistoryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InterfaceHistory>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @GetMapping("/by-interface/{interfaceId}")
    public ResponseEntity<ApiResponse<List<InterfaceHistory>>> listByInterface(@PathVariable String interfaceId) {
        return ResponseEntity.ok(ApiResponse.ok(service.findByInterfaceId(interfaceId)));
    }

    @GetMapping("/errors")
    public ResponseEntity<ApiResponse<List<InterfaceHistory>>> listErrors() {
        return ResponseEntity.ok(ApiResponse.ok(service.findErrors()));
    }

    @GetMapping("/latest-per-interface")
    public ResponseEntity<ApiResponse<List<InterfaceHistory>>> latestPerInterface() {
        return ResponseEntity.ok(ApiResponse.ok(service.findLatestPerInterface()));
    }

    @PostMapping("/{id}/retry")
    public ResponseEntity<ApiResponse<InterfaceHistory>> retry(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.retry(id), "재수행 완료"));
    }

    @PostMapping("/manual-execute/{interfaceId}")
    public ResponseEntity<ApiResponse<InterfaceHistory>> manualExecute(@PathVariable String interfaceId) {
        return ResponseEntity.ok(ApiResponse.ok(service.executeManually(interfaceId), "수동 실행 완료"));
    }
}
