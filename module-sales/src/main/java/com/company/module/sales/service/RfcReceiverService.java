package com.company.module.sales.service;

import com.company.module.sales.entity.BaseMaterialMaster;
import com.company.module.sales.entity.InterfaceHistory;
import com.company.module.sales.entity.MonthlyClosing;
import com.company.module.sales.entity.PlantStorageLocation;
import com.company.module.sales.entity.RenewalMaterialLinkage;
import com.company.module.sales.entity.SnopRecord;
import com.company.module.sales.repository.BaseMaterialMasterRepository;
import com.company.module.sales.repository.InterfaceHistoryRepository;
import com.company.module.sales.repository.MonthlyClosingRepository;
import com.company.module.sales.repository.PlantStorageLocationRepository;
import com.company.module.sales.repository.RenewalMaterialLinkageRepository;
import com.company.module.sales.repository.SnopRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.module.sales.config.AuditUserContext;
import java.time.LocalDateTime;
import java.util.*;

/**
 * RFC 수신 서비스
 * SAP에서 전송하는 RFC 데이터를 수신하여 S&OP 테이블에 반영한다.
 *
 * SNOP_RFC_001: 자재마스터       → MOD_SALES_BASE_MATERIAL_MASTER
 * SNOP_RFC_002: 일자별재고       → MOD_PLANT_STORAGE_LOCATION
 * SNOP_RFC_003: 생산실적         → MOD_SALES_SNOP_RECORD (production_actual)
 * SNOP_RFC_004: 판매실적         → MOD_SALES_SNOP_RECORD (sales_actual)
 * SNOP_RFC_005: 월말마감실적     → MOD_SALES_MONTHLY_CLOSING (ending_inventory, production_actual, sales_actual)
 * SNOP_RFC_006: 리뉴얼자재연결  → MOD_SALES_RENEWAL_MATERIAL_LINKAGE
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RfcReceiverService {

    private final BaseMaterialMasterRepository baseMaterialMasterRepo;
    private final PlantStorageLocationRepository plantStorageLocationRepo;
    private final SnopRecordRepository snopRecordRepo;
    private final MonthlyClosingRepository monthlyClosingRepo;
    private final RenewalMaterialLinkageRepository renewalMaterialLinkageRepo;
    private final InterfaceHistoryRepository historyRepo;

    // ───────────────────────────────────────────────────────
    // SNOP_RFC_001: 자재마스터 동기화
    // RFC fields: scm_area, hierarchy_name, production_unit,
    //             item_code, item_name, conversion1~3, conversion5,
    //             vendor_name, new_update_type (1=Insert, 2=Update by item_code)
    // 메모: RFC param 개수는 하나고 A 또는 B 값이 들어감
    //       → 인터페이스 마스터관리의 RFC param 값을 읽어서 사용
    // ───────────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> processRfc001(List<Map<String, Object>> dataList, String executionType) {
        String rfcId = "SNOP_RFC_001";
        String rfcName = "자재마스터";
        LocalDateTime startTime = LocalDateTime.now();
        int processedCount = 0;
        int errorCount = 0;
        int insertCount = 0;
        int updateCount = 0;
        List<String> errors = new ArrayList<>();

        // RFC 실행시 등록자/수정자를 'IF'로 설정
        setAuditUser();

        log.info("[RFC-001] 자재마스터 수신 시작: {}건", dataList.size());

        for (int i = 0; i < dataList.size(); i++) {
            Map<String, Object> row = dataList.get(i);
            try {
                String itemCode = getStr(row, "item_code");
                String updateType = getStr(row, "new_update_type");
                if (updateType == null || updateType.isEmpty()) {
                    updateType = "1"; // 기본값: Insert
                }

                if (itemCode == null || itemCode.isEmpty()) {
                    errors.add("Row " + (i + 1) + ": item_code 누락");
                    errorCount++;
                    continue;
                }

                switch (updateType.trim()) {
                    case "1": // Insert (신규)
                        List<BaseMaterialMaster> existingForInsert = baseMaterialMasterRepo.findByItemCode(itemCode);
                        if (!existingForInsert.isEmpty()) {
                            // 이미 존재하면 update로 처리
                            BaseMaterialMaster master = existingForInsert.get(0);
                            mapRfc001Fields(master, row);
                            baseMaterialMasterRepo.save(master);
                            updateCount++;
                        } else {
                            BaseMaterialMaster master = new BaseMaterialMaster();
                            master.setItemCode(itemCode);
                            mapRfc001Fields(master, row);
                            baseMaterialMasterRepo.save(master);
                            insertCount++;
                        }
                        processedCount++;
                        break;

                    case "2": // Update (item_code 기준 수정)
                        List<BaseMaterialMaster> existingForUpdate = baseMaterialMasterRepo.findByItemCode(itemCode);
                        if (!existingForUpdate.isEmpty()) {
                            BaseMaterialMaster master = existingForUpdate.get(0);
                            mapRfc001Fields(master, row);
                            baseMaterialMasterRepo.save(master);
                            updateCount++;
                        } else {
                            // 수정 대상이 없으면 신규 생성
                            BaseMaterialMaster master = new BaseMaterialMaster();
                            master.setItemCode(itemCode);
                            mapRfc001Fields(master, row);
                            baseMaterialMasterRepo.save(master);
                            insertCount++;
                        }
                        processedCount++;
                        break;

                    default:
                        errors.add("Row " + (i + 1) + ": 잘못된 new_update_type: " + updateType + " (1=Insert, 2=Update)");
                        errorCount++;
                }
            } catch (Exception e) {
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
                errorCount++;
                log.error("[RFC-001] Row {} 처리 오류: {}", i + 1, e.getMessage());
            }
        }

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        // 이력 기록
        saveHistory(rfcId, rfcName, executionType, startTime, endTime, durationMs,
                processedCount, errorCount, errors);

        log.info("[RFC-001] 자재마스터 수신 완료: 처리={}, 신규={}, 수정={}, 에러={}",
                processedCount, insertCount, updateCount, errorCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rfc_id", rfcId);
        result.put("status", errorCount == 0 ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("processed_count", processedCount);
        result.put("insert_count", insertCount);
        result.put("update_count", updateCount);
        result.put("error_count", errorCount);
        result.put("errors", errors);
        result.put("duration_ms", durationMs);
        return result;
    }

    private void mapRfc001Fields(BaseMaterialMaster master, Map<String, Object> row) {
        if (row.containsKey("scm_area")) master.setScmArea(getStr(row, "scm_area"));
        if (row.containsKey("hierarchy_name")) master.setHierarchyName(getStr(row, "hierarchy_name"));
        if (row.containsKey("production_unit")) master.setProductionUnit(getStr(row, "production_unit"));
        if (row.containsKey("item_name")) master.setItemName(getStr(row, "item_name"));
        if (row.containsKey("conversion1")) master.setConversion1(getDouble(row, "conversion1"));
        if (row.containsKey("conversion2")) master.setConversion2(getDouble(row, "conversion2"));
        if (row.containsKey("conversion3")) master.setConversion3(getDouble(row, "conversion3"));
        if (row.containsKey("conversion5")) master.setConversion5(getDouble(row, "conversion5"));
        if (row.containsKey("vendor_name")) master.setVendorName(getStr(row, "vendor_name"));
    }

    // ───────────────────────────────────────────────────────
    // SNOP_RFC_002: 일자별재고 동기화
    // RFC fields: plan_month_day → plan_month, item_code,
    //             plant_code, storage_location, unit → stock_unit,
    //             beginning_inventory(총 가용재고), available_inventory(총재고)
    // 처리 방식:
    //   Step 1: plant_code + storage_location + plan_month 키로 upsert (is_selected 유지)
    //   Step 2: is_selected=true인 저장위치만 합산하여 SnopRecord에 반영
    // ───────────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> processRfc002(List<Map<String, Object>> dataList, String executionType) {
        String rfcId = "SNOP_RFC_002";
        String rfcName = "일자별재고";
        LocalDateTime startTime = LocalDateTime.now();
        int processedCount = 0;
        int errorCount = 0;
        int insertCount = 0;
        int updateCount = 0;
        List<String> errors = new ArrayList<>();

        // RFC 실행시 등록자/수정자를 'IF'로 설정
        setAuditUser();

        log.info("[RFC-002] 일자별재고 수신 시작: {}건", dataList.size());

        // 수신 데이터에 포함된 plan_month 목록 수집 (Step 2에서 사용)
        Set<String> affectedPlanMonths = new HashSet<>();

        // Step 1: Upsert — plant_code + storage_location + plan_month 키로 기존 레코드 업데이트 또는 신규 생성
        // ※ 기존 삭제+재삽입 방식에서 변경: is_selected 속성을 보존하기 위해 upsert 방식 사용
        for (int i = 0; i < dataList.size(); i++) {
            Map<String, Object> row = dataList.get(i);
            try {
                String planMonthDay = getStr(row, "plan_month_day");
                String itemCode = getStr(row, "item_code");
                String plantCode = getStr(row, "plant_code");
                String storageLocation = getStr(row, "storage_location");

                if (itemCode == null || itemCode.isEmpty()) {
                    errors.add("Row " + (i + 1) + ": item_code 누락");
                    errorCount++;
                    continue;
                }
                if (plantCode == null || plantCode.isEmpty()) {
                    errors.add("Row " + (i + 1) + ": plant_code 누락");
                    errorCount++;
                    continue;
                }

                // plan_month_day (YYYYMMDD) → plan_month (YYYY-MM)
                String planMonth = convertPlanMonthDay(planMonthDay);
                if (planMonth != null) {
                    affectedPlanMonths.add(planMonth);
                }

                // 기존 레코드 조회: plant_code + storage_location + plan_month
                Optional<PlantStorageLocation> optExisting =
                        plantStorageLocationRepo.findByPlantCodeAndStorageLocationAndPlanMonth(
                                plantCode, storageLocation != null ? storageLocation : "", planMonth);

                PlantStorageLocation psl;
                if (optExisting.isPresent()) {
                    psl = optExisting.get();
                    updateCount++;
                } else {
                    // 신규 생성 — seed 데이터(plan_month=null)의 is_selected를 상속
                    psl = new PlantStorageLocation();
                    psl.setPlantCode(plantCode);
                    psl.setStorageLocation(storageLocation);
                    psl.setPlanMonth(planMonth);

                    // seed 데이터(plan_month=null)에서 is_selected 상속
                    Optional<PlantStorageLocation> seedRecord =
                            plantStorageLocationRepo.findByPlantCodeAndStorageLocationAndPlanMonthIsNull(
                                    plantCode, storageLocation != null ? storageLocation : "");
                    if (seedRecord.isPresent()) {
                        psl.setIsSelected(seedRecord.get().getIsSelected());
                    }

                    insertCount++;
                }

                // 공통 필드 업데이트
                psl.setItemCode(itemCode);
                if (row.containsKey("unit")) psl.setStockUnit(getStr(row, "unit"));
                if (row.containsKey("beginning_inventory")) psl.setBeginningInventory(getLong(row, "beginning_inventory"));
                if (row.containsKey("available_inventory")) {
                    Long avail = getLong(row, "available_inventory");
                    psl.setAvailableInventory(avail);
                    psl.setAvailableStock(avail); // 호환: available_stock 에도 반영
                }
                psl.setSapSyncAt(LocalDateTime.now());

                plantStorageLocationRepo.save(psl);
                processedCount++;

            } catch (Exception e) {
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
                errorCount++;
                log.error("[RFC-002] Row {} 처리 오류: {}", i + 1, e.getMessage());
            }
        }

        // Step 2: SnopRecord에 재고 데이터 반영
        // 핵심: 마스터 데이터(plan_month=null)에서 is_selected=true인 plant_code+storage_location만
        // 해당하는 RFC 재고 데이터를 합산하여 SnopRecord에 반영
        // → 플랜트별 저장위치 화면에서 선택된 저장위치의 재고만 생산계획현황에 표시
        int snopUpdateCount = 0;
        int snopInsertCount = 0;
        try {
            // 마스터 데이터에서 선택된 저장위치 목록 조회 (plan_month=null AND is_selected=true)
            List<PlantStorageLocation> selectedMasters =
                    plantStorageLocationRepo.findByPlanMonthIsNullAndIsSelectedTrue();
            Set<String> selectedKeys = new HashSet<>();
            for (PlantStorageLocation master : selectedMasters) {
                selectedKeys.add(master.getPlantCode() + "|" + master.getStorageLocation());
            }

            log.info("[RFC-002] 선택된 저장위치 마스터 {}건 ({}개 조합)",
                    selectedMasters.size(), selectedKeys.size());

            if (selectedKeys.isEmpty()) {
                log.warn("[RFC-002] 선택된 저장위치가 없어 SnopRecord 재고 반영을 건너뜁니다. " +
                         "플랜트별 저장위치 화면에서 사용할 저장위치를 선택해주세요.");
            } else {
                for (String planMonth : affectedPlanMonths) {
                    // 해당 plan_month의 모든 재고 데이터 조회
                    List<PlantStorageLocation> monthData =
                            plantStorageLocationRepo.findByPlanMonth(planMonth);

                    // 선택된 저장위치에 해당하는 데이터만 필터링하여 item_code별 합산
                    Map<String, Long> beginningSum = new LinkedHashMap<>();
                    Map<String, Long> availableSum = new LinkedHashMap<>();
                    Map<String, String> unitMap = new LinkedHashMap<>();
                    int filteredCount = 0;

                    for (PlantStorageLocation loc : monthData) {
                        String locKey = loc.getPlantCode() + "|" + loc.getStorageLocation();
                        if (!selectedKeys.contains(locKey)) continue; // 선택 안 된 저장위치 제외

                        filteredCount++;
                        String itemCode = loc.getItemCode();
                        if (itemCode == null || itemCode.isEmpty()) continue;

                        if (loc.getBeginningInventory() != null) {
                            beginningSum.merge(itemCode, loc.getBeginningInventory(), Long::sum);
                        }
                        if (loc.getAvailableInventory() != null) {
                            availableSum.merge(itemCode, loc.getAvailableInventory(), Long::sum);
                        }
                        if (loc.getStockUnit() != null && !loc.getStockUnit().isEmpty()) {
                            unitMap.putIfAbsent(itemCode, loc.getStockUnit());
                        }
                    }

                    log.info("[RFC-002] plan_month={}: 전체 {}건 중 선택된 저장위치 {}건 → 품목 {}개",
                            planMonth, monthData.size(), filteredCount, beginningSum.size());

                    // SnopRecord 업데이트
                    for (Map.Entry<String, Long> entry : beginningSum.entrySet()) {
                        String itemCode = entry.getKey();
                        Long totalBeginning = entry.getValue();
                        Long totalAvailable = availableSum.get(itemCode);
                        String unit = unitMap.get(itemCode);

                        List<SnopRecord> existingRecords =
                                snopRecordRepo.findByItemCodeAndPlanMonth(itemCode, planMonth);

                        if (!existingRecords.isEmpty()) {
                            for (SnopRecord record : existingRecords) {
                                record.setBeginningInventory(totalBeginning);
                                if (totalAvailable != null) record.setAvailableInventory(totalAvailable);
                                if (unit != null) record.setInventoryUnit(unit);
                                snopRecordRepo.save(record);
                            }
                            snopUpdateCount += existingRecords.size();
                        } else {
                            SnopRecord record = new SnopRecord();
                            record.setItemCode(itemCode);
                            record.setPlanMonth(planMonth);
                            record.setBeginningInventory(totalBeginning);
                            if (totalAvailable != null) record.setAvailableInventory(totalAvailable);
                            if (unit != null) record.setInventoryUnit(unit);
                            snopRecordRepo.save(record);
                            snopInsertCount++;
                        }
                    }
                }
            }

            log.info("[RFC-002] SnopRecord 재고 반영 완료: 업데이트={}, 신규={}",
                    snopUpdateCount, snopInsertCount);

        } catch (Exception e) {
            log.error("[RFC-002] SnopRecord 재고 반영 중 오류: {}", e.getMessage(), e);
            errors.add("SnopRecord 재고 반영 오류: " + e.getMessage());
        }

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        saveHistory(rfcId, rfcName, executionType, startTime, endTime, durationMs,
                processedCount, errorCount, errors);

        log.info("[RFC-002] 일자별재고 수신 완료: 신규={}, 수정={}, 처리={}, 에러={}, SnopRecord(업데이트={}, 신규={})",
                insertCount, updateCount, processedCount, errorCount, snopUpdateCount, snopInsertCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rfc_id", rfcId);
        result.put("status", errorCount == 0 ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("processed_count", processedCount);
        result.put("insert_count", insertCount);
        result.put("update_count", updateCount);
        result.put("snop_update_count", snopUpdateCount);
        result.put("snop_insert_count", snopInsertCount);
        result.put("error_count", errorCount);
        result.put("errors", errors);
        result.put("duration_ms", durationMs);
        return result;
    }

    // ───────────────────────────────────────────────────────
    // SNOP_RFC_003: 생산실적 동기화
    // RFC fields: plan_month_day → plan_month, item_code,
    //             plant_code, unit → inventory_unit,
    //             production_actual
    // ───────────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> processRfc003(List<Map<String, Object>> dataList, String executionType) {
        String rfcId = "SNOP_RFC_003";
        String rfcName = "생산실적";
        LocalDateTime startTime = LocalDateTime.now();
        int processedCount = 0;
        int errorCount = 0;
        int insertCount = 0;
        int updateCount = 0;
        List<String> errors = new ArrayList<>();

        // RFC 실행시 등록자/수정자를 'IF'로 설정
        setAuditUser();

        log.info("[RFC-003] 생산실적 수신 시작: {}건", dataList.size());

        for (int i = 0; i < dataList.size(); i++) {
            Map<String, Object> row = dataList.get(i);
            try {
                String planMonthDay = getStr(row, "plan_month_day");
                String itemCode = getStr(row, "item_code");
                String plantCode = getStr(row, "plant_code");

                if (itemCode == null || itemCode.isEmpty()) {
                    errors.add("Row " + (i + 1) + ": item_code 누락");
                    errorCount++;
                    continue;
                }

                // plan_month_day (YYYYMMDD) → plan_month (YYYY-MM)
                String planMonth = convertPlanMonthDay(planMonthDay);

                // 키: item_code + plan_month + plant_code
                Optional<SnopRecord> optExisting =
                        snopRecordRepo.findByItemCodeAndPlanMonthAndPlantCode(itemCode, planMonth, plantCode);

                SnopRecord record;
                if (optExisting.isPresent()) {
                    record = optExisting.get();
                    updateCount++;
                } else {
                    record = new SnopRecord();
                    record.setItemCode(itemCode);
                    record.setPlanMonth(planMonth);
                    record.setPlantCode(plantCode);
                    insertCount++;
                }

                // 필드 매핑
                if (row.containsKey("unit")) record.setInventoryUnit(getStr(row, "unit"));
                if (row.containsKey("production_actual")) record.setProductionActual(getLong(row, "production_actual"));

                snopRecordRepo.save(record);
                processedCount++;

            } catch (Exception e) {
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
                errorCount++;
                log.error("[RFC-003] Row {} 처리 오류: {}", i + 1, e.getMessage());
            }
        }

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        saveHistory(rfcId, rfcName, executionType, startTime, endTime, durationMs,
                processedCount, errorCount, errors);

        log.info("[RFC-003] 생산실적 수신 완료: 처리={}, 신규={}, 수정={}, 에러={}",
                processedCount, insertCount, updateCount, errorCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rfc_id", rfcId);
        result.put("status", errorCount == 0 ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("processed_count", processedCount);
        result.put("insert_count", insertCount);
        result.put("update_count", updateCount);
        result.put("error_count", errorCount);
        result.put("errors", errors);
        result.put("duration_ms", durationMs);
        return result;
    }

    // ───────────────────────────────────────────────────────
    // SNOP_RFC_004: 판매실적 동기화
    // RFC fields: plan_month_day → plan_month (앞 6자리 YYYY-MM 변환),
    //             item_code, unit → inventory_unit, sales_actual
    // ───────────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> processRfc004(List<Map<String, Object>> dataList, String executionType) {
        String rfcId = "SNOP_RFC_004";
        String rfcName = "판매실적";
        LocalDateTime startTime = LocalDateTime.now();
        int processedCount = 0;
        int errorCount = 0;
        int insertCount = 0;
        int updateCount = 0;
        List<String> errors = new ArrayList<>();

        // RFC 실행시 등록자/수정자를 'IF'로 설정
        setAuditUser();

        log.info("[RFC-004] 판매실적 수신 시작: {}건", dataList.size());

        for (int i = 0; i < dataList.size(); i++) {
            Map<String, Object> row = dataList.get(i);
            try {
                String planMonthDay = getStr(row, "plan_month_day");
                String itemCode = getStr(row, "item_code");

                if (itemCode == null || itemCode.isEmpty()) {
                    errors.add("Row " + (i + 1) + ": item_code 누락");
                    errorCount++;
                    continue;
                }
                if (planMonthDay == null || planMonthDay.isEmpty()) {
                    errors.add("Row " + (i + 1) + ": plan_month_day 누락");
                    errorCount++;
                    continue;
                }

                // plan_month_day (YYYYMMDD) → plan_month (YYYY-MM)
                String planMonth = convertPlanMonthDay(planMonthDay);

                // 키: plan_month + item_code 두개가 동일한 건에 대해서 update
                List<SnopRecord> existingList =
                        snopRecordRepo.findByItemCodeAndPlanMonth(itemCode, planMonth);

                if (!existingList.isEmpty()) {
                    // 동일한 plan_month + item_code인 모든 레코드에 대해 update
                    for (SnopRecord record : existingList) {
                        if (row.containsKey("unit")) record.setInventoryUnit(getStr(row, "unit"));
                        if (row.containsKey("sales_actual")) record.setSalesActual(getLong(row, "sales_actual"));
                        snopRecordRepo.save(record);
                    }
                    updateCount += existingList.size();
                } else {
                    // 매칭 레코드 없으면 신규 생성
                    SnopRecord record = new SnopRecord();
                    record.setItemCode(itemCode);
                    record.setPlanMonth(planMonth);
                    if (row.containsKey("unit")) record.setInventoryUnit(getStr(row, "unit"));
                    if (row.containsKey("sales_actual")) record.setSalesActual(getLong(row, "sales_actual"));
                    snopRecordRepo.save(record);
                    insertCount++;
                }
                processedCount++;

            } catch (Exception e) {
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
                errorCount++;
                log.error("[RFC-004] Row {} 처리 오류: {}", i + 1, e.getMessage());
            }
        }

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        saveHistory(rfcId, rfcName, executionType, startTime, endTime, durationMs,
                processedCount, errorCount, errors);

        log.info("[RFC-004] 판매실적 수신 완료: 처리={}, 신규={}, 수정={}, 에러={}",
                processedCount, insertCount, updateCount, errorCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rfc_id", rfcId);
        result.put("status", errorCount == 0 ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("processed_count", processedCount);
        result.put("insert_count", insertCount);
        result.put("update_count", updateCount);
        result.put("error_count", errorCount);
        result.put("errors", errors);
        result.put("duration_ms", durationMs);
        return result;
    }

    // ───────────────────────────────────────────────────────
    // SNOP_RFC_006: 리뉴얼 자재 연결 동기화
    // RFC fields: hierarchy_name, item_code → legacy_item_code,
    //             item_name → legacy_item_name,
    //             item_code_1~5 → renewal_item_code_1~5,
    //             item_name_1~5 → renewal_item_name_1~5,
    //             is_active (1=활성화, 2=비활성화),
    //             new_update_type (1=Insert, 2=Update by item_code)
    // 메모: RFC param 개수는 하나고 A 또는 B 값이 들어감
    //       → 인터페이스 마스터관리의 RFC param 값을 읽어서 사용
    //       → 등록자/변경자는 'IF', 등록/수정 일시 자동 기록
    //       → 실행시 인터페이스 이력관리 테이블에 실행결과 기록
    // ───────────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> processRfc006(List<Map<String, Object>> dataList, String executionType) {
        String rfcId = "SNOP_RFC_006";
        String rfcName = "리뉴얼자재연결";
        LocalDateTime startTime = LocalDateTime.now();
        int processedCount = 0;
        int errorCount = 0;
        int insertCount = 0;
        int updateCount = 0;
        List<String> errors = new ArrayList<>();

        // RFC 실행시 등록자/수정자를 'IF'로 설정
        setAuditUser();

        log.info("[RFC-006] 리뉴얼자재연결 수신 시작: {}건", dataList.size());

        for (int i = 0; i < dataList.size(); i++) {
            Map<String, Object> row = dataList.get(i);
            try {
                // RFC의 item_code → S&OP의 legacy_item_code (기존 자재 코드)
                String itemCode = getStr(row, "item_code");
                String updateType = getStr(row, "new_update_type");
                if (updateType == null || updateType.isEmpty()) {
                    updateType = "1"; // 기본값: Insert
                }

                if (itemCode == null || itemCode.isEmpty()) {
                    errors.add("Row " + (i + 1) + ": item_code(legacy_item_code) 누락");
                    errorCount++;
                    continue;
                }

                switch (updateType.trim()) {
                    case "1": // Insert (신규)
                        Optional<RenewalMaterialLinkage> existingForInsert =
                                renewalMaterialLinkageRepo.findFirstByLegacyItemCode(itemCode);
                        if (existingForInsert.isPresent()) {
                            // 이미 존재하면 update로 처리
                            RenewalMaterialLinkage entity = existingForInsert.get();
                            mapRfc006Fields(entity, row);
                            renewalMaterialLinkageRepo.save(entity);
                            updateCount++;
                        } else {
                            RenewalMaterialLinkage entity = new RenewalMaterialLinkage();
                            entity.setLegacyItemCode(itemCode);
                            mapRfc006Fields(entity, row);
                            renewalMaterialLinkageRepo.save(entity);
                            insertCount++;
                        }
                        processedCount++;
                        break;

                    case "2": // Update (item_code=legacy_item_code 기준 수정)
                        Optional<RenewalMaterialLinkage> existingForUpdate =
                                renewalMaterialLinkageRepo.findFirstByLegacyItemCode(itemCode);
                        if (existingForUpdate.isPresent()) {
                            RenewalMaterialLinkage entity = existingForUpdate.get();
                            mapRfc006Fields(entity, row);
                            renewalMaterialLinkageRepo.save(entity);
                            updateCount++;
                        } else {
                            // 수정 대상이 없으면 신규 생성
                            RenewalMaterialLinkage entity = new RenewalMaterialLinkage();
                            entity.setLegacyItemCode(itemCode);
                            mapRfc006Fields(entity, row);
                            renewalMaterialLinkageRepo.save(entity);
                            insertCount++;
                        }
                        processedCount++;
                        break;

                    default:
                        errors.add("Row " + (i + 1) + ": 잘못된 new_update_type: " + updateType + " (1=Insert, 2=Update)");
                        errorCount++;
                }
            } catch (Exception e) {
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
                errorCount++;
                log.error("[RFC-006] Row {} 처리 오류: {}", i + 1, e.getMessage());
            }
        }

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        // 이력 기록
        saveHistory(rfcId, rfcName, executionType, startTime, endTime, durationMs,
                processedCount, errorCount, errors);

        log.info("[RFC-006] 리뉴얼자재연결 수신 완료: 처리={}, 신규={}, 수정={}, 에러={}",
                processedCount, insertCount, updateCount, errorCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rfc_id", rfcId);
        result.put("status", errorCount == 0 ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("processed_count", processedCount);
        result.put("insert_count", insertCount);
        result.put("update_count", updateCount);
        result.put("error_count", errorCount);
        result.put("errors", errors);
        result.put("duration_ms", durationMs);
        return result;
    }

    /**
     * RFC_006 필드 매핑 (RFC B열 → S&OP D열)
     * RFC item_name → legacy_item_name
     * RFC item_code_1~5 → renewal_item_code_1~5
     * RFC item_name_1~5 → renewal_item_name_1~5
     * RFC hierarchy_name → hierarchy_name
     * RFC is_active: 1=활성화(true), 2=비활성화(false)
     */
    private void mapRfc006Fields(RenewalMaterialLinkage entity, Map<String, Object> row) {
        if (row.containsKey("hierarchy_name")) entity.setHierarchyName(getStr(row, "hierarchy_name"));
        if (row.containsKey("item_name")) entity.setLegacyItemName(getStr(row, "item_name"));

        // 리뉴얼 자재 세트 1~5 매핑
        if (row.containsKey("item_code_1")) entity.setRenewalItemCode1(getStr(row, "item_code_1"));
        if (row.containsKey("item_name_1")) entity.setRenewalItemName1(getStr(row, "item_name_1"));
        if (row.containsKey("item_code_2")) entity.setRenewalItemCode2(getStr(row, "item_code_2"));
        if (row.containsKey("item_name_2")) entity.setRenewalItemName2(getStr(row, "item_name_2"));
        if (row.containsKey("item_code_3")) entity.setRenewalItemCode3(getStr(row, "item_code_3"));
        if (row.containsKey("item_name_3")) entity.setRenewalItemName3(getStr(row, "item_name_3"));
        if (row.containsKey("item_code_4")) entity.setRenewalItemCode4(getStr(row, "item_code_4"));
        if (row.containsKey("item_name_4")) entity.setRenewalItemName4(getStr(row, "item_name_4"));
        if (row.containsKey("item_code_5")) entity.setRenewalItemCode5(getStr(row, "item_code_5"));
        if (row.containsKey("item_name_5")) entity.setRenewalItemName5(getStr(row, "item_name_5"));

        // is_active: 1=활성화, 2=비활성화
        if (row.containsKey("is_active")) {
            String isActiveVal = getStr(row, "is_active");
            if ("2".equals(isActiveVal)) {
                entity.setIsActive(false);
            } else {
                entity.setIsActive(true); // 기본값: 활성화
            }
        }
    }

    // ───────────────────────────────────────────────────────
    // 공통 유틸
    // ───────────────────────────────────────────────────────

    /**
     * plan_month_day (YYYYMMDD) → plan_month (YYYY-MM) 변환
     * - "20260401" → "2026-04"
     * - "2026-04-01" → "2026-04"
     * - "2026-04" → "2026-04" (이미 변환됨)
     */
    private String convertPlanMonthDay(String planMonthDay) {
        if (planMonthDay == null || planMonthDay.isEmpty()) return null;
        String trimmed = planMonthDay.trim();
        // YYYYMMDD 형식
        if (trimmed.length() == 8 && !trimmed.contains("-")) {
            return trimmed.substring(0, 4) + "-" + trimmed.substring(4, 6);
        }
        // YYYY-MM-DD 형식
        if (trimmed.length() >= 7 && trimmed.charAt(4) == '-') {
            return trimmed.substring(0, 7);
        }
        // YYYY/MM/DD 형식
        if (trimmed.length() >= 7 && trimmed.charAt(4) == '/') {
            return trimmed.substring(0, 4) + "-" + trimmed.substring(5, 7);
        }
        return trimmed;
    }

    /**
     * RFC 실행시 AuditUserContext에 'IF' 설정
     * → AuditEntityListener가 created_by / updated_by를 'IF'로 자동 설정
     * → created_at / updated_at은 AuditEntityListener에서 자동 처리
     */
    private void setAuditUser() {
        AuditUserContext.set("IF");
    }

    /** 이력 저장 */
    private void saveHistory(String rfcId, String rfcName, String executionType,
                             LocalDateTime startTime, LocalDateTime endTime, long durationMs,
                             int processedCount, int errorCount, List<String> errors) {
        String status;
        if (errorCount == 0 && processedCount > 0) {
            status = "SUCCESS";
        } else if (processedCount > 0) {
            status = "PARTIAL_SUCCESS";
        } else {
            status = "ERROR";
        }

        String errorMessage = null;
        if (!errors.isEmpty()) {
            errorMessage = String.join("; ", errors);
            if (errorMessage.length() > 1900) {
                errorMessage = errorMessage.substring(0, 1900) + "...";
            }
        }

        InterfaceHistory history = InterfaceHistory.builder()
                .interfaceId(rfcId)
                .interfaceName(rfcName)
                .executionType(executionType != null ? executionType : "RFC")
                .startTime(startTime)
                .endTime(endTime)
                .durationMs(durationMs)
                .processedCount(processedCount)
                .errorCount(errorCount)
                .status(status)
                .errorMessage(errorMessage)
                .build();
        historyRepo.save(history);
    }

    // ───────────────────────────────────────────────────────
    // SNOP_RFC_005: 전월 마감실적 동기화
    // RFC fields: plan_month_day → closing_month (앞 6자리 → YYYY-MM),
    //             item_code, hierarchy_name, unit,
    //             sales_actual(전월 판매량), production_actual(전월 생산량),
    //             ending_inventory(전월말 재고)
    // 처리방식: closing_month + item_code 동일 건 → sales_actual, production_actual,
    //           ending_inventory DELETE 후 INSERT
    // I/F 주기: 월 마감 이후 월 1회 (ex. 4/2일에 3월 실적 조회)
    //
    // 인풋 파라미터(년월):
    //   - 인풋 파라미터 있을 때: ex) 202604 입력 → plan_month_day 앞 6자리를 closing_month에 저장
    //   - 인풋 파라미터 없을 때: 전월 데이터 자동 (시스템일자 기준 전월)
    //
    // plan_month_day 값:
    //   - 인풋 파라미터(YYYYMM) 입력 시 → 해당 값 그대로 closing_month (YYYY-MM)로 변환
    //   - 인풋 파라미터 없이 RFC 실행일(YYYYMMDD) 수신 시 → 앞 6자리의 전월로 변환
    //   - closing_month 필드로 직접 전송 시 → 형식 변환만 수행 (전월 변환 안함)
    // ───────────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> processRfc005(List<Map<String, Object>> dataList, String executionType) {
        return processRfc005(dataList, executionType, null);
    }

    /**
     * RFC_005 처리 (인풋 파라미터 지원 버전)
     * @param dataList RFC 수신 데이터
     * @param executionType 실행유형 (RFC/MANUAL/SCHEDULED)
     * @param inputYearMonth 인풋 파라미터 (YYYYMM 형식, null이면 자동)
     */
    @Transactional
    public Map<String, Object> processRfc005(List<Map<String, Object>> dataList, String executionType, String inputYearMonth) {
        String rfcId = "SNOP_RFC_005";
        String rfcName = "월말마감실적";
        LocalDateTime startTime = LocalDateTime.now();
        int processedCount = 0;
        int errorCount = 0;
        int insertCount = 0;
        int deleteCount = 0;
        List<String> errors = new ArrayList<>();

        setAuditUser();

        // 인풋 파라미터 처리: 년월(YYYYMM) → closing_month(YYYY-MM)
        // 인풋 파라미터가 없으면 시스템 날짜 기준 전월 자동 산출
        String defaultClosingMonth = null;
        if (inputYearMonth != null && !inputYearMonth.trim().isEmpty()) {
            // 인풋 파라미터 있음: 입력된 년월을 그대로 closing_month로 변환
            defaultClosingMonth = convertClosingMonth(inputYearMonth.trim(), false);
            log.info("[RFC-005] 인풋 파라미터(년월): {} → closing_month: {}", inputYearMonth, defaultClosingMonth);
        } else {
            // 인풋 파라미터 없음: 시스템 날짜 기준 전월 자동 산출
            java.time.YearMonth prevMonth = java.time.YearMonth.now().minusMonths(1);
            defaultClosingMonth = prevMonth.toString(); // YYYY-MM
            log.info("[RFC-005] 인풋 파라미터 없음 → 전월 자동 산출: {}", defaultClosingMonth);
        }

        log.info("[RFC-005] 월말마감실적 수신 시작: {}건, closing_month: {}", dataList.size(), defaultClosingMonth);

        for (int i = 0; i < dataList.size(); i++) {
            Map<String, Object> row = dataList.get(i);
            try {
                String itemCode = getStr(row, "item_code");

                if (itemCode == null || itemCode.isEmpty()) {
                    errors.add("Row " + (i + 1) + ": item_code 누락");
                    errorCount++;
                    continue;
                }

                // closing_month 결정
                // 1순위: 인풋 파라미터로 결정된 defaultClosingMonth
                // 2순위: RFC 데이터의 plan_month_day (앞 6자리 → YYYY-MM)
                // 3순위: RFC 데이터의 closing_month 필드
                String closingMonth = defaultClosingMonth;
                if (closingMonth == null) {
                    String planMonthDay = getStr(row, "plan_month_day");
                    boolean needsPrevMonth = (planMonthDay != null && !planMonthDay.isEmpty());
                    String closingMonthRaw = needsPrevMonth
                            ? planMonthDay : getStr(row, "closing_month");
                    if (closingMonthRaw != null && !closingMonthRaw.isEmpty()) {
                        closingMonth = convertClosingMonth(closingMonthRaw, needsPrevMonth);
                    }
                }

                if (closingMonth == null || closingMonth.isEmpty()) {
                    errors.add("Row " + (i + 1) + ": closing_month 결정 불가 (plan_month_day 또는 closing_month 누락)");
                    errorCount++;
                    continue;
                }

                // ── closing_month + item_code 동일 건 DELETE 후 INSERT ──
                // 요건: 두 키가 동일한 기존 건의 sales_actual, production_actual, ending_inventory를
                //       삭제하고 신규 데이터를 insert
                Optional<MonthlyClosing> optExisting =
                        monthlyClosingRepo.findByItemCodeAndClosingMonth(itemCode, closingMonth);

                if (optExisting.isPresent()) {
                    // 기존 건 삭제
                    monthlyClosingRepo.delete(optExisting.get());
                    monthlyClosingRepo.flush(); // DELETE 즉시 반영
                    deleteCount++;
                    log.info("[RFC-005] 기존 건 삭제: item_code={}, closing_month={}", itemCode, closingMonth);
                }

                // 신규 INSERT
                MonthlyClosing record = new MonthlyClosing();
                record.setItemCode(itemCode);
                record.setClosingMonth(closingMonth);

                // 필드 매핑 (엑셀 B열 → D열)
                if (row.containsKey("item_name")) record.setItemName(getStr(row, "item_name"));
                if (row.containsKey("hierarchy_name")) record.setHierarchyName(getStr(row, "hierarchy_name"));
                if (row.containsKey("unit")) record.setUnit(getStr(row, "unit"));
                if (row.containsKey("ending_inventory")) record.setEndingInventory(getLong(row, "ending_inventory"));
                if (row.containsKey("production_actual")) record.setProductionActual(getLong(row, "production_actual"));
                if (row.containsKey("sales_actual")) record.setSalesActual(getLong(row, "sales_actual"));
                if (row.containsKey("notes")) record.setNotes(getStr(row, "notes"));

                monthlyClosingRepo.save(record);
                insertCount++;
                processedCount++;

            } catch (Exception e) {
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
                errorCount++;
                log.error("[RFC-005] Row {} 처리 오류: {}", i + 1, e.getMessage());
            }
        }

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        saveHistory(rfcId, rfcName, executionType, startTime, endTime, durationMs,
                processedCount, errorCount, errors);

        log.info("[RFC-005] 월말마감실적 수신 완료: 처리={}, 삭제={}, 신규={}, 에러={}",
                processedCount, deleteCount, insertCount, errorCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rfc_id", rfcId);
        result.put("status", errorCount == 0 ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("processed_count", processedCount);
        result.put("delete_count", deleteCount);
        result.put("insert_count", insertCount);
        result.put("error_count", errorCount);
        result.put("errors", errors);
        result.put("duration_ms", durationMs);
        result.put("closing_month", defaultClosingMonth);
        return result;
    }

    /**
     * closing_month 변환
     * plan_month_day(RFC 실행일)인 경우 전월로 변환:
     * - "20260413" → 앞6자리 "202604" → 전월 → "2026-03"
     * - "20260102" → 앞6자리 "202601" → 전월 → "2025-12" (연도 넘김)
     * closing_month 직접 전송인 경우 형식 변환만:
     * - "202603" → "2026-03"
     * - "2026-03" → "2026-03" (이미 변환됨)
     *
     * @param raw 원본 값 (plan_month_day 또는 closing_month)
     * @param subtractMonth true이면 전월로 변환 (plan_month_day → 전월 마감월)
     */
    private String convertClosingMonth(String raw, boolean subtractMonth) {
        if (raw == null || raw.isEmpty()) return null;
        String trimmed = raw.trim();

        // Step 1: YYYY-MM 형식으로 통일
        String yyyyMm;
        if (trimmed.length() == 6 && !trimmed.contains("-")) {
            // YYYYMM → YYYY-MM
            yyyyMm = trimmed.substring(0, 4) + "-" + trimmed.substring(4, 6);
        } else if (trimmed.length() == 8 && !trimmed.contains("-")) {
            // YYYYMMDD → 앞 6자리 → YYYY-MM
            yyyyMm = trimmed.substring(0, 4) + "-" + trimmed.substring(4, 6);
        } else if (trimmed.length() >= 7 && trimmed.charAt(4) == '-') {
            // YYYY-MM-DD 또는 YYYY-MM → YYYY-MM
            yyyyMm = trimmed.substring(0, 7);
        } else {
            yyyyMm = trimmed;
        }

        // Step 2: plan_month_day인 경우 전월로 변환
        // RFC 설계서: plan_month_day는 RFC 실행일(당월)이고, 데이터는 전월 실적
        // ex) 4/13에 실행 → plan_month_day=20260413 → 202604 → 전월 2026-03
        if (subtractMonth) {
            try {
                java.time.YearMonth ym = java.time.YearMonth.parse(yyyyMm);
                java.time.YearMonth prevMonth = ym.minusMonths(1);
                yyyyMm = prevMonth.toString(); // YYYY-MM 형식
                log.info("[RFC-005] plan_month_day 전월 변환: {} → {}", raw, yyyyMm);
            } catch (Exception e) {
                log.warn("[RFC-005] 전월 변환 실패 (원본값 사용): {} - {}", raw, e.getMessage());
            }
        }

        return yyyyMm;
    }

    /** Map에서 String 값 추출 */
    private String getStr(Map<String, Object> row, String key) {
        Object val = row.get(key);
        return val != null ? val.toString().trim() : null;
    }

    /** Map에서 Double 값 추출 */
    private Double getDouble(Map<String, Object> row, String key) {
        Object val = row.get(key);
        if (val == null) return null;
        if (val instanceof Number) return ((Number) val).doubleValue();
        try {
            return Double.parseDouble(val.toString().trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /** Map에서 Long 값 추출 */
    private Long getLong(Map<String, Object> row, String key) {
        Object val = row.get(key);
        if (val == null) return null;
        if (val instanceof Number) return ((Number) val).longValue();
        try {
            return Long.parseLong(val.toString().trim().replaceAll("[^\\d-]", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
