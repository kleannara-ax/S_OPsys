package com.company.module.sales.service;

import com.company.module.sales.dto.SnopRecordDto;
import com.company.module.sales.entity.BaseMaterialMaster;
import com.company.module.sales.entity.SnopRecord;
import com.company.module.sales.repository.BaseMaterialMasterRepository;
import com.company.module.sales.repository.SnopRecordRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SnopRecordService {

    private final SnopRecordRepository repository;
    private final BaseMaterialMasterRepository baseMaterialMasterRepo;

    @Transactional(readOnly = true)
    public Page<SnopRecord> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public SnopRecord findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("S&OP 레코드를 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> checkDuplicate(String itemCode, String month) {
        String trimmedCode = itemCode != null ? itemCode.trim() : "";
        String trimmedMonth = month != null ? month.trim() : "";
        // case-insensitive 중복 검사 (Task 46)
        boolean exists = repository.existsByItemCodeIgnoreCaseAndPlanMonth(trimmedCode, trimmedMonth);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("duplicate", exists);
        result.put("item_code", trimmedCode);
        result.put("month", trimmedMonth);
        if (exists) {
            List<SnopRecord> existingList = repository.findByItemCodeIgnoreCaseAndPlanMonth(trimmedCode, trimmedMonth);
            if (!existingList.isEmpty()) {
                result.put("existing_id", existingList.get(0).getId());
            }
        }
        return result;
    }

    @Transactional
    public SnopRecord create(SnopRecordDto dto) {
        String itemCode = dto.getItemCode() != null ? dto.getItemCode().trim() : null;
        String planMonth = dto.getPlanMonth() != null ? dto.getPlanMonth().trim() : null;

        if (itemCode != null && planMonth != null && !itemCode.isEmpty() && !planMonth.isEmpty()) {
            // case-insensitive 중복 검사 (Task 46)
            if (repository.existsByItemCodeIgnoreCaseAndPlanMonth(itemCode, planMonth)) {
                List<SnopRecord> existingList = repository.findByItemCodeIgnoreCaseAndPlanMonth(itemCode, planMonth);
                Map<String, Object> err = new LinkedHashMap<>();
                err.put("item_code", itemCode);
                err.put("month", planMonth);
                if (!existingList.isEmpty()) {
                    err.put("existing_id", existingList.get(0).getId());
                }
                Long existingId = existingList.isEmpty() ? null : existingList.get(0).getId();
                throw new IllegalStateException("DUPLICATE:" + itemCode + ":" + planMonth +
                        (existingId != null ? ":" + existingId : ""));
            }
        }

        SnopRecord entity = SnopRecord.builder()
                .itemCode(itemCode)
                .itemName(dto.getItemName())
                .category(dto.getCategory())
                .productionLine(dto.getProductionLine())
                .plantCode(dto.getPlantCode())
                .vendorName(dto.getVendorName())
                .moq(dto.getMoq())
                .planMonth(planMonth)
                .salesPlan(dto.getSalesPlan())
                .salesActual(dto.getSalesActual())
                .productionPlan(dto.getProductionPlan())
                .productionActual(dto.getProductionActual())
                .productionRemaining(dto.getProductionRemaining())
                .beginningInventory(dto.getBeginningInventory())
                .availableInventory(dto.getAvailableInventory())
                .inventoryUnit(dto.getInventoryUnit())
                .targetEndingInventory(dto.getTargetEndingInventory())
                .optimalInventory(dto.getOptimalInventory())
                .capacityLimit(dto.getCapacityLimit())
                .manualInputQuantity(dto.getManualInputQuantity())
                .notes(dto.getNotes())
                .priority(dto.getPriority())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public SnopRecord update(Long id, SnopRecordDto dto) {
        SnopRecord existing = findById(id);
        if (dto.getItemCode() != null) existing.setItemCode(dto.getItemCode());
        if (dto.getItemName() != null) existing.setItemName(dto.getItemName());
        if (dto.getCategory() != null) existing.setCategory(dto.getCategory());
        if (dto.getProductionLine() != null) existing.setProductionLine(dto.getProductionLine());
        if (dto.getPlantCode() != null) existing.setPlantCode(dto.getPlantCode());
        if (dto.getVendorName() != null) existing.setVendorName(dto.getVendorName());
        if (dto.getMoq() != null) existing.setMoq(dto.getMoq());
        if (dto.getPlanMonth() != null) existing.setPlanMonth(dto.getPlanMonth());
        if (dto.getSalesPlan() != null) existing.setSalesPlan(dto.getSalesPlan());
        if (dto.getSalesActual() != null) existing.setSalesActual(dto.getSalesActual());
        if (dto.getProductionPlan() != null) existing.setProductionPlan(dto.getProductionPlan());
        if (dto.getProductionActual() != null) existing.setProductionActual(dto.getProductionActual());
        if (dto.getProductionRemaining() != null) existing.setProductionRemaining(dto.getProductionRemaining());
        if (dto.getBeginningInventory() != null) existing.setBeginningInventory(dto.getBeginningInventory());
        if (dto.getAvailableInventory() != null) existing.setAvailableInventory(dto.getAvailableInventory());
        if (dto.getInventoryUnit() != null) existing.setInventoryUnit(dto.getInventoryUnit());
        if (dto.getTargetEndingInventory() != null) existing.setTargetEndingInventory(dto.getTargetEndingInventory());
        if (dto.getOptimalInventory() != null) existing.setOptimalInventory(dto.getOptimalInventory());
        if (dto.getCapacityLimit() != null) existing.setCapacityLimit(dto.getCapacityLimit());
        if (dto.getManualInputQuantity() != null) existing.setManualInputQuantity(dto.getManualInputQuantity());
        if (dto.getNotes() != null) existing.setNotes(dto.getNotes());
        if (dto.getPriority() != null) existing.setPriority(dto.getPriority());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("S&OP 레코드를 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }

    /**
     * 기존 SnopRecord 중 item_name, category, production_line이 비어있는 레코드에
     * BaseMaterialMaster 정보를 일괄 보충한다.
     * RFC_002/004 등에서 SnopRecord를 자동 생성할 때 자재마스터 정보 없이
     * 생성된 기존 데이터를 보정하기 위한 1회성 API.
     */
    @Transactional
    public Map<String, Object> enrichAllFromMaterialMaster() {
        List<SnopRecord> allRecords = repository.findAll();
        int totalCount = allRecords.size();
        int enrichedCount = 0;
        int skippedCount = 0;
        int noMasterCount = 0;

        for (SnopRecord record : allRecords) {
            String itemCode = record.getItemCode();
            if (itemCode == null || itemCode.trim().isEmpty()) {
                skippedCount++;
                continue;
            }

            // item_name, category, production_line 중 하나라도 비어있으면 보충 대상
            boolean needsEnrich = isBlank(record.getItemName())
                    || isBlank(record.getCategory())
                    || isBlank(record.getProductionLine());

            if (!needsEnrich) {
                skippedCount++;
                continue;
            }

            try {
                List<BaseMaterialMaster> masters = baseMaterialMasterRepo.findByItemCodeIgnoreCase(itemCode.trim());
                if (masters.isEmpty()) {
                    noMasterCount++;
                    continue;
                }

                BaseMaterialMaster master = masters.get(0);
                boolean changed = false;

                if (isBlank(record.getItemName()) && master.getItemName() != null) {
                    record.setItemName(master.getItemName());
                    changed = true;
                }
                if (isBlank(record.getCategory()) && master.getHierarchyName() != null) {
                    record.setCategory(master.getHierarchyName());
                    changed = true;
                }
                if (isBlank(record.getProductionLine()) && master.getProductionUnit() != null) {
                    record.setProductionLine(master.getProductionUnit());
                    changed = true;
                }
                if (record.getVendorName() == null && master.getVendorName() != null) {
                    record.setVendorName(master.getVendorName());
                    changed = true;
                }
                if (record.getMoq() == null && master.getMoq() != null) {
                    record.setMoq(master.getMoq());
                    changed = true;
                }

                if (changed) {
                    repository.save(record);
                    enrichedCount++;
                } else {
                    skippedCount++;
                }
            } catch (Exception e) {
                log.warn("[enrich] item_code={} 보충 중 오류 (무시): {}", itemCode, e.getMessage());
            }
        }

        log.info("[enrich] SnopRecord 자재정보 일괄 보충 완료: 전체={}, 보충={}, 스킵={}, 자재마스터없음={}",
                totalCount, enrichedCount, skippedCount, noMasterCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total_count", totalCount);
        result.put("enriched_count", enrichedCount);
        result.put("skipped_count", skippedCount);
        result.put("no_master_count", noMasterCount);
        return result;
    }

    /**
     * SnopRecord 중복 정리 (Task 46)
     * 동일 item_code(대소문자 무시) + plan_month 조합에 레코드가 2건 이상인 경우,
     * 데이터가 더 풍부한(null이 아닌 필드가 많은) 레코드 1건을 남기고 나머지 병합 후 삭제.
     * @return 정리 결과 (검사 건수, 중복 그룹 수, 삭제 건수)
     */
    @Transactional
    public Map<String, Object> cleanupDuplicateRecords() {
        List<SnopRecord> allRecords = repository.findAll();
        int totalCount = allRecords.size();
        int duplicateGroupCount = 0;
        int deletedCount = 0;
        int mergedCount = 0;
        List<String> details = new ArrayList<>();

        // item_code(대문자) + plan_month 기준 그룹핑
        Map<String, List<SnopRecord>> grouped = new LinkedHashMap<>();
        for (SnopRecord record : allRecords) {
            String itemCode = record.getItemCode();
            String planMonth = record.getPlanMonth();
            if (itemCode == null || planMonth == null) continue;
            String key = itemCode.toUpperCase().trim() + "|" + planMonth.trim();
            grouped.computeIfAbsent(key, k -> new ArrayList<>()).add(record);
        }

        for (Map.Entry<String, List<SnopRecord>> entry : grouped.entrySet()) {
            List<SnopRecord> records = entry.getValue();
            if (records.size() <= 1) continue; // 중복 아님

            duplicateGroupCount++;
            String[] keyParts = entry.getKey().split("\\|", 2);
            String groupItemCode = keyParts[0];
            String groupPlanMonth = keyParts.length > 1 ? keyParts[1] : "";

            // 데이터 풍부도 기준으로 정렬 (null이 아닌 필드가 많은 순)
            records.sort((a, b) -> Integer.compare(countNonNullFields(b), countNonNullFields(a)));

            SnopRecord primary = records.get(0); // 가장 풍부한 레코드

            // 나머지 레코드의 데이터를 primary에 병합 (primary가 null인 필드만)
            for (int i = 1; i < records.size(); i++) {
                SnopRecord dup = records.get(i);
                mergeNonNullFields(primary, dup);
                repository.delete(dup);
                deletedCount++;
            }

            repository.save(primary);
            mergedCount++;

            details.add(String.format("%s / %s: %d건 중복 → 1건으로 병합 (삭제 %d건, 유지 ID=%d)",
                    groupItemCode, groupPlanMonth, records.size(), records.size() - 1, primary.getId()));

            log.info("[cleanup] {} / {}: {}건 중복 → 1건 유지(ID={}), {}건 삭제",
                    groupItemCode, groupPlanMonth, records.size(), primary.getId(), records.size() - 1);
        }

        log.info("[cleanup] SnopRecord 중복 정리 완료: 전체={}, 중복그룹={}, 삭제={}, 병합={}",
                totalCount, duplicateGroupCount, deletedCount, mergedCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total_count", totalCount);
        result.put("duplicate_group_count", duplicateGroupCount);
        result.put("deleted_count", deletedCount);
        result.put("merged_count", mergedCount);
        result.put("details", details);
        return result;
    }

    /** 레코드의 null이 아닌 주요 필드 개수 세기 (풍부도 판단) */
    private int countNonNullFields(SnopRecord r) {
        int count = 0;
        if (r.getItemName() != null && !r.getItemName().trim().isEmpty()) count++;
        if (r.getCategory() != null && !r.getCategory().trim().isEmpty()) count++;
        if (r.getProductionLine() != null && !r.getProductionLine().trim().isEmpty()) count++;
        if (r.getPlantCode() != null && !r.getPlantCode().trim().isEmpty()) count++;
        if (r.getVendorName() != null && !r.getVendorName().trim().isEmpty()) count++;
        if (r.getMoq() != null) count++;
        if (r.getSalesPlan() != null) count++;
        if (r.getSalesActual() != null) count++;
        if (r.getProductionPlan() != null) count++;
        if (r.getProductionActual() != null) count++;
        if (r.getProductionRemaining() != null) count++;
        if (r.getBeginningInventory() != null) count++;
        if (r.getAvailableInventory() != null) count++;
        if (r.getTargetEndingInventory() != null) count++;
        if (r.getOptimalInventory() != null) count++;
        if (r.getCapacityLimit() != null) count++;
        if (r.getManualInputQuantity() != null) count++;
        if (r.getNotes() != null && !r.getNotes().trim().isEmpty()) count++;
        if (r.getPriority() != null) count++;
        return count;
    }

    /** dup 레코드의 non-null 필드를 primary의 null 필드에 병합 */
    private void mergeNonNullFields(SnopRecord primary, SnopRecord dup) {
        if (isBlank(primary.getItemName()) && !isBlank(dup.getItemName())) primary.setItemName(dup.getItemName());
        if (isBlank(primary.getCategory()) && !isBlank(dup.getCategory())) primary.setCategory(dup.getCategory());
        if (isBlank(primary.getProductionLine()) && !isBlank(dup.getProductionLine())) primary.setProductionLine(dup.getProductionLine());
        if (isBlank(primary.getPlantCode()) && !isBlank(dup.getPlantCode())) primary.setPlantCode(dup.getPlantCode());
        if (isBlank(primary.getVendorName()) && !isBlank(dup.getVendorName())) primary.setVendorName(dup.getVendorName());
        if (primary.getMoq() == null && dup.getMoq() != null) primary.setMoq(dup.getMoq());
        if (primary.getSalesPlan() == null && dup.getSalesPlan() != null) primary.setSalesPlan(dup.getSalesPlan());
        if (primary.getSalesActual() == null && dup.getSalesActual() != null) primary.setSalesActual(dup.getSalesActual());
        if (primary.getProductionPlan() == null && dup.getProductionPlan() != null) primary.setProductionPlan(dup.getProductionPlan());
        if (primary.getProductionActual() == null && dup.getProductionActual() != null) primary.setProductionActual(dup.getProductionActual());
        if (primary.getProductionRemaining() == null && dup.getProductionRemaining() != null) primary.setProductionRemaining(dup.getProductionRemaining());
        if (primary.getBeginningInventory() == null && dup.getBeginningInventory() != null) primary.setBeginningInventory(dup.getBeginningInventory());
        if (primary.getAvailableInventory() == null && dup.getAvailableInventory() != null) primary.setAvailableInventory(dup.getAvailableInventory());
        if (isBlank(primary.getInventoryUnit()) && !isBlank(dup.getInventoryUnit())) primary.setInventoryUnit(dup.getInventoryUnit());
        if (primary.getTargetEndingInventory() == null && dup.getTargetEndingInventory() != null) primary.setTargetEndingInventory(dup.getTargetEndingInventory());
        if (primary.getOptimalInventory() == null && dup.getOptimalInventory() != null) primary.setOptimalInventory(dup.getOptimalInventory());
        if (primary.getCapacityLimit() == null && dup.getCapacityLimit() != null) primary.setCapacityLimit(dup.getCapacityLimit());
        if (primary.getManualInputQuantity() == null && dup.getManualInputQuantity() != null) primary.setManualInputQuantity(dup.getManualInputQuantity());
        if (isBlank(primary.getNotes()) && !isBlank(dup.getNotes())) primary.setNotes(dup.getNotes());
        if (primary.getPriority() == null && dup.getPriority() != null) primary.setPriority(dup.getPriority());
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
