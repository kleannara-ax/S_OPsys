package com.company.module.sales.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Properties;

/**
 * SAP JCo Destination 설정.
 * sap-connection.yml의 값을 기반으로 JCo destination 파일을 생성합니다.
 *
 * <p>SAP JCo는 {@code <destination_name>.jcoDestination} 파일을 읽어
 * 연결 정보를 구성합니다. 이 클래스는 애플리케이션 시작 시
 * SapProperties 값으로 해당 파일을 자동 생성합니다.</p>
 *
 * <h3>네이티브 라이브러리 (libsapjco3.so) 자동 로드</h3>
 * <p>아래 경로를 순서대로 탐색하여 libsapjco3.so를 java.library.path에 추가합니다:</p>
 * <ol>
 *   <li>{@code ./libs/} — 개발 환경 (bootRun) 또는 운영 환경 (JAR 옆 libs 폴더)</li>
 *   <li>{@code ./module-sales/libs/} — 프로젝트 루트에서 실행 시</li>
 *   <li>classpath {@code native/libsapjco3.so} — fat JAR 안에 포함된 경우</li>
 * </ol>
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class SapJCoConfig {

    /** JCo Destination 이름 — RFC 호출 시 이 이름으로 참조 */
    public static final String DESTINATION_NAME = "SAP_SNOP";

    private final SapProperties sapProperties;

    /**
     * 앱 시작 시 네이티브 라이브러리 경로 설정 + JCo Destination 파일 생성.
     */
    @PostConstruct
    public void init() {
        setupNativeLibraryPath();
        createDestinationFile();
    }

    /**
     * libsapjco3.so가 있는 디렉토리를 java.library.path에 동적 추가합니다.
     * <p>JVM이 이미 시작된 후에는 {@code System.setProperty}만으로는 부족하므로,
     * Reflection으로 {@code ClassLoader.usr_paths}를 초기화하여 재탐색을 강제합니다.</p>
     */
    private void setupNativeLibraryPath() {
        // 1) 파일 시스템에서 libsapjco3.so 탐색
        //    - 상대 경로: 현재 작업 디렉토리(WorkingDirectory) 기준
        //    - 절대 경로: JAR 파일 위치 기준, 운영 서버 배포 경로
        String[] candidateDirs = {
                "libs",                    // WorkingDirectory 기준 ./libs/
                "module-sales/libs",       // 프로젝트 루트에서 실행 시
                "../libs",                 // 하위 디렉토리에서 실행 시
        };

        File nativeLib = null;

        // 1-a) JAR 파일 위치 기준으로 libs/ 탐색 (systemctl 실행 시 핵심)
        //      예: /data/snop/app/snop.jar → /data/snop/app/libs/libsapjco3.so
        try {
            String jarPath = getClass().getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
            File jarFile = new File(jarPath);
            // JAR 파일이면 부모 디렉토리에서 libs/ 탐색
            // 클래스 디렉토리(개발 모드)면 상위로 올라가서 탐색
            File baseDir = jarFile.isFile() ? jarFile.getParentFile() : jarFile;
            File jarLibs = new File(baseDir, "libs/libsapjco3.so");
            if (jarLibs.exists()) {
                nativeLib = jarLibs;
                log.info("[SAP-NATIVE] JAR 위치 기준 발견: {}", jarLibs.getAbsolutePath());
            }
            // JAR과 같은 디렉토리에 직접 있는 경우도 체크
            if (nativeLib == null) {
                File sameDir = new File(baseDir, "libsapjco3.so");
                if (sameDir.exists()) {
                    nativeLib = sameDir;
                    log.info("[SAP-NATIVE] JAR 동일 디렉토리 발견: {}", sameDir.getAbsolutePath());
                }
            }
        } catch (Exception e) {
            log.debug("[SAP-NATIVE] JAR 위치 기반 탐색 실패: {}", e.getMessage());
        }

        // 1-b) 상대 경로 기반 탐색 (WorkingDirectory 기준)
        if (nativeLib == null) {
            for (String dir : candidateDirs) {
                File candidate = new File(dir, "libsapjco3.so");
                if (candidate.exists()) {
                    nativeLib = candidate;
                    break;
                }
            }
        }

        // 2) 파일 시스템에 없으면 classpath에서 추출 (fat JAR 내부)
        if (nativeLib == null) {
            nativeLib = extractNativeLibFromClasspath();
        }

        if (nativeLib == null) {
            log.warn("[SAP-NATIVE] libsapjco3.so를 찾을 수 없습니다. "
                    + "libs/ 폴더에 libsapjco3.so 파일을 넣어주세요.");
            return;
        }

        String libDir = nativeLib.getParentFile().getAbsolutePath();
        log.info("[SAP-NATIVE] libsapjco3.so 발견: {}", nativeLib.getAbsolutePath());

        // 3) java.library.path에 추가
        String currentPath = System.getProperty("java.library.path", "");
        if (!currentPath.contains(libDir)) {
            String newPath = libDir + File.pathSeparator + currentPath;
            System.setProperty("java.library.path", newPath);

            // ClassLoader의 usr_paths 캐시를 초기화하여 새 경로를 인식하도록 강제
            try {
                Field usrPathsField = ClassLoader.class.getDeclaredField("usr_paths");
                usrPathsField.setAccessible(true);
                usrPathsField.set(null, null);
                log.info("[SAP-NATIVE] java.library.path에 추가 완료: {}", libDir);
            } catch (Exception e) {
                log.warn("[SAP-NATIVE] java.library.path 동적 추가 실패 (JVM 보안 제한): {}. "
                        + "서버 시작 시 -Djava.library.path={} 옵션을 추가해주세요.",
                        e.getMessage(), libDir);
            }
        } else {
            log.info("[SAP-NATIVE] java.library.path에 이미 포함됨: {}", libDir);
        }
    }

    /**
     * classpath(JAR 내부)에서 libsapjco3.so를 임시 디렉토리로 추출합니다.
     */
    private File extractNativeLibFromClasspath() {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("native/libsapjco3.so")) {
            if (is == null) return null;

            Path tempDir = Files.createTempDirectory("sapjco-native");
            File tempFile = new File(tempDir.toFile(), "libsapjco3.so");
            Files.copy(is, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            tempFile.setExecutable(true);
            tempFile.deleteOnExit();
            tempDir.toFile().deleteOnExit();

            log.info("[SAP-NATIVE] classpath에서 libsapjco3.so 추출: {}", tempFile.getAbsolutePath());
            return tempFile;
        } catch (IOException e) {
            log.debug("[SAP-NATIVE] classpath에서 libsapjco3.so 추출 실패: {}", e.getMessage());
            return null;
        }
    }

    /**
     * JCo Destination 프로퍼티 파일을 생성합니다.
     * 파일 위치: 현재 작업 디렉토리 / SAP_SNOP.jcoDestination
     */
    private void createDestinationFile() {
        if (isBlank(sapProperties.getHost())) {
            log.warn("SAP Host가 설정되지 않았습니다. JCo Destination 파일을 생성하지 않습니다.");
            return;
        }

        Properties props = new Properties();
        props.setProperty("jco.client.ashost", sapProperties.getHost());
        props.setProperty("jco.client.sysnr", sapProperties.getSystemNumber());
        props.setProperty("jco.client.client", sapProperties.getClient());
        props.setProperty("jco.client.user", sapProperties.getUser());
        props.setProperty("jco.client.lang", sapProperties.getLanguage());

        // 비밀번호는 설정된 경우에만 포함
        if (!isBlank(sapProperties.getPassword())) {
            props.setProperty("jco.client.passwd", sapProperties.getPassword());
        }

        // 연결 풀 설정
        props.setProperty("jco.destination.pool_capacity",
                String.valueOf(sapProperties.getPoolCapacity()));
        props.setProperty("jco.destination.peak_limit",
                String.valueOf(sapProperties.getPeakLimit()));

        File destFile = new File(DESTINATION_NAME + ".jcoDestination");
        try (FileOutputStream fos = new FileOutputStream(destFile)) {
            props.store(fos, "SAP JCo Destination — auto-generated by SapJCoConfig");
            log.info("SAP JCo Destination 파일 생성 완료: {} (host={}, user={})",
                    destFile.getAbsolutePath(), sapProperties.getHost(), sapProperties.getUser());
        } catch (IOException e) {
            log.error("SAP JCo Destination 파일 생성 실패: {}", e.getMessage(), e);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
