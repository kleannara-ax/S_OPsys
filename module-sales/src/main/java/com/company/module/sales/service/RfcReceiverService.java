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

                // 자재코드가 'H'로 시작하는 자재는 S&OP 관리 대상이 아니므로 skip
                if (itemCode.toUpperCase().startsWith("H")) {
                    log.debug("[RFC-001] H 자재 제외: {}", itemCode);
                    continue;
                }

                switch (updateType.trim()) {
                    case "1": // Insert (신규)
                        List<BaseMaterialMaster> existingForInsert = baseMaterialMasterRepo.findByItemCodeIgnoreCase(itemCode);
                        if (!existingForInsert.isEmpty()) {
                            // 이미 존재하면 update로 처리 (대소문자 무관)
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
                        List<BaseMaterialMaster> existingForUpdate = baseMaterialMasterRepo.findByItemCodeIgnoreCase(itemCode);
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
        if (hasKey(row, "scm_area")) master.setScmArea(getStr(row, "scm_area"));
        if (hasKey(row, "hierarchy_name")) master.setHierarchyName(getStr(row, "hierarchy_name"));
        if (hasKey(row, "production_unit")) master.setProductionUnit(getStr(row, "production_unit"));
        if (hasKey(row, "item_name")) master.setItemName(getStr(row, "item_name"));
        if (hasKey(row, "conversion1")) master.setConversion1(getDouble(row, "conversion1"));
        if (hasKey(row, "conversion2")) master.setConversion2(getDouble(row, "conversion2"));
        if (hasKey(row, "conversion3")) master.setConversion3(getDouble(row, "conversion3"));
        if (hasKey(row, "conversion5")) master.setConversion5(getDouble(row, "conversion5"));
        if (hasKey(row, "vendor_name")) master.setVendorName(getStr(row, "vendor_name"));
    }

    // ───────────────────────────────────────────────────────
    // SNOP_RFC_002: 일자별재고 동기화
    // RFC fields: plan_month_day → plan_month, item_code,
    //             plant_code, storage_location, unit → stock_unit,
    //             beginning_inventory→화면 "현재고", available_inventory→화면 "가용재고"
    // 처리 방식:
    //   Step 1: plant_code + storage_location + plan_month 키로 upsert (is_selected 유지)
    //   Step 2: is_selected=true인 저장위치만 합산하여 SnopRecord에 반영
    // ───────────────────────────────────────────────────────
    /** RFC_002 동시 실행 방지 락 — 동일 시점에 두 번 실행되면 중복 레코드 생성됨 */
    private static final Object RFC_002_LOCK = new Object();

    @Transactional
    public Map<String, Object> processRfc002(List<Map<String, Object>> dataList, String executionType) {
      synchronized (RFC_002_LOCK) {
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
        // seed 자동 생성 추적용 — 동일 RFC 실행 내 plant+storage 중복 seed 생성 방지
        Set<String> autoCreatedSeeds = new HashSet<>();

        // Step 1: Upsert — item_code + plant_code + storage_location + plan_month 키로 기존 레코드 업데이트 또는 신규 생성
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

                // 기존 레코드 조회: item_code + plant_code + storage_location + plan_month
                // ※ List로 조회하여 다건이어도 NonUniqueResultException 방지
                //    → 다건이면 첫 번째만 사용하고 나머지 중복은 삭제
                List<PlantStorageLocation> existingList =
                        plantStorageLocationRepo.findByItemCodeAndPlantCodeAndStorageLocationAndPlanMonth(
                                itemCode, plantCode, storageLocation != null ? storageLocation : "", planMonth);

                // seed 데이터(plan_month=null)에서 is_selected 조회 — 신규/기존 모두 동기화
                String storageLoc = storageLocation != null ? storageLocation : "";
                List<PlantStorageLocation> seedRecords =
                        plantStorageLocationRepo.findByPlantCodeAndStorageLocationAndPlanMonthIsNull(
                                plantCode, storageLoc);
                Boolean seedIsSelected;
                if (!seedRecords.isEmpty()) {
                    seedIsSelected = seedRecords.get(0).getIsSelected();
                } else {
                    // seed가 없으면 자동 생성 (is_selected=true) — SAP에서 넘어온 저장위치는 기본 선택
                    String seedKey = plantCode + "|" + storageLoc;
                    if (!autoCreatedSeeds.contains(seedKey)) {
                        PlantStorageLocation newSeed = new PlantStorageLocation();
                        newSeed.setPlantCode(plantCode);
                        newSeed.setStorageLocation(storageLoc);
                        newSeed.setPlanMonth(null);
                        newSeed.setIsSelected(true);
                        plantStorageLocationRepo.save(newSeed);
                        autoCreatedSeeds.add(seedKey);
                        log.info("[RFC-002] seed 자동 생성: plant={}, storage={}, is_selected=true",
                                plantCode, storageLoc);
                    }
                    seedIsSelected = true;
                }

                PlantStorageLocation psl;
                if (!existingList.isEmpty()) {
                    psl = existingList.get(0);
                    // 중복 레코드가 있으면 첫 번째만 남기고 나머지 삭제
                    if (existingList.size() > 1) {
                        for (int j = 1; j < existingList.size(); j++) {
                            plantStorageLocationRepo.delete(existingList.get(j));
                        }
                        log.info("[RFC-002] 중복 레코드 {}건 자동 삭제: item={}, plant={}, storage={}, month={}",
                                existingList.size() - 1, itemCode, plantCode, storageLocation, planMonth);
                    }
                    // 기존 레코드도 seed의 is_selected와 항상 동기화
                    if (seedIsSelected != null) {
                        psl.setIsSelected(seedIsSelected);
                    }
                    updateCount++;
                } else {
                    // 신규 생성 — seed 데이터(plan_month=null)의 is_selected를 상속
                    psl = new PlantStorageLocation();
                    psl.setPlantCode(plantCode);
                    psl.setStorageLocation(storageLocation);
                    psl.setPlanMonth(planMonth);

                    if (seedIsSelected != null) {
                        psl.setIsSelected(seedIsSelected);
                    }

                    insertCount++;
                }

                // 공통 필드 업데이트
                psl.setItemCode(itemCode);
                if (hasKey(row, "unit")) psl.setStockUnit(getStr(row, "unit"));
                // SAP 필드 → PlantStorageLocation 정방향 매핑 (1:1):
                //   SAP BEGINNING_INVENTORY → psl.beginningInventory → SnopRecord.beginningInventory → 화면 "현재고"
                //   SAP AVAILABLE_INVENTORY → psl.availableInventory → SnopRecord.availableInventory → 화면 "가용재고"
                Double sapBeginningInv = hasKey(row, "beginning_inventory") ? getDouble(row, "beginning_inventory") : null;
                Double sapAvailableInv = hasKey(row, "available_inventory") ? getDouble(row, "available_inventory") : null;

                if (sapBeginningInv != null) {
                    psl.setBeginningInventory(sapBeginningInv);
                }
                if (sapAvailableInv != null) {
                    psl.setAvailableInventory(sapAvailableInv);
                    psl.setAvailableStock(sapAvailableInv);
                }

                // 디버그 로그: 처음 3건만 상세 출력 (배포 후 값 확인용)
                if (i < 3) {
                    log.info("[RFC-002] DEBUG Row {}: item={}, SAP beginning_inv={} → PSL.beginningInventory(현재고), SAP available_inv={} → PSL.availableInventory(가용재고)",
                            i + 1, itemCode, sapBeginningInv, sapAvailableInv);
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

        // Step 1 완료 후 flush — Step 2에서 최신 데이터(자동 생성된 seed 포함) 조회 보장
        plantStorageLocationRepo.flush();

        // Step 1.5: SAP에서 더 이상 보내지 않는 기존 행의 재고를 0으로 초기화
        // SAP T_OUTPUT에 없는 저장위치의 이전 데이터가 합산에 포함되지 않도록 정리
        int staleResetCount = 0;
        try {
            // 이번 RFC에서 수신된 키 목록 구성 (item_code|plant_code|storage_location|plan_month)
            Set<String> receivedKeys = new HashSet<>();
            for (Map<String, Object> row : dataList) {
                String rItemCode = getStr(row, "item_code");
                String rPlantCode = getStr(row, "plant_code");
                String rStorageLoc = getStr(row, "storage_location");
                String rPlanMonth = convertPlanMonthDay(getStr(row, "plan_month_day"));
                if (rItemCode != null && rPlantCode != null && rPlanMonth != null) {
                    receivedKeys.add(rItemCode + "|" + rPlantCode + "|" +
                            (rStorageLoc != null ? rStorageLoc : "") + "|" + rPlanMonth);
                }
            }

            // 영향받는 plan_month별로 기존 데이터 조회 → 수신 키에 없으면 재고 0 처리
            for (String planMonth : affectedPlanMonths) {
                List<PlantStorageLocation> monthData =
                        plantStorageLocationRepo.findByPlanMonth(planMonth);
                for (PlantStorageLocation loc : monthData) {
                    String locKey = loc.getItemCode() + "|" + loc.getPlantCode() + "|" +
                            (loc.getStorageLocation() != null ? loc.getStorageLocation() : "") + "|" + planMonth;
                    if (!receivedKeys.contains(locKey)) {
                        // SAP에서 더 이상 보내지 않는 행 → 재고 0 처리
                        boolean changed = false;
                        if (loc.getBeginningInventory() != null && loc.getBeginningInventory() != 0.0) {
                            loc.setBeginningInventory(0.0);
                            changed = true;
                        }
                        if (loc.getAvailableInventory() != null && loc.getAvailableInventory() != 0.0) {
                            loc.setAvailableInventory(0.0);
                            changed = true;
                        }
                        if (loc.getAvailableStock() != null && loc.getAvailableStock() != 0.0) {
                            loc.setAvailableStock(0.0);
                            changed = true;
                        }
                        if (changed) {
                            loc.setSapSyncAt(LocalDateTime.now());
                            plantStorageLocationRepo.save(loc);
                            staleResetCount++;
                        }
                    }
                }
            }
            if (staleResetCount > 0) {
                log.info("[RFC-002] SAP 미수신 저장위치 재고 0 초기화: {}건", staleResetCount);
                plantStorageLocationRepo.flush();
            }
        } catch (Exception e) {
            log.warn("[RFC-002] 미수신 저장위치 정리 중 오류 (무시): {}", e.getMessage());
        }

        // Step 2: SnopRecord에 재고 데이터 반영
        // 핵심: 마스터 데이터(plan_month=null)에서 is_selected=true인 plant_code+storage_location만
        // 해당하는 RFC 재고 데이터를 합산하여 SnopRecord에 반영
        // → 플랜트별 저장위치 화면에서 선택된 저장위치의 재고만 생산계획현황에 표시
        int snopUpdateCount = 0;
        int snopInsertCount = 0;
        int snopSkipCount = 0;
        try {
            // 마스터 데이터에서 선택된 저장위치 목록 조회 (plan_month=null AND is_selected=true)
            // ※ Step 1에서 자동 생성된 seed(is_selected=true)도 포함됨
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
                    Map<String, Double> beginningSum = new LinkedHashMap<>();
                    Map<String, Double> availableSum = new LinkedHashMap<>();
                    Map<String, String> unitMap = new LinkedHashMap<>();
                    int filteredCount = 0;

                    for (PlantStorageLocation loc : monthData) {
                        String locKey = loc.getPlantCode() + "|" + loc.getStorageLocation();
                        if (!selectedKeys.contains(locKey)) continue; // 선택 안 된 저장위치 제외

                        filteredCount++;
                        String itemCode = loc.getItemCode();
                        if (itemCode == null || itemCode.isEmpty()) continue;

                        if (loc.getBeginningInventory() != null) {
                            beginningSum.merge(itemCode, loc.getBeginningInventory(), Double::sum);
                        }
                        if (loc.getAvailableInventory() != null) {
                            availableSum.merge(itemCode, loc.getAvailableInventory(), Double::sum);
                        }
                        if (loc.getStockUnit() != null && !loc.getStockUnit().isEmpty()) {
                            unitMap.putIfAbsent(itemCode, loc.getStockUnit());
                        }
                    }

                    log.info("[RFC-002] plan_month={}: 전체 {}건 중 선택된 저장위치 {}건 → 품목 {}개",
                            planMonth, monthData.size(), filteredCount, beginningSum.size());

                    // SnopRecord 업데이트
                    int debugCounter = 0;
                    for (Map.Entry<String, Double> entry : beginningSum.entrySet()) {
                        String itemCode = entry.getKey();
                        Double totalBeginning = entry.getValue();
                        Double totalAvailable = availableSum.get(itemCode);
                        String unit = unitMap.get(itemCode);

                        // 디버그 로그: 처음 3건만 상세 출력
                        if (debugCounter < 3) {
                            log.info("[RFC-002] DEBUG Step2: item={}, month={}, beginningSum(현재고)={}, availableSum(가용재고)={}",
                                    itemCode, planMonth, totalBeginning, totalAvailable);
                            debugCounter++;
                        }

                        List<SnopRecord> existingRecords =
                                snopRecordRepo.findByItemCodeAndPlanMonth(itemCode, planMonth);

                        // SnopRecord 필드 매핑 (정방향 1:1):
                        //   beginningSum = SAP BEGINNING_INVENTORY → SnopRecord.beginningInventory → 화면 "현재고"
                        //   availableSum = SAP AVAILABLE_INVENTORY → SnopRecord.availableInventory → 화면 "가용재고"
                        if (!existingRecords.isEmpty()) {
                            for (SnopRecord record : existingRecords) {
                                record.setBeginningInventory(totalBeginning);
                                if (totalAvailable != null) record.setAvailableInventory(totalAvailable);
                                if (unit != null) record.setInventoryUnit(unit);
                                snopRecordRepo.save(record);
                            }
                            snopUpdateCount += existingRecords.size();
                        } else {
                            // 기본자재마스터에 미등록된 자재는 SnopRecord 신규 생성 skip
                            List<BaseMaterialMaster> masterCheck = baseMaterialMasterRepo.findByItemCodeIgnoreCase(itemCode);
                            if (masterCheck.isEmpty()) {
                                snopSkipCount++;
                                if (snopSkipCount <= 5) {
                                    log.info("[RFC-002] SnopRecord 신규 생성 skip (기본자재마스터 미등록): item={}, month={}", itemCode, planMonth);
                                }
                                continue;
                            }
                            SnopRecord record = new SnopRecord();
                            record.setItemCode(itemCode);
                            record.setPlanMonth(planMonth);
                            record.setBeginningInventory(totalBeginning);
                            if (totalAvailable != null) record.setAvailableInventory(totalAvailable);
                            if (unit != null) record.setInventoryUnit(unit);
                            // 신규 생성 시 자재마스터에서 자재명/카테고리/생산라인 등 보충
                            enrichFromMaterialMaster(record, itemCode);
                            snopRecordRepo.save(record);
                            snopInsertCount++;
                        }
                    }
                }
            }

            log.info("[RFC-002] SnopRecord 재고 반영 완료: 업데이트={}, 신규={}, skip(마스터미등록)={}",
                    snopUpdateCount, snopInsertCount, snopSkipCount);

        } catch (Exception e) {
            log.error("[RFC-002] SnopRecord 재고 반영 중 오류: {}", e.getMessage(), e);
            errors.add("SnopRecord 재고 반영 오류: " + e.getMessage());
        }

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        saveHistory(rfcId, rfcName, executionType, startTime, endTime, durationMs,
                processedCount, errorCount, errors);

        log.info("[RFC-002] 일자별재고 수신 완료: 신규={}, 수정={}, 처리={}, 에러={}, 미수신초기화={}, SnopRecord(업데이트={}, 신규={}, skip={})",
                insertCount, updateCount, processedCount, errorCount, staleResetCount, snopUpdateCount, snopInsertCount, snopSkipCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rfc_id", rfcId);
        result.put("status", errorCount == 0 ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("processed_count", processedCount);
        result.put("insert_count", insertCount);
        result.put("update_count", updateCount);
        result.put("stale_reset_count", staleResetCount);
        result.put("snop_update_count", snopUpdateCount);
        result.put("snop_insert_count", snopInsertCount);
        result.put("snop_skip_count", snopSkipCount);
        result.put("error_count", errorCount);
        result.put("errors", errors);
        result.put("duration_ms", durationMs);
        return result;
      } // synchronized (RFC_002_LOCK)
    }

    // ───────────────────────────────────────────────────────
    // SNOP_RFC_003: 생산실적 동기화
    // RFC fields: plan_month_day → plan_month, item_code,
    //             plant_code, unit → inventory_unit,
    //             production_actual
    // 처리 방식:
    //   Step 1: item_code + plan_month 기준으로 plant_code별 production_actual 합산
    //   Step 2: 합산된 값을 SnopRecord에 upsert (item_code + plan_month 키)
    //   ※ 생산계획현황 화면은 자재+월 기준 한 행이므로 plant_code별 분리 불필요
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
        int skipCount = 0;
        List<String> errors = new ArrayList<>();

        // RFC 실행시 등록자/수정자를 'IF'로 설정
        setAuditUser();

        log.info("[RFC-003] 생산실적 수신 시작: {}건", dataList.size());

        // Step 1: item_code + plan_month 기준으로 production_actual 합산
        // SAP에서 plant_code별로 나눠서 오지만, 화면에서는 자재+월 기준 한 행
        Map<String, Long> actualSum = new LinkedHashMap<>();   // key: itemCode|planMonth → 합산값
        Map<String, String> unitMap = new LinkedHashMap<>();    // key: itemCode|planMonth → unit

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

                String planMonth = convertPlanMonthDay(planMonthDay);
                String key = itemCode + "|" + planMonth;

                Long prodActual = getLong(row, "production_actual");
                if (prodActual != null) {
                    actualSum.merge(key, prodActual, Long::sum);
                }

                if (hasKey(row, "unit")) {
                    unitMap.putIfAbsent(key, getStr(row, "unit"));
                }

                processedCount++;

            } catch (Exception e) {
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
                errorCount++;
                log.error("[RFC-003] Row {} 처리 오류: {}", i + 1, e.getMessage());
            }
        }

        log.info("[RFC-003] 합산 완료: {}건 → {}개 자재+월 조합", dataList.size(), actualSum.size());

        // Step 2: 합산된 값을 SnopRecord에 반영 (item_code + plan_month 키)
        for (Map.Entry<String, Long> entry : actualSum.entrySet()) {
            try {
                String[] parts = entry.getKey().split("\\|", 2);
                String itemCode = parts[0];
                String planMonth = parts.length > 1 ? parts[1] : null;
                Long totalActual = entry.getValue();
                String unit = unitMap.get(entry.getKey());

                // item_code + plan_month 기준 기존 레코드 조회
                Optional<SnopRecord> optExisting =
                        snopRecordRepo.findFirstByItemCodeAndPlanMonth(itemCode, planMonth);

                SnopRecord record;
                if (optExisting.isPresent()) {
                    record = optExisting.get();
                    updateCount++;
                } else {
                    // 기본자재마스터에 미등록된 자재는 SnopRecord 신규 생성 skip
                    List<BaseMaterialMaster> masterCheck = baseMaterialMasterRepo.findByItemCodeIgnoreCase(itemCode);
                    if (masterCheck.isEmpty()) {
                        skipCount++;
                        if (skipCount <= 5) {
                            log.info("[RFC-003] SnopRecord 신규 생성 skip (기본자재마스터 미등록): item={}, month={}", itemCode, planMonth);
                        }
                        continue;
                    }
                    record = new SnopRecord();
                    record.setItemCode(itemCode);
                    record.setPlanMonth(planMonth);
                    // 신규 생성 시 자재마스터에서 정보 보충
                    enrichFromMaterialMaster(record, itemCode);
                    insertCount++;
                }

                record.setProductionActual(totalActual);
                if (unit != null) record.setInventoryUnit(unit);

                snopRecordRepo.save(record);

            } catch (Exception e) {
                errors.add("합산 반영 오류 [" + entry.getKey() + "]: " + e.getMessage());
                errorCount++;
                log.error("[RFC-003] 합산 반영 오류 [{}]: {}", entry.getKey(), e.getMessage());
            }
        }

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        saveHistory(rfcId, rfcName, executionType, startTime, endTime, durationMs,
                processedCount, errorCount, errors);

        log.info("[RFC-003] 생산실적 수신 완료: 처리={}, 합산={}개, 신규={}, 수정={}, skip(마스터미등록)={}, 에러={}",
                processedCount, actualSum.size(), insertCount, updateCount, skipCount, errorCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rfc_id", rfcId);
        result.put("status", errorCount == 0 ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("processed_count", processedCount);
        result.put("insert_count", insertCount);
        result.put("update_count", updateCount);
        result.put("skip_count", skipCount);
        result.put("error_count", errorCount);
        result.put("errors", errors);
        result.put("duration_ms", durationMs);
        return result;
    }

    // ───────────────────────────────────────────────────────
    // SNOP_RFC_004: 판매실적 동기화
    // RFC fields: plan_month_day → plan_month (앞 6자리 YYYY-MM 변환),
    //             item_code, unit → inventory_unit, sales_actual
    // SAP에서 일별 데이터가 여러 건 올 수 있으므로
    // RFC_003(생산실적)과 동일하게 item_code+plan_month 기준 합산 처리
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
        int skipCount = 0;
        List<String> errors = new ArrayList<>();

        // RFC 실행시 등록자/수정자를 'IF'로 설정
        setAuditUser();

        log.info("[RFC-004] 판매실적 수신 시작: {}건", dataList.size());

        // Step 1: item_code + plan_month 기준으로 sales_actual 합산
        // SAP에서 일별로 나눠서 오지만, 화면에서는 자재+월 기준 한 행
        Map<String, Long> actualSum = new LinkedHashMap<>();   // key: itemCode|planMonth → 합산값
        Map<String, String> unitMap = new LinkedHashMap<>();    // key: itemCode|planMonth → unit

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
                String key = itemCode + "|" + planMonth;

                Long salesActual = getLong(row, "sales_actual");
                log.debug("[RFC-004] Row {}: item_code={}, plan_month_day={} → plan_month={}, sales_actual={}",
                        i + 1, itemCode, planMonthDay, planMonth, salesActual);

                if (salesActual != null) {
                    actualSum.merge(key, salesActual, Long::sum);
                }

                if (hasKey(row, "unit")) {
                    unitMap.putIfAbsent(key, getStr(row, "unit"));
                }

                processedCount++;

            } catch (Exception e) {
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
                errorCount++;
                log.error("[RFC-004] Row {} 처리 오류: {}", i + 1, e.getMessage());
            }
        }

        log.info("[RFC-004] 합산 완료: {}건 → {}개 자재+월 조합", dataList.size(), actualSum.size());

        // Step 2: 합산된 값을 SnopRecord에 반영 (item_code + plan_month 키)
        for (Map.Entry<String, Long> entry : actualSum.entrySet()) {
            try {
                String[] parts = entry.getKey().split("\\|", 2);
                String itemCode = parts[0];
                String planMonth = parts.length > 1 ? parts[1] : null;
                Long totalActual = entry.getValue();
                String unit = unitMap.get(entry.getKey());

                // item_code + plan_month 기준 기존 레코드 조회
                List<SnopRecord> existingList =
                        snopRecordRepo.findByItemCodeAndPlanMonth(itemCode, planMonth);

                if (!existingList.isEmpty()) {
                    // 동일한 plan_month + item_code인 모든 레코드에 대해 update
                    for (SnopRecord record : existingList) {
                        record.setSalesActual(totalActual);
                        if (unit != null) record.setInventoryUnit(unit);
                        snopRecordRepo.save(record);
                        log.debug("[RFC-004] UPDATE: id={}, item_code={}, plan_month={}, sales_actual={}",
                                record.getId(), itemCode, planMonth, totalActual);
                    }
                    updateCount += existingList.size();
                } else {
                    // 기본자재마스터에 미등록된 자재는 SnopRecord 신규 생성 skip
                    List<BaseMaterialMaster> masterCheck = baseMaterialMasterRepo.findByItemCodeIgnoreCase(itemCode);
                    if (masterCheck.isEmpty()) {
                        skipCount++;
                        if (skipCount <= 5) {
                            log.info("[RFC-004] SnopRecord 신규 생성 skip (기본자재마스터 미등록): item={}, month={}", itemCode, planMonth);
                        }
                        continue;
                    }
                    SnopRecord record = new SnopRecord();
                    record.setItemCode(itemCode);
                    record.setPlanMonth(planMonth);
                    record.setSalesActual(totalActual);
                    if (unit != null) record.setInventoryUnit(unit);
                    // 신규 생성 시 자재마스터에서 자재명/카테고리/생산라인 등 보충
                    enrichFromMaterialMaster(record, itemCode);
                    snopRecordRepo.save(record);
                    insertCount++;
                    log.debug("[RFC-004] INSERT: item_code={}, plan_month={}, sales_actual={}",
                            itemCode, planMonth, totalActual);
                }

            } catch (Exception e) {
                errors.add("합산 반영 오류 [" + entry.getKey() + "]: " + e.getMessage());
                errorCount++;
                log.error("[RFC-004] 합산 반영 오류 [{}]: {}", entry.getKey(), e.getMessage());
            }
        }

        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        saveHistory(rfcId, rfcName, executionType, startTime, endTime, durationMs,
                processedCount, errorCount, errors);

        log.info("[RFC-004] 판매실적 수신 완료: 처리={}, 합산={}개, 신규={}, 수정={}, skip(마스터미등록)={}, 에러={}",
                processedCount, actualSum.size(), insertCount, updateCount, skipCount, errorCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rfc_id", rfcId);
        result.put("status", errorCount == 0 ? "SUCCESS" : "PARTIAL_SUCCESS");
        result.put("total_received", dataList.size());
        result.put("processed_count", processedCount);
        result.put("aggregated_count", actualSum.size());
        result.put("insert_count", insertCount);
        result.put("update_count", updateCount);
        result.put("skip_count", skipCount);
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

        // 첫 번째 행의 변환된 필드명 로그 (디버깅용)
        if (!dataList.isEmpty()) {
            Map<String, Object> firstRow = dataList.get(0);
            log.info("[RFC-006] ★ 변환 후 필드명 (첫 번째 행): {}", firstRow.keySet());
            for (Map.Entry<String, Object> entry : firstRow.entrySet()) {
                Object val = entry.getValue();
                String valStr = (val != null) ? val.toString() : "null";
                if (valStr.length() > 100) valStr = valStr.substring(0, 100) + "...";
                log.info("[RFC-006]   {} = {} (type={})", entry.getKey(), valStr,
                        val != null ? val.getClass().getSimpleName() : "null");
            }
        }

        for (int i = 0; i < dataList.size(); i++) {
            Map<String, Object> row = dataList.get(i);
            try {
                // RFC의 item_code → S&OP의 legacy_item_code (기존 자재 코드)
                String itemCode = getStr(row, "item_code");
                String updateType = getStr(row, "new_update_type");
                if (updateType == null || updateType.isEmpty()) {
                    updateType = "1"; // 기본값: Insert
                }

                log.debug("[RFC-006] Row {}: item_code={}, new_update_type={}, item_code_1={}, is_active={}",
                        i + 1, itemCode, updateType,
                        getStr(row, "item_code_1"), getStr(row, "is_active"));

                if (itemCode == null || itemCode.isEmpty()) {
                    log.warn("[RFC-006] Row {}: item_code 누락 — 전체 필드: {}", i + 1, row);
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
        if (hasKey(row, "hierarchy_name")) entity.setHierarchyName(getStr(row, "hierarchy_name"));
        if (hasKey(row, "item_name")) entity.setLegacyItemName(getStr(row, "item_name"));

        // 리뉴얼 자재 세트 1~5 매핑
        if (hasKey(row, "item_code_1")) entity.setRenewalItemCode1(getStr(row, "item_code_1"));
        if (hasKey(row, "item_name_1")) entity.setRenewalItemName1(getStr(row, "item_name_1"));
        if (hasKey(row, "item_code_2")) entity.setRenewalItemCode2(getStr(row, "item_code_2"));
        if (hasKey(row, "item_name_2")) entity.setRenewalItemName2(getStr(row, "item_name_2"));
        if (hasKey(row, "item_code_3")) entity.setRenewalItemCode3(getStr(row, "item_code_3"));
        if (hasKey(row, "item_name_3")) entity.setRenewalItemName3(getStr(row, "item_name_3"));
        if (hasKey(row, "item_code_4")) entity.setRenewalItemCode4(getStr(row, "item_code_4"));
        if (hasKey(row, "item_name_4")) entity.setRenewalItemName4(getStr(row, "item_name_4"));
        if (hasKey(row, "item_code_5")) entity.setRenewalItemCode5(getStr(row, "item_code_5"));
        if (hasKey(row, "item_name_5")) entity.setRenewalItemName5(getStr(row, "item_name_5"));

        // is_active: 1=활성화, 2=비활성화
        if (hasKey(row, "is_active")) {
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
    /** 신규 SnopRecord 생성 시 자재마스터에서 자재명/카테고리 등 보충 */
    private void enrichFromMaterialMaster(SnopRecord record, String itemCode) {
        try {
            List<BaseMaterialMaster> masters = baseMaterialMasterRepo.findByItemCodeIgnoreCase(itemCode);
            if (!masters.isEmpty()) {
                BaseMaterialMaster master = masters.get(0);
                if (record.getItemName() == null && master.getItemName() != null) {
                    record.setItemName(master.getItemName());
                }
                if (record.getCategory() == null && master.getHierarchyName() != null) {
                    record.setCategory(master.getHierarchyName());
                }
                if (record.getVendorName() == null && master.getVendorName() != null) {
                    record.setVendorName(master.getVendorName());
                }
                if (record.getMoq() == null && master.getMoq() != null) {
                    record.setMoq(master.getMoq());
                }
                if (record.getProductionLine() == null && master.getProductionUnit() != null) {
                    record.setProductionLine(master.getProductionUnit());
                }
            }
        } catch (Exception e) {
            log.warn("[RFC] 자재마스터 조회 중 오류 (무시): {}", e.getMessage());
        }
    }

    private String convertPlanMonthDay(String planMonthDay) {
        if (planMonthDay == null || planMonthDay.isEmpty()) return null;
        String trimmed = planMonthDay.trim();
        // YYYYMM 형식 (SAP PLAN_MON — 6자리)
        if (trimmed.length() == 6 && !trimmed.contains("-") && !trimmed.contains("/")) {
            return trimmed.substring(0, 4) + "-" + trimmed.substring(4, 6);
        }
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
                if (hasKey(row, "item_name")) record.setItemName(getStr(row, "item_name"));
                if (hasKey(row, "hierarchy_name")) record.setHierarchyName(getStr(row, "hierarchy_name"));
                if (hasKey(row, "unit")) record.setUnit(getStr(row, "unit"));
                if (hasKey(row, "ending_inventory")) record.setEndingInventory(getLong(row, "ending_inventory"));
                if (hasKey(row, "production_actual")) record.setProductionActual(getLong(row, "production_actual"));
                if (hasKey(row, "sales_actual")) record.setSalesActual(getLong(row, "sales_actual"));
                if (hasKey(row, "notes")) record.setNotes(getStr(row, "notes"));

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

    /** Map에서 String 값 추출 (case-insensitive) */
    private String getStr(Map<String, Object> row, String key) {
        // 1차: 정확한 키 매칭
        Object val = row.get(key);
        if (val != null) return val.toString().trim();
        // 2차: 대소문자 무시 매칭 (SAP에서 대문자/소문자 혼용 대응)
        for (Map.Entry<String, Object> entry : row.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(key)) {
                return entry.getValue() != null ? entry.getValue().toString().trim() : null;
            }
        }
        return null;
    }

    /** Map에서 Double 값 추출 (case-insensitive) */
    private Double getDouble(Map<String, Object> row, String key) {
        Object val = getVal(row, key);
        if (val == null) return null;
        if (val instanceof Number) return ((Number) val).doubleValue();
        try {
            return Double.parseDouble(val.toString().trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /** Map에서 Long 값 추출 (case-insensitive) */
    private Long getLong(Map<String, Object> row, String key) {
        Object val = getVal(row, key);
        if (val == null) return null;
        if (val instanceof Number) return ((Number) val).longValue();
        try {
            String str = val.toString().trim();
            // 소수점이 포함된 문자열(예: "200.0")은 Double로 먼저 파싱 후 Long 변환
            if (str.contains(".")) {
                return (long) Double.parseDouble(str);
            }
            return Long.parseLong(str.replaceAll("[^\\d-]", ""));
        } catch (NumberFormatException e) {
            log.warn("[getLong] 숫자 변환 실패 — key={}, value={}", key, val);
            return null;
        }
    }

    /** Map에서 값 추출 (case-insensitive) — 모든 getXxx 메서드의 공통 기반 */
    private Object getVal(Map<String, Object> row, String key) {
        Object val = row.get(key);
        if (val != null) return val;
        for (Map.Entry<String, Object> entry : row.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(key)) {
                return entry.getValue();
            }
        }
        return null;
    }

    /** Map에 키가 존재하는지 확인 (case-insensitive) */
    private boolean hasKey(Map<String, Object> row, String key) {
        if (row.containsKey(key)) return true;
        for (String k : row.keySet()) {
            if (k.equalsIgnoreCase(key)) return true;
        }
        return false;
    }
}
