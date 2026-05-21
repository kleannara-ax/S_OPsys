package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.service.SapConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * SAP RFC 연결 관리 API.
 */
@RestController
@RequestMapping("/sales-api/sap")
@RequiredArgsConstructor
public class SapConnectionController {

    private final SapConnectionService sapConnectionService;

    /** 현재 SAP 연결 설정 조회 (비밀번호 마스킹) */
    @GetMapping("/connection-info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getConnectionInfo() {
        return ResponseEntity.ok(ApiResponse.ok(sapConnectionService.getConnectionInfo(), "SAP 연결 설정 조회 완료"));
    }

    /** SAP 연결 테스트 */
    @GetMapping("/test-connection")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testConnection() {
        return ResponseEntity.ok(ApiResponse.ok(sapConnectionService.testConnection(), "SAP 연결 테스트 완료"));
    }
}
