package com.company.module.sales.service;

import com.company.module.sales.entity.InterfaceExecution;
import com.company.module.sales.entity.InterfaceHistory;
import com.company.module.sales.entity.InterfaceMaster;
import com.company.module.sales.repository.InterfaceExecutionRepository;
import com.company.module.sales.repository.InterfaceHistoryRepository;
import com.company.module.sales.repository.InterfaceMasterRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 인터페이스 스케줄러 서비스
 * - 매 30초마다 수행 예정 시간이 도래한 인터페이스를 실행
 * - exec_command(실행명령어) 우선 실행: 인터페이스 마스터에 등록된 명령어로 전체 로직 수행
 * - exec_command가 없고 rfcUrl만 있으면 RFC 실행
 *   → /sales-api/sap/rfc/XXX 패턴이면 SapRfcCallerService 직접 호출 (내부)
 *   → 그 외 URL이면 HTTP POST 호출 (외부)
 * - 인터페이스 이력을 기록
 */
@Service
@Slf4j
public class InterfaceSchedulerService {

    private final InterfaceExecutionRepository executionRepo;
    private final InterfaceHistoryRepository historyRepo;
    private final InterfaceMasterRepository masterRepo;
    private final SapRfcCallerService sapRfcCallerService;

    @Value("${server.port:8080}")
    private int serverPort;

    /**
     * 내부 SAP RFC URL 패턴: /sales-api/sap/rfc/001 ~ 006
     * 또는 이전 시드 데이터에서 사용하던 /sales/api/sap/rfc/001 패턴도 호환
     */
    private static final Pattern INTERNAL_RFC_PATTERN =
            Pattern.compile("^/sales[-/]api/sap/rfc/(\\d{3})");

    public InterfaceSchedulerService(InterfaceExecutionRepository executionRepo,
                                      InterfaceHistoryRepository historyRepo,
                                      InterfaceMasterRepository masterRepo,
                                      SapRfcCallerService sapRfcCallerService) {
        this.executionRepo = executionRepo;
        this.historyRepo = historyRepo;
        this.masterRepo = masterRepo;
        this.sapRfcCallerService = sapRfcCallerService;
    }

    /**
     * 매 30초마다 수행 예정 시간이 도래한 인터페이스를 확인하고 실행
     */
    @Scheduled(fixedRate = 30000)
    public void checkAndExecuteInterfaces() {
        LocalDateTime now = LocalDateTime.now();
        List<InterfaceExecution> dueExecutions = executionRepo.findByIsActiveTrueAndNextExecutionAtBefore(now);

        for (InterfaceExecution exec : dueExecutions) {
            try {
                log.info("[IF-SCHEDULER] 수행 시작: {} ({})", exec.getInterfaceId(), exec.getInterfaceName());

                // 인터페이스 마스터에서 실행 정보 조회
                Optional<InterfaceMaster> optMaster = masterRepo.findByInterfaceId(exec.getInterfaceId());
                if (optMaster.isEmpty()) {
                    log.warn("[IF-SCHEDULER] 마스터 미등록: {}", exec.getInterfaceId());
                    updateNextExecution(exec);
                    continue;
                }

                InterfaceMaster master = optMaster.get();
                String rfcUrl = master.getRfcUrl();
                String execCommand = master.getExecCommand();

                // RFC URL 또는 실행명령어가 모두 없으면 에러
                if ((rfcUrl == null || rfcUrl.trim().isEmpty()) &&
                    (execCommand == null || execCommand.trim().isEmpty())) {
                    log.warn("[IF-SCHEDULER] RFC URL 및 실행명령어 미등록: {}", exec.getInterfaceId());
                    InterfaceHistory history = InterfaceHistory.builder()
                            .interfaceId(exec.getInterfaceId())
                            .interfaceName(exec.getInterfaceName())
                            .executionType("SCHEDULED")
                            .startTime(now)
                            .endTime(LocalDateTime.now())
                            .durationMs(0L)
                            .processedCount(0)
                            .errorCount(0)
                            .status("ERROR")
                            .errorMessage("RFC URL 또는 실행명령어가 등록되지 않았습니다.")
                            .build();
                    historyRepo.save(history);
                    updateNextExecution(exec);
                    continue;
                }

                // exec_command(실행명령어) 우선 실행
                // → 인터페이스 마스터관리 화면에서 실행명령어를 등록하면 그 명령어로 전체 로직 수행
                // → exec_command가 없고 rfcUrl만 있으면 HTTP POST 호출 (fallback)
                if (execCommand != null && !execCommand.trim().isEmpty()) {
                    executeInterface(exec.getInterfaceId(), exec.getInterfaceName(),
                            execCommand, "SCHEDULED", null);
                } else if (rfcUrl != null && !rfcUrl.trim().isEmpty()) {
                    executeViaRfcUrl(exec.getInterfaceId(), exec.getInterfaceName(),
                            rfcUrl, master.getRfcParam(), "SCHEDULED", null);
                }

                // 마지막 수행일시 갱신 및 다음 수행일시 계산
                exec.setLastExecutedAt(LocalDateTime.now());
                updateNextExecution(exec);

            } catch (Exception e) {
                log.error("[IF-SCHEDULER] 수행 중 오류: {} - {}", exec.getInterfaceId(), e.getMessage(), e);
                updateNextExecution(exec);
            }
        }
    }

