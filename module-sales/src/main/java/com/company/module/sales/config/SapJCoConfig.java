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
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Properties;

/**
 * SAP JCo Destination 설정.
 * sap-connection.yml의 값을 기반으로 JCo Destination을 프로그래밍 방식으로 등록합니다.
 *
 * <h3>Destination 등록 방식 (2단계 fallback)</h3>
 * <ol>
 *   <li><b>프로그래밍 방식 (우선)</b>: {@code DestinationDataProvider}를 JCo Environment에
 *       직접 등록하여 파일 없이 연결 정보를 제공합니다. — 파일 경로 문제가 원천 차단됩니다.</li>
 *   <li><b>파일 방식 (fallback)</b>: 프로그래밍 등록 실패 시 {@code .jcoDestination} 파일을
 *       user.dir + JAR 위치에 모두 생성합니다.</li>
 * </ol>
 *
 * <h3>네이티브 라이브러리 (libsapjco3.so) 자동 로드</h3>
 * <p>아래 경로를 순서대로 탐색하여 libsapjco3.so를 java.library.path에 추가합니다:</p>
 * <ol>
 *   <li>JAR 파일 위치 기준 {@code libs/} — systemctl 배포 환경 핵심</li>
 *   <li>{@code ./libs/} — 개발 환경 (bootRun)</li>
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
     * 앱 시작 시 네이티브 라이브러리 경로 설정 + JCo Destination 등록.
     */
    @PostConstruct
    public void init() {
        log.info("[SAP-CONFIG] SapJCoConfig 초기화 시작...");
        setupNativeLibraryPath();
        registerDestination();
        log.info("[SAP-CONFIG] SapJCoConfig 초기화 완료");
    }

    // ────────────────────────────────────────────────────────────────
    //  Destination 등록 — 프로그래밍 방식 우선, 파일 방식 fallback
    // ────────────────────────────────────────────────────────────────

    /**
     * JCo DestinationDataProvider를 프로그래밍 방식으로 등록합니다.
     * 실패 시 파일 방식으로 fallback합니다.
     */
    private void registerDestination() {
        if (isBlank(sapProperties.getHost())) {
            log.warn("[SAP-DEST] SAP Host가 설정되지 않았습니다. Destination을 등록하지 않습니다.");
            return;
        }

        Properties props = buildDestinationProperties();

        // 1차 시도: 프로그래밍 방식 등록 (파일 불필요)
        if (registerDestinationProvider(props)) {
            log.info("[SAP-DEST] DestinationDataProvider 프로그래밍 등록 성공 (host={}, user={})",
                    sapProperties.getHost(), sapProperties.getUser());
            return;
        }

        // 2차 시도: 파일 방식 fallback
        log.info("[SAP-DEST] 프로그래밍 등록 실패 → 파일 방식으로 fallback");
        createDestinationFiles(props);
    }

    /**
     * JCo Destination 프로퍼티를 구성합니다.
     */
    private Properties buildDestinationProperties() {
        Properties props = new Properties();
        props.setProperty("jco.client.ashost", sapProperties.getHost());
        props.setProperty("jco.client.sysnr", sapProperties.getSystemNumber());
        props.setProperty("jco.client.client", sapProperties.getClient());
        props.setProperty("jco.client.user", sapProperties.getUser());
        props.setProperty("jco.client.lang", sapProperties.getLanguage());

        if (!isBlank(sapProperties.getPassword())) {
            props.setProperty("jco.client.passwd", sapProperties.getPassword());
        }

        props.setProperty("jco.destination.pool_capacity",
                String.valueOf(sapProperties.getPoolCapacity()));
        props.setProperty("jco.destination.peak_limit",
                String.valueOf(sapProperties.getPeakLimit()));

        return props;
    }

    /**
     * Reflection으로 JCo DestinationDataProvider를 Environment에 등록합니다.
     * <p>JCo 라이브러리가 없으면 false를 반환합니다.</p>
     *
     * <pre>
     * // 이 코드와 동일한 동작:
     * JCoDestinationManager.getEnvironment()
     *     .registerDestinationDataProvider(customProvider);
     * </pre>
     */
    private boolean registerDestinationProvider(Properties props) {
        try {
            // com.sap.conn.jco.ext.DestinationDataProvider 인터페이스 로드
            Class<?> ddpInterface = Class.forName("com.sap.conn.jco.ext.DestinationDataProvider");
            // com.sap.conn.jco.ext.Environment 클래스 로드
            Class<?> envClass = Class.forName("com.sap.conn.jco.ext.Environment");

            // DestinationDataProvider 구현체를 동적 프록시로 생성
            Object provider = java.lang.reflect.Proxy.newProxyInstance(
                    ddpInterface.getClassLoader(),
                    new Class<?>[]{ ddpInterface },
                    (proxy, method, args) -> {
                        String methodName = method.getName();
                        switch (methodName) {
                            case "getDestinationProperties":
                                // args[0] = destinationName (String)
                                String destName = (String) args[0];
                                if (DESTINATION_NAME.equals(destName)) {
                                    return props;
                                }
                                return null;
                            case "supportsEvents":
                                return false;
                            case "setDestinationDataEventListener":
                                return null; // void
                            case "toString":
                                return "SapJCoConfig.DestinationDataProvider[" + DESTINATION_NAME + "]";
                            case "hashCode":
                                return System.identityHashCode(proxy);
                            case "equals":
                                return proxy == args[0];
                            default:
                                return null;
                        }
                    }
            );

            // Environment.registerDestinationDataProvider(provider) 호출
            Method registerMethod = envClass.getMethod("registerDestinationDataProvider", ddpInterface);
            registerMethod.invoke(null, provider);

            return true;

        } catch (ClassNotFoundException e) {
            log.warn("[SAP-DEST] JCo 라이브러리 미설치 — 프로그래밍 등록 건너뜀: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            // 이미 등록된 경우 등의 예외 처리
            String msg = extractRootMessage(e);
            if (msg != null && msg.contains("already registered")) {
                log.info("[SAP-DEST] DestinationDataProvider 이미 등록됨");
                return true;
            }
            log.warn("[SAP-DEST] 프로그래밍 등록 실패: {}", msg);
            return false;
        }
    }

    /**
     * .jcoDestination 파일을 user.dir + JAR 위치에 생성합니다. (fallback)
     */
    private void createDestinationFiles(Properties props) {
        String destFileName = DESTINATION_NAME + ".jcoDestination";

        // 1) 현재 작업 디렉토리(user.dir)에 생성
        writeDestFile(new File(destFileName), props);

        // 2) JAR 파일 위치에도 생성
        try {
            String jarPath = getClass().getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
            File jarFile = new File(jarPath);
            File jarDir = jarFile.isFile() ? jarFile.getParentFile() : jarFile;
            File jarDestFile = new File(jarDir, destFileName);

            if (!jarDestFile.getAbsolutePath().equals(new File(destFileName).getAbsolutePath())) {
                writeDestFile(jarDestFile, props);
            }
        } catch (Exception e) {
            log.debug("[SAP-DEST] JAR 위치 기반 파일 생성 건너뜀: {}", e.getMessage());
        }
    }

    /**
     * JCo Destination 프로퍼티 파일을 지정 경로에 기록합니다.
     */
    private void writeDestFile(File destFile, Properties props) {
        try (FileOutputStream fos = new FileOutputStream(destFile)) {
            props.store(fos, "SAP JCo Destination — auto-generated by SapJCoConfig");
            log.info("[SAP-DEST] Destination 파일 생성: {} (host={}, user={})",
                    destFile.getAbsolutePath(), sapProperties.getHost(), sapProperties.getUser());
        } catch (IOException e) {
            log.error("[SAP-DEST] Destination 파일 생성 실패: {} — {}", destFile.getAbsolutePath(), e.getMessage());
        }
    }

    // ────────────────────────────────────────────────────────────────
    //  네이티브 라이브러리 경로 설정
    // ────────────────────────────────────────────────────────────────

    /**
     * libsapjco3.so가 있는 디렉토리를 java.library.path에 동적 추가합니다.
     */
    private void setupNativeLibraryPath() {
        String[] candidateDirs = {
                "libs",
                "module-sales/libs",
                "../libs",
        };

        File nativeLib = null;

        // 1-a) JAR 파일 위치 기준으로 libs/ 탐색
        try {
            String jarPath = getClass().getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
            File jarFile = new File(jarPath);
            File baseDir = jarFile.isFile() ? jarFile.getParentFile() : jarFile;
            File jarLibs = new File(baseDir, "libs/libsapjco3.so");
            if (jarLibs.exists()) {
                nativeLib = jarLibs;
                log.info("[SAP-NATIVE] JAR 위치 기준 발견: {}", jarLibs.getAbsolutePath());
            }
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

        // 1-b) 상대 경로 기반 탐색
        if (nativeLib == null) {
            for (String dir : candidateDirs) {
                File candidate = new File(dir, "libsapjco3.so");
                if (candidate.exists()) {
                    nativeLib = candidate;
                    break;
                }
            }
        }

        // 2) classpath에서 추출
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

        String currentPath = System.getProperty("java.library.path", "");
        if (!currentPath.contains(libDir)) {
            String newPath = libDir + File.pathSeparator + currentPath;
            System.setProperty("java.library.path", newPath);

            try {
                Field usrPathsField = ClassLoader.class.getDeclaredField("usr_paths");
                usrPathsField.setAccessible(true);
                usrPathsField.set(null, null);
                log.info("[SAP-NATIVE] java.library.path에 추가 완료: {}", libDir);
            } catch (Exception e) {
                log.warn("[SAP-NATIVE] java.library.path 동적 추가 실패: {}. "
                        + "서버 시작 시 -Djava.library.path={} 옵션을 추가해주세요.",
                        e.getMessage(), libDir);
            }
        } else {
            log.info("[SAP-NATIVE] java.library.path에 이미 포함됨: {}", libDir);
        }
    }

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

    // ────────────────────────────────────────────────────────────────
    //  유틸리티
    // ────────────────────────────────────────────────────────────────

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String extractRootMessage(Exception e) {
        Throwable cause = e;
        while (cause.getCause() != null) {
            cause = cause.getCause();
        }
        return cause.getMessage() != null ? cause.getMessage() : cause.getClass().getSimpleName();
    }
}
