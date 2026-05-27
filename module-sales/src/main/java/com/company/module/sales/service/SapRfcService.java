package com.company.module.sales.service;

import com.company.module.sales.config.SapJCoConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.*;

/**
 * SAP RFC 호출 공통 서비스.
 * JCo 라이브러리를 통해 SAP Function Module을 호출하고 결과를 반환합니다.
 *
 * <p>JCo 라이브러리 미설치 시에는 호출이 차단되며 안내 메시지를 반환합니다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>{@code
 * // 단순 조회 (입력 파라미터 없음)
 * List<Map<String, Object>> result = sapRfcService.callRfc("Z_MM_SNOP_RFC_001", "ET_BOM_DATA");
 *
 * // 입력 파라미터 있는 호출
 * Map<String, Object> params = new HashMap<>();
 * params.put("I_WERKS", "1000");
 * params.put("I_MONTH", "202605");
 * List<Map<String, Object>> result = sapRfcService.callRfc("Z_SD_SNOP_RFC_002", params, "ET_SALES_DATA");
 * }</pre>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SapRfcService {

    private final SapConnectionService sapConnectionService;

    /**
     * SAP RFC를 호출하고 테이블 파라미터 결과를 반환합니다.
     *
     * @param functionName   SAP Function Module 이름 (예: Z_MM_SNOP_RFC_001)
     * @param tableParamName 결과 테이블 파라미터 이름 (예: ET_BOM_DATA)
     * @return 테이블 행 목록 (각 행은 Map)
     */
    public List<Map<String, Object>> callRfc(String functionName, String tableParamName) {
        return callRfc(functionName, Collections.emptyMap(), tableParamName);
    }

    /**
     * SAP RFC를 호출하고 테이블 파라미터 결과를 반환합니다.
     *
     * @param functionName   SAP Function Module 이름
     * @param importParams   입력(IMPORT) 파라미터 맵
     * @param tableParamName 결과 테이블 파라미터 이름
     * @return 테이블 행 목록 (각 행은 Map)
     */
    public List<Map<String, Object>> callRfc(String functionName,
                                              Map<String, Object> importParams,
                                              String tableParamName) {
        if (!sapConnectionService.isJCoAvailable()) {
            log.warn("SAP JCo 라이브러리 미설치 — RFC 호출 불가: {}", functionName);
            throw new IllegalStateException(
                    "SAP JCo 라이브러리가 설치되지 않았습니다. "
                    + "libs/ 폴더에 sapjco3.jar, libsapjco3.so를 넣어주세요.");
        }

        log.info("SAP RFC 호출 시작 — function={}, params={}", functionName, importParams.keySet());
        long startTime = System.currentTimeMillis();

        try {
            // JCoDestination 획득
            Object destination = Class.forName("com.sap.conn.jco.JCoDestinationManager")
                    .getMethod("getDestination", String.class)
                    .invoke(null, SapJCoConfig.DESTINATION_NAME);

            // JCoRepository → JCoFunction 획득
            Object repository = destination.getClass()
                    .getMethod("getRepository").invoke(destination);
            Object function = repository.getClass()
                    .getMethod("getFunction", String.class).invoke(repository, functionName);

            if (function == null) {
                throw new RuntimeException("SAP Function Module을 찾을 수 없습니다: " + functionName);
            }

            // IMPORT 파라미터 설정
            if (!importParams.isEmpty()) {
                Object importParameterList = function.getClass()
                        .getMethod("getImportParameterList").invoke(function);
                Method setValue = importParameterList.getClass()
                        .getMethod("setValue", String.class, Object.class);
                for (Map.Entry<String, Object> entry : importParams.entrySet()) {
                    setValue.invoke(importParameterList, entry.getKey(), entry.getValue());
                }
            }

            // RFC 실행
            function.getClass()
                    .getMethod("execute", destination.getClass().getInterfaces()[0])
                    .invoke(function, destination);

            // 결과 테이블 파라미터 읽기
            Object tableParameterList = function.getClass()
                    .getMethod("getTableParameterList").invoke(function);
            Object table = tableParameterList.getClass()
                    .getMethod("getTable", String.class).invoke(tableParameterList, tableParamName);

            List<Map<String, Object>> resultList = convertJCoTableToList(table);

            long elapsed = System.currentTimeMillis() - startTime;
            log.info("SAP RFC 호출 완료 — function={}, rows={}, elapsed={}ms",
                    functionName, resultList.size(), elapsed);

            return resultList;

        } catch (Exception e) {
            long elapsed = System.currentTimeMillis() - startTime;
            String errorMsg = extractRootCause(e);
            log.error("SAP RFC 호출 실패 — function={}, elapsed={}ms, error={}",
                    functionName, elapsed, errorMsg);
            throw new RuntimeException("SAP RFC 호출 실패 [" + functionName + "]: " + errorMsg, e);
        }
    }

    /**
     * SAP RFC를 호출하고 EXPORT 파라미터를 포함한 전체 결과를 반환합니다.
     *
     * @param functionName    SAP Function Module 이름
     * @param importParams    입력 파라미터 맵
     * @param tableParamNames 결과 테이블 파라미터 이름 목록
     * @return export 값 + 테이블 데이터를 포함한 결과 맵
     */
    public Map<String, Object> callRfcFull(String functionName,
                                            Map<String, Object> importParams,
                                            List<String> tableParamNames) {
        if (!sapConnectionService.isJCoAvailable()) {
            throw new IllegalStateException("SAP JCo 라이브러리가 설치되지 않았습니다.");
        }

        log.info("SAP RFC(Full) 호출 시작 — function={}", functionName);
        long startTime = System.currentTimeMillis();

        try {
            Object destination = Class.forName("com.sap.conn.jco.JCoDestinationManager")
                    .getMethod("getDestination", String.class)
                    .invoke(null, SapJCoConfig.DESTINATION_NAME);

            Object repository = destination.getClass()
                    .getMethod("getRepository").invoke(destination);
            Object function = repository.getClass()
                    .getMethod("getFunction", String.class).invoke(repository, functionName);

            if (function == null) {
                throw new RuntimeException("SAP Function Module을 찾을 수 없습니다: " + functionName);
            }

            // IMPORT 파라미터 설정
            if (importParams != null && !importParams.isEmpty()) {
                Object importParameterList = function.getClass()
                        .getMethod("getImportParameterList").invoke(function);
                Method setValue = importParameterList.getClass()
                        .getMethod("setValue", String.class, Object.class);
                for (Map.Entry<String, Object> entry : importParams.entrySet()) {
                    setValue.invoke(importParameterList, entry.getKey(), entry.getValue());
                }
            }

            // RFC 실행
            function.getClass()
                    .getMethod("execute", destination.getClass().getInterfaces()[0])
                    .invoke(function, destination);

            Map<String, Object> result = new LinkedHashMap<>();

            // EXPORT 파라미터 읽기
            try {
                Object exportParameterList = function.getClass()
                        .getMethod("getExportParameterList").invoke(function);
                if (exportParameterList != null) {
                    // JCo 3.0.6: 필드명은 MetaData에서 읽어야 함
                    Object exportMeta = getTableMetaData(exportParameterList);
                    int fieldCount = (int) exportMeta.getClass()
                            .getMethod("getFieldCount").invoke(exportMeta);
                    Method getExportName = exportMeta.getClass().getMethod("getName", int.class);
                    Method getExportValue = exportParameterList.getClass()
                            .getMethod("getString", String.class);
                    Map<String, Object> exports = new LinkedHashMap<>();
                    for (int i = 0; i < fieldCount; i++) {
                        String name = (String) getExportName.invoke(exportMeta, i);
                        String value = (String) getExportValue.invoke(exportParameterList, name);
                        exports.put(name, value);
                    }
                    result.put("exports", exports);
                }
            } catch (Exception ex) {
                log.debug("EXPORT 파라미터 읽기 건너뜀: {}", ex.getMessage());
            }

            // TABLE 파라미터 읽기
            if (tableParamNames != null) {
                Object tableParameterList = function.getClass()
                        .getMethod("getTableParameterList").invoke(function);
                for (String tableName : tableParamNames) {
                    try {
                        Object table = tableParameterList.getClass()
                                .getMethod("getTable", String.class).invoke(tableParameterList, tableName);
                        result.put(tableName, convertJCoTableToList(table));
                    } catch (Exception ex) {
                        log.warn("테이블 파라미터 '{}' 읽기 실패: {}", tableName, ex.getMessage());
                        result.put(tableName, Collections.emptyList());
                    }
                }
            }

            long elapsed = System.currentTimeMillis() - startTime;
            log.info("SAP RFC(Full) 호출 완료 — function={}, elapsed={}ms", functionName, elapsed);

            return result;

        } catch (Exception e) {
            long elapsed = System.currentTimeMillis() - startTime;
            String errorMsg = extractRootCause(e);
            log.error("SAP RFC(Full) 호출 실패 — function={}, elapsed={}ms, error={}",
                    functionName, elapsed, errorMsg);
            throw new RuntimeException("SAP RFC 호출 실패 [" + functionName + "]: " + errorMsg, e);
        }
    }

    /**
     * JCoTable 객체를 List<Map> 형태로 변환합니다.
     * <p>JCo 버전별 API 차이를 Reflection으로 대응합니다:</p>
     * <ul>
     *   <li>JCo 3.1+: {@code table.getRecordMetaData().getName(int)}</li>
     *   <li>JCo 3.0.x: {@code table.getMetaData().getName(int)}</li>
     *   <li>Fallback: {@code getString(String)} 대신 인덱스 기반 읽기</li>
     * </ul>
     */
    private List<Map<String, Object>> convertJCoTableToList(Object table) throws Exception {
        List<Map<String, Object>> list = new ArrayList<>();

        int numRows = (int) table.getClass().getMethod("getNumRows").invoke(table);
        if (numRows == 0) return list;

        // 메타데이터 획득 — JCo 버전별 메서드명이 다름
        Object metaData = getTableMetaData(table);
        int fieldCount = (int) metaData.getClass().getMethod("getFieldCount").invoke(metaData);
        Method getMetaName = metaData.getClass().getMethod("getName", int.class);

        // 값 읽기 — getString(String columnName) 사용 (모든 JCo 버전 호환)
        Method getStringByName = table.getClass().getMethod("getString", String.class);
        Method nextRow = table.getClass().getMethod("nextRow");
        Method firstRow = table.getClass().getMethod("firstRow");

        // 필드명 목록 미리 추출
        String[] fieldNames = new String[fieldCount];
        for (int i = 0; i < fieldCount; i++) {
            fieldNames[i] = (String) getMetaName.invoke(metaData, i);
        }

        firstRow.invoke(table);

        for (int row = 0; row < numRows; row++) {
            Map<String, Object> rowMap = new LinkedHashMap<>();
            for (int col = 0; col < fieldCount; col++) {
                String colValue = (String) getStringByName.invoke(table, fieldNames[col]);
                rowMap.put(fieldNames[col], colValue);
            }
            list.add(rowMap);
            if (row < numRows - 1) {
                nextRow.invoke(table);
            }
        }
        return list;
    }

    /**
     * JCoTable에서 메타데이터 객체를 획득합니다.
     * JCo 3.1+는 getRecordMetaData(), JCo 3.0.x는 getMetaData()를 사용합니다.
     */
    private Object getTableMetaData(Object table) throws Exception {
        // 1차: getRecordMetaData() — JCo 3.1+
        try {
            return table.getClass().getMethod("getRecordMetaData").invoke(table);
        } catch (NoSuchMethodException ignored) {}

        // 2차: getMetaData() — JCo 3.0.x
        try {
            return table.getClass().getMethod("getMetaData").invoke(table);
        } catch (NoSuchMethodException ignored) {}

        // 3차: 인터페이스를 통해 탐색
        for (Class<?> iface : table.getClass().getInterfaces()) {
            try {
                Method m = iface.getMethod("getRecordMetaData");
                return m.invoke(table);
            } catch (NoSuchMethodException ignored) {}
            try {
                Method m = iface.getMethod("getMetaData");
                return m.invoke(table);
            } catch (NoSuchMethodException ignored) {}
        }

        throw new RuntimeException("JCoTable에서 메타데이터를 가져올 수 없습니다. "
                + "Table class: " + table.getClass().getName()
                + ", Methods: " + Arrays.toString(
                    Arrays.stream(table.getClass().getMethods())
                        .map(Method::getName)
                        .filter(n -> n.contains("eta") || n.contains("ield") || n.contains("ame"))
                        .toArray()));
    }

    private String extractRootCause(Exception e) {
        Throwable cause = e;
        while (cause.getCause() != null) {
            cause = cause.getCause();
        }
        return cause.getMessage() != null ? cause.getMessage() : cause.getClass().getSimpleName();
    }
}
