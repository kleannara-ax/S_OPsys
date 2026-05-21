package com.company.module.sales.service;

import com.company.module.sales.config.SapJCoConfig;
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
 * <p>JCo 라이브러리(sapjco3.jar + libsapjco3.so)가 libs/ 폴더에 있으면
 * 실제 SAP 연결 테스트(ping)를 수행하고, 없으면 설정 유효성만 검증합니다.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SapConnectionService {

    private final SapProperties sapProperties;

    /** JCo 라이브러리 사용 가능 여부 (클래스 로드 시 1회 판단) */
    private static final boolean JCO_AVAILABLE;

    static {
        boolean available = false;
        try {
            Class.forName("com.sap.conn.jco.JCoDestinationManager");
            available = true;
        } catch (ClassNotFoundException e) {
            // JCo 라이브러리 미설치 — 설정 검증 모드로 동작
        }
        JCO_AVAILABLE = available;
    }

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
        info.put("jco_library_installed", JCO_AVAILABLE);
        return info;
    }

    /**
     * SAP 연결 테스트를 수행합니다.
     * - JCo 있음: 실제 SAP ping 테스트
     * - JCo 없음: 설정 유효성만 검증
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

        if (!JCO_AVAILABLE) {
            result.put("success", true);
            result.put("jco_installed", false);
            result.put("message", "SAP 연결 설정은 유효합니다. "
                    + "libs/ 폴더에 sapjco3.jar, libsapjco3.so를 넣은 후 실제 연결 테스트가 가능합니다.");
            result.put("connection_info", getConnectionInfo());
            return result;
        }

        // JCo 라이브러리가 있으면 실제 ping 테스트
        try {
            Object destination = Class.forName("com.sap.conn.jco.JCoDestinationManager")
                    .getMethod("getDestination", String.class)
                    .invoke(null, SapJCoConfig.DESTINATION_NAME);

            destination.getClass().getMethod("ping").invoke(destination);

            result.put("success", true);
            result.put("jco_installed", true);
            result.put("message", "SAP 서버 연결 성공!");
            result.put("connection_info", getConnectionInfo());

            log.info("SAP 연결 테스트 성공 — host={}, user={}", sapProperties.getHost(), sapProperties.getUser());
        } catch (Exception e) {
            String errorMsg = extractRootCause(e);
            result.put("success", false);
            result.put("jco_installed", true);
            result.put("message", "SAP 서버 연결 실패: " + errorMsg);
            result.put("connection_info", getConnectionInfo());

            log.error("SAP 연결 테스트 실패 — host={}, user={}, error={}",
                    sapProperties.getHost(), sapProperties.getUser(), errorMsg);
        }
        return result;
    }

    /**
     * JCo 라이브러리 설치 여부를 반환합니다.
     */
    public boolean isJCoAvailable() {
        return JCO_AVAILABLE;
    }

    private String maskPassword(String password) {
        if (password == null || password.isEmpty()) return "(미설정)";
        if (password.length() <= 2) return "**";
        return password.charAt(0) + "*".repeat(password.length() - 2) + password.charAt(password.length() - 1);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String extractRootCause(Exception e) {
        Throwable cause = e;
        while (cause.getCause() != null) {
            cause = cause.getCause();
        }
        return cause.getMessage() != null ? cause.getMessage() : cause.getClass().getSimpleName();
    }
}
