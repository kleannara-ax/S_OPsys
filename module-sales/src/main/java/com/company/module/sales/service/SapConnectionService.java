package com.company.module.sales.service;

import com.company.module.sales.config.SapProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * SAP RFC 연결 관리 서비스.
 * sap-connection.yml 설정 값을 기반으로 SAP 연결을 관리합니다.
 *
 * <p>현재는 설정 정보 조회 및 연결 테스트 기능을 제공하며,
 * SAP JCo 라이브러리 추가 후 실제 RFC 호출 기능이 활성화됩니다.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SapConnectionService {

    private final SapProperties sapProperties;

    /**
     * 현재 SAP 연결 설정 정보를 반환합니다 (비밀번호 마스킹).
     */
    public Map<String, Object> getConnectionInfo() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("host", sapProperties.getHost());
        info.put("system_number", sapProperties.getSystemNumber());
        info.put("client", sapProperties.getClient());
        info.put("user", sapProperties.getUser());
        info.put("password", maskPassword(sapProperties.getPassword()));
        info.put("language", sapProperties.getLanguage());
        info.put("pool_capacity", sapProperties.getPoolCapacity());
        info.put("peak_limit", sapProperties.getPeakLimit());
        return info;
    }

    /**
     * SAP 연결 테스트를 수행합니다.
     * JCo 라이브러리 추가 전까지는 설정 유효성만 검증합니다.
     */
    public Map<String, Object> testConnection() {
        Map<String, Object> result = new LinkedHashMap<>();

        // 필수 설정 검증
        if (isBlank(sapProperties.getHost())) {
            result.put("success", false);
            result.put("message", "SAP Host가 설정되지 않았습니다.");
            return result;
        }
        if (isBlank(sapProperties.getUser())) {
            result.put("success", false);
            result.put("message", "SAP User가 설정되지 않았습니다.");
            return result;
        }
        if (isBlank(sapProperties.getPassword())) {
            result.put("success", false);
            result.put("message", "SAP Password가 설정되지 않았습니다. sap-connection.yml에서 비밀번호를 입력해 주세요.");
            return result;
        }

        /*
         * TODO: SAP JCo 라이브러리 추가 후 실제 연결 테스트 코드 활성화
         *
         * JCoDestination destination = JCoDestinationManager.getDestination("SAP_SNOP");
         * destination.ping();
         */

        result.put("success", true);
        result.put("message", "SAP 연결 설정이 유효합니다. JCo 라이브러리 추가 후 실제 연결 테스트가 가능합니다.");
        result.put("connection_info", getConnectionInfo());

        log.info("SAP 연결 테스트 — host={}, user={}", sapProperties.getHost(), sapProperties.getUser());
        return result;
    }

    private String maskPassword(String password) {
        if (password == null || password.isEmpty()) return "(미설정)";
        if (password.length() <= 2) return "**";
        return password.charAt(0) + "*".repeat(password.length() - 2) + password.charAt(password.length() - 1);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