    /**
     * RFC URL을 통한 인터페이스 실행.
     * <p>/sales-api/sap/rfc/XXX 패턴이면 SapRfcCallerService를 직접 호출합니다 (내부).
     * 그 외 URL이면 HTTP POST로 호출합니다 (외부).</p>
     */
    public InterfaceHistory executeViaRfcUrl(String interfaceId, String interfaceName,
                                              String rfcUrl, String rfcParam,
                                              String executionType, Long retryOfId) {
        LocalDateTime startTime = LocalDateTime.now();
        InterfaceHistory history = InterfaceHistory.builder()
                .interfaceId(interfaceId)
                .interfaceName(interfaceName)
                .executionType(executionType)
                .startTime(startTime)
                .status("RUNNING")
                .execCommand("RFC: " + rfcUrl)
                .retryOfId(retryOfId)
                .build();
        history = historyRepo.save(history);

        try {
            String trimmedUrl = rfcUrl.trim();

            // ── 내부 SAP RFC 패턴 감지: /sales-api/sap/rfc/001 ~ 006 ──
            // /sales/api/sap/rfc/XXX (이전 시드) 패턴도 호환
            Matcher rfcMatcher = INTERNAL_RFC_PATTERN.matcher(trimmedUrl);
            if (rfcMatcher.find()) {
                // 내부 직접 호출 — HTTP 네트워크 우회
                String rfcNumber = rfcMatcher.group(1); // "001" ~ "006"
                log.info("[IF-EXEC-RFC] 내부 직접 호출: {} → RFC_{} (rfcParam={})",
                        interfaceId, rfcNumber, rfcParam);

                Map<String, Object> result = callInternalRfc(rfcNumber, rfcParam, executionType);

                LocalDateTime endTime = LocalDateTime.now();
                long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

                // 결과에서 처리건수 추출
                int processedCount = 0;
                // processRfc*()은 "insert_count"/"update_count" 키 사용
                if (result.containsKey("insert_count")) {
                    processedCount += toInt(result.get("insert_count"));
                }
                if (result.containsKey("update_count")) {
                    processedCount += toInt(result.get("update_count"));
                }
                if (result.containsKey("total_received")) {
                    processedCount = Math.max(processedCount, toInt(result.get("total_received")));
                }
                if (processedCount == 0 && result.containsKey("status")) {
                    processedCount = "SUCCESS".equals(result.get("status")) ? 1 : 0;
                }

                int rfcErrorCount = toInt(result.get("error_count"));
                String statusPrefix = "RETRY".equals(executionType) ? "RETRY_" : "";
                String statusSuffix = rfcErrorCount > 0 ? "PARTIAL_SUCCESS" : "SUCCESS";
                history.setStatus(statusPrefix + statusSuffix);
                history.setProcessedCount(processedCount);
                history.setErrorCount(rfcErrorCount);
                history.setEndTime(endTime);
                history.setDurationMs(durationMs);

                // 에러 메시지가 있으면 이력에 기록
                if (result.containsKey("errors")) {
                    Object errorsObj = result.get("errors");
                    if (errorsObj instanceof java.util.List && !((java.util.List<?>) errorsObj).isEmpty()) {
                        String errMsg = errorsObj.toString();
                        if (errMsg.length() > 1500) errMsg = errMsg.substring(0, 1500) + "...";
                        history.setErrorMessage(errMsg);
                    }
                }

                log.info("[IF-EXEC-RFC] 내부 호출 완료: {} (RFC_{}, 처리={}건, 에러={}건, {}ms)",
                        interfaceId, rfcNumber, processedCount, rfcErrorCount, durationMs);

            } else {
                // ── 외부 HTTP POST 호출 ──
                executeViaHttpPost(history, trimmedUrl, rfcParam, executionType, startTime);
            }

        } catch (Exception e) {
            LocalDateTime endTime = LocalDateTime.now();
            long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

            String statusPrefix = "RETRY".equals(executionType) ? "RETRY_" : "";
            history.setStatus(statusPrefix + "ERROR");
            history.setEndTime(endTime);
            history.setDurationMs(durationMs);
            history.setProcessedCount(0);
            history.setErrorCount(1);
            String errMsg = e.getMessage();
            if (errMsg != null && errMsg.length() > 1500) errMsg = errMsg.substring(0, 1500) + "...";
            history.setErrorMessage(errMsg);
            log.error("[IF-EXEC-RFC] 예외 발생: {} - {}", interfaceId, e.getMessage(), e);
        }

        return historyRepo.save(history);
    }

