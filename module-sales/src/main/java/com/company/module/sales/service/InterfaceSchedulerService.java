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
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * 인터페이스 스케줄러 서비스
 * - 매 30초마다 수행 예정 시간이 도래한 인터페이스를 실행
 * - exec_command(실행명령어) 우선 실행: 인터페이스 마스터에 등록된 명령어로 전체 로직 수행
 * - exec_command가 없고 rfcUrl만 있으면 HTTP POST로 호출 (SAP 직접 연동)
 * - rfcUrl은 SAP에서 직접 데이터를 보낼 때 사용하는 수신 엔드포인트
 * - 인터페이스 이력을 기록
 */
@Service
@Slf4j
public class InterfaceSchedulerService {

    private final InterfaceExecutionRepository executionRepo;
    private final InterfaceHistoryRepository historyRepo;
    private final InterfaceMasterRepository masterRepo;

    @Value("${server.port:8080}")
    private int serverPort;

    public InterfaceSchedulerService(InterfaceExecutionRepository executionRepo,
                                      InterfaceHistoryRepository historyRepo,
                                      InterfaceMasterRepository masterRepo) {
        this.executionRepo = executionRepo;
        this.historyRepo = historyRepo;
        this.masterRepo = masterRepo;
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
     * RFC URL을 통한 인터페이스 실행 (HTTP POST 호출)
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
            // RFC URL이 상대경로인 경우 localhost + 현재 서버 포트로 변환
            String fullUrl = rfcUrl.trim();
            if (fullUrl.startsWith("/")) {
                fullUrl = "http://localhost:" + serverPort + fullUrl;
            }

            log.info("[IF-EXEC-RFC] 실행: {} - URL: {}", interfaceId, fullUrl);

            // HTTP POST 호출
            URL url = new URL(fullUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(300000);

            // 요청 본문 구성: 인터페이스 마스터의 rfc_param 값을 포함
            // RFC param 값은 인터페이스 마스터관리에서 읽어서 전달
            StringBuilder bodyBuilder = new StringBuilder();
            bodyBuilder.append("{\"data\":[], \"execution_type\":\"").append(executionType).append("\"");
            if (rfcParam != null && !rfcParam.trim().isEmpty()) {
                // rfc_param 값을 JSON 문자열로 안전하게 감싸기
                // 이미 따옴표로 감싸져 있으면 그대로, 아니면 감싸기
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
                log.info("[IF-EXEC-RFC] 성공: {} (HTTP {}, {}ms)", interfaceId, responseCode, durationMs);
            } else {
                String statusPrefix = "RETRY".equals(executionType) ? "RETRY_" : "";
                history.setStatus(statusPrefix + "ERROR");
                history.setProcessedCount(0);
                history.setErrorCount(1);
                String errMsg = "HTTP " + responseCode + "\n" + responseBody;
                if (errMsg.length() > 1500) errMsg = errMsg.substring(0, 1500) + "...";
                history.setErrorMessage(errMsg);
                log.error("[IF-EXEC-RFC] 실패: {} (HTTP {})", interfaceId, responseCode);
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
            log.error("[IF-EXEC-RFC] 예외 발생: {} - {}", interfaceId, e.getMessage(), e);
        }

        return historyRepo.save(history);
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
