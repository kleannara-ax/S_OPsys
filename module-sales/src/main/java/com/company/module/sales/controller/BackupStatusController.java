package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 백업 상태 모니터링 및 수동 백업 실행 API.
 */
@RestController
@RequestMapping("/sales-api/backup")
@RequiredArgsConstructor
public class BackupStatusController {

    private static final String AIDRIVE_BACKUP_DIR = "/mnt/aidrive/S_OPsys_backups";
    private static final String BACKUP_SCRIPT = "/home/user/webapp/scripts/backup_to_aidrive.sh";

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBackupStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("backup_location", AIDRIVE_BACKUP_DIR);
        status.put("server_time", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        try {
            File backupDir = new File(AIDRIVE_BACKUP_DIR);
            if (backupDir.exists() && backupDir.isDirectory()) {
                File[] backups = backupDir.listFiles((dir, name) ->
                        name.startsWith("S_OPsys_backup_") && name.endsWith(".tar.gz"));
                if (backups != null) {
                    List<Map<String, String>> backupList = Arrays.stream(backups)
                        .sorted((a, b) -> Long.compare(b.lastModified(), a.lastModified()))
                        .map(f -> {
                            Map<String, String> info = new LinkedHashMap<>();
                            info.put("file_name", f.getName());
                            info.put("size", formatFileSize(f.length()));
                            info.put("date", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                                .format(new java.util.Date(f.lastModified())));
                            return info;
                        }).collect(Collectors.toList());
                    status.put("backup_count", backupList.size());
                    status.put("backups", backupList);
                }
            } else {
                status.put("backup_count", 0);
                status.put("backups", Collections.emptyList());
            }
        } catch (Exception e) {
            status.put("backup_error", e.getMessage());
        }

        try {
            File pidFile = new File("/tmp/s_opsys_auto_backup.pid");
            if (pidFile.exists()) {
                String pid = new String(Files.readAllBytes(pidFile.toPath())).trim();
                ProcessBuilder check = new ProcessBuilder("kill", "-0", pid);
                boolean running = check.start().waitFor() == 0;
                status.put("daemon_running", running);
                status.put("daemon_pid", running ? pid : null);
            } else {
                status.put("daemon_running", false);
                status.put("daemon_pid", null);
            }
        } catch (Exception e) {
            status.put("daemon_running", false);
        }

        return ResponseEntity.ok(ApiResponse.ok(status));
    }

    @PostMapping("/trigger")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> triggerBackup() {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            ProcessBuilder pb = new ProcessBuilder("/bin/bash", BACKUP_SCRIPT);
            pb.redirectErrorStream(true);
            pb.directory(new File("/home/user/webapp"));
            Process process = pb.start();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            result.put("exit_code", exitCode);
            result.put("output", output.toString());
            result.put("time", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

            if (exitCode == 0) {
                return ResponseEntity.ok(ApiResponse.ok(result, "백업이 성공적으로 완료되었습니다."));
            } else {
                return ResponseEntity.ok(ApiResponse.error("BACKUP_FAILED", "백업 실패"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("BACKUP_ERROR", "백업 실행 오류: " + e.getMessage()));
        }
    }

    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
    }
}