    /**
     * 내부 SAP RFC 직접 호출 — SapRfcCallerService를 통해 실행.
     * HTTP 네트워크 없이 직접 서비스 호출하므로 Connection Refused 문제가 없습니다.
     *
     * @param rfcNumber RFC 번호 ("001" ~ "006")
     * @param rfcParam  인터페이스 마스터의 RFC Param 값 (type 또는 yearMonth)
     * @param executionType 실행유형 (MANUAL / SCHEDULED / RETRY)
     * @return RFC 처리 결과 맵
     */
    private Map<String, Object> callInternalRfc(String rfcNumber, String rfcParam, String executionType) {
        // rfcParam에서 따옴표 제거 (DB에 "A" 형태로 저장된 경우 대비)
        String cleanParam = cleanRfcParam(rfcParam);

        switch (rfcNumber) {
            case "001":
                String type001 = (cleanParam != null && !cleanParam.isEmpty()) ? cleanParam : "A";
                return sapRfcCallerService.callRfc001(type001, executionType);

            case "002":
                return sapRfcCallerService.callRfc002(executionType);

            case "003":
                return sapRfcCallerService.callRfc003(executionType);

            case "004":
                return sapRfcCallerService.callRfc004(executionType);

            case "005":
                // rfcParam은 YYYYMM 형식, null이면 서비스에서 전월 자동 계산
                return sapRfcCallerService.callRfc005(cleanParam, executionType);

            case "006":
                String type006 = (cleanParam != null && !cleanParam.isEmpty()) ? cleanParam : "A";
                return sapRfcCallerService.callRfc006(type006, executionType);

            default:
                throw new IllegalArgumentException("지원하지 않는 RFC 번호: " + rfcNumber);
        }
    }

    /**
     * RFC Param 값에서 앞뒤 따옴표를 제거합니다.
     * 인터페이스 마스터에서 "A" (따옴표 포함) 형태로 입력한 경우 → A 로 변환.
     */
    private String cleanRfcParam(String rfcParam) {
        if (rfcParam == null) return null;
        String trimmed = rfcParam.trim();
        if (trimmed.isEmpty()) return null;
        // 앞뒤 따옴표 제거
        if (trimmed.length() >= 2 && trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
            trimmed = trimmed.substring(1, trimmed.length() - 1).trim();
        }
        return trimmed.isEmpty() ? null : trimmed;
    }

    /** Object를 int로 안전하게 변환 */
    private int toInt(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Number) return ((Number) obj).intValue();
        try { return Integer.parseInt(obj.toString()); } catch (NumberFormatException e) { return 0; }
    }

    /**
     * 외부 URL로 HTTP POST 호출 (기존 로직).
     */
    private void executeViaHttpPost(InterfaceHistory history, String rfcUrl, String rfcParam,
                                     String executionType, LocalDateTime startTime) throws Exception {
        String fullUrl = rfcUrl;
        if (fullUrl.startsWith("/")) {
            fullUrl = "http://localhost:" + serverPort + fullUrl;
        }

        log.info("[IF-EXEC-RFC] HTTP POST 호출: {} - URL: {}", history.getInterfaceId(), fullUrl);

        URL url = new URL(fullUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        conn.setConnectTimeout(30000);
        conn.setReadTimeout(300000);

        // 요청 본문 구성
        StringBuilder bodyBuilder = new StringBuilder();
        bodyBuilder.append("{\"data\":[], \"execution_type\":\"").append(executionType).append("\"");
        if (rfcParam != null && !rfcParam.trim().isEmpty()) {
            String trimmed = rfcParam.trim();
            if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
                bodyBuilder.append(", \"rfc_param\":").append(trimmed);
            } else {
                bodyBuilder.append(", \"rfc_param\":\"").append(trimmed).append("\"");
            }
        }
        bodyBuilder.append("}");
        String requestBody = bodyBuilder.toString();
        log.info("[IF-EXEC-RFC] 요청 본문: {}", requestBody);
        try (OutputStream os = conn.getOutputStream()) {
            os.write(requestBody.getBytes(StandardCharsets.UTF_8));
            os.flush();
        }

        int responseCode = conn.getResponseCode();
        StringBuilder responseBody = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        responseCode >= 200 && responseCode < 300
                                ? conn.getInputStream()
                                : conn.getErrorStream(),
                        StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                responseBody.append(line).append("\n");
            }
        }
        conn.disconnect();

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        if (responseCode >= 200 && responseCode < 300) {
            String statusPrefix = "RETRY".equals(executionType) ? "RETRY_" : "";
            history.setStatus(statusPrefix + "SUCCESS");
            history.setProcessedCount(1);
            history.setErrorCount(0);
            log.info("[IF-EXEC-RFC] HTTP 성공: {} (HTTP {}, {}ms)",
                    history.getInterfaceId(), responseCode, durationMs);
        } else {
            String statusPrefix = "RETRY".equals(executionType) ? "RETRY_" : "";
            history.setStatus(statusPrefix + "ERROR");
            history.setProcessedCount(0);
            history.setErrorCount(1);
            String errMsg = "HTTP " + responseCode + "\n" + responseBody;
            if (errMsg.length() > 1500) errMsg = errMsg.substring(0, 1500) + "...";
            history.setErrorMessage(errMsg);
            log.error("[IF-EXEC-RFC] HTTP 실패: {} (HTTP {})",
                    history.getInterfaceId(), responseCode);
        }

        history.setEndTime(endTime);
        history.setDurationMs(durationMs);
    }

    /**
     * 인터페이스 실행 (쉘 명령어 - 스케줄/수동/재수행 공통)
     */
    public InterfaceHistory executeInterface(String interfaceId, String interfaceName,
                                              String execCommand, String executionType, Long retryOfId) {
        LocalDateTime startTime = LocalDateTime.now();
        InterfaceHistory history = InterfaceHistory.builder()
                .interfaceId(interfaceId)
                .interfaceName(interfaceName)
                .executionType(executionType)
                .startTime(startTime)
                .status("RUNNING")
                .execCommand(execCommand)
                .retryOfId(retryOfId)
                .build();
        history = historyRepo.save(history);

        try {
            log.info("[IF-EXEC] 실행: {} - 명령어: {}", interfaceId, execCommand);

            // 명령어 실행
            ProcessBuilder pb = new ProcessBuilder("bash", "-c", execCommand);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            boolean finished = process.waitFor(300, TimeUnit.SECONDS);
            int exitCode = finished ? process.exitValue() : -1;

            LocalDateTime endTime = LocalDateTime.now();
            long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

            if (exitCode == 0) {
                String statusPrefix = "RETRY".equals(executionType) ? "RETRY_" : "";
                history.setStatus(statusPrefix + "SUCCESS");
                history.setProcessedCount(1);
                history.setErrorCount(0);
                log.info("[IF-EXEC] 성공: {} ({}ms)", interfaceId, durationMs);
            } else {
                String statusPrefix = "RETRY".equals(executionType) ? "RETRY_" : "";
                history.setStatus(statusPrefix + "ERROR");
                history.setProcessedCount(0);
                history.setErrorCount(1);
                String errMsg = output.length() > 1500 ? output.substring(0, 1500) + "..." : output.toString();
                history.setErrorMessage("Exit code: " + exitCode + "\n" + errMsg);
                log.error("[IF-EXEC] 실패: {} (exit={})", interfaceId, exitCode);
            }

            history.setEndTime(endTime);
            history.setDurationMs(durationMs);

        } catch (Exception e) {
            LocalDateTime endTime = LocalDateTime.now();
            long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

            String statusPrefix = "RETRY".equals(executionType) ? "RETRY_" : "";
            history.setStatus(statusPrefix + "ERROR");
            history.setEndTime(endTime);
            history.setDurationMs(durationMs);
            history.setProcessedCount(0);
            history.setErrorCount(1);
            history.setErrorMessage(e.getMessage());
            log.error("[IF-EXEC] 예외 발생: {} - {}", interfaceId, e.getMessage(), e);
        }

        return historyRepo.save(history);
    }

    /**
     * 다음 수행 예정일시 재계산
     */
    private void updateNextExecution(InterfaceExecution exec) {
        LocalDateTime now = LocalDateTime.now();
        String type = exec.getScheduleType();
        if (type == null) return;

        switch (type.toUpperCase()) {
            case "DAILY":
                if (exec.getExecutionTime() != null && !exec.getExecutionTime().isEmpty()) {
                    LocalTime time = LocalTime.parse(exec.getExecutionTime());
                    LocalDateTime next = now.toLocalDate().atTime(time);
                    if (!next.isAfter(now)) {
                        next = next.plusDays(1);
                    }
                    exec.setNextExecutionAt(next);
                }
                break;
            case "HOURLY":
            case "MINUTE":
                int minutes = exec.getIntervalMinutes() != null ? exec.getIntervalMinutes() : 60;
                exec.setNextExecutionAt(now.plusMinutes(minutes));
                break;
            case "CRON":
                exec.setNextExecutionAt(now.plusHours(1));
                break;
            default:
                exec.setNextExecutionAt(now.plusHours(1));
        }
        executionRepo.save(exec);
    }
}
