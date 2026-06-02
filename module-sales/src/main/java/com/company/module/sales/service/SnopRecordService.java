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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        boolean exists = repository.existsByItemCodeAndPlanMonth(trimmedCode, trimmedMonth);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("duplicate", exists);
        result.put("item_code", trimmedCode);
        result.put("month", trimmedMonth);
        if (exists) {
            repository.findFirstByItemCodeAndPlanMonth(trimmedCode, trimmedMonth)
                    .ifPresent(r -> result.put("existing_id", r.getId()));
        }
        return result;
    }

    @Transactional
    public SnopRecord create(SnopRecordDto dto) {
        String itemCode = dto.getItemCode() != null ? dto.getItemCode().trim() : null;
        String planMonth = dto.getPlanMonth() != null ? dto.getPlanMonth().trim() : null;

        if (itemCode != null && planMonth != null && !itemCode.isEmpty() && !planMonth.isEmpty()) {
            if (repository.existsByItemCodeAndPlanMonth(itemCode, planMonth)) {
                Optional<SnopRecord> existing = repository.findFirstByItemCodeAndPlanMonth(itemCode, planMonth);
                Map<String, Object> err = new LinkedHashMap<>();
                err.put("item_code", itemCode);
                err.put("month", planMonth);
                existing.ifPresent(r -> err.put("existing_id", r.getId()));
                throw new IllegalStateException("DUPLICATE:" + itemCode + ":" + planMonth +
                        (existing.map(r -> ":" + r.getId()).orElse("")));
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
     * 자재마스터 기준으로 SnopRecord의 카테고리/자재명/생산라인 등을 강제 동기화.
     * enrichAllFromMaterialMaster()와 달리, 기존 값이 있어도 마스터 값으로 덮어씀.
     */
    @Transactional
    public Map<String, Object> syncAllFromMaterialMaster() {
        List<SnopRecord> allRecords = repository.findAll();
        int totalCount = allRecords.size();
        int syncedCount = 0;
        int skippedCount = 0;
        int noMasterCount = 0;

        for (SnopRecord record : allRecords) {
            String itemCode = record.getItemCode();
            if (itemCode == null || itemCode.trim().isEmpty()) {
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

                // 마스터 값이 존재하면 무조건 덮어쓰기
                if (master.getHierarchyName() != null && !master.getHierarchyName().trim().isEmpty()) {
                    if (!master.getHierarchyName().equals(record.getCategory())) {
                        record.setCategory(master.getHierarchyName());
                        changed = true;
                    }
                }
                if (master.getItemName() != null && !master.getItemName().trim().isEmpty()) {
                    if (!master.getItemName().equals(record.getItemName())) {
                        record.setItemName(master.getItemName());
                        changed = true;
                    }
                }
                if (master.getProductionUnit() != null && !master.getProductionUnit().trim().isEmpty()) {
                    if (!master.getProductionUnit().equals(record.getProductionLine())) {
                        record.setProductionLine(master.getProductionUnit());
                        changed = true;
                    }
                }
                if (master.getVendorName() != null) {
                    if (!master.getVendorName().equals(record.getVendorName())) {
                        record.setVendorName(master.getVendorName());
                        changed = true;
                    }
                }
                if (master.getMoq() != null) {
                    if (!master.getMoq().equals(record.getMoq())) {
                        record.setMoq(master.getMoq());
                        changed = true;
                    }
                }

                if (changed) {
                    repository.save(record);
                    syncedCount++;
                } else {
                    skippedCount++;
                }
            } catch (Exception e) {
                log.warn("[sync] item_code={} 동기화 중 오류 (무시): {}", itemCode, e.getMessage());
            }
        }

        log.info("[sync] SnopRecord 자재정보 동기화 완료: 전체={}, 동기화={}, 변경없음={}, 자재마스터없음={}",
                totalCount, syncedCount, skippedCount, noMasterCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total_count", totalCount);
        result.put("synced_count", syncedCount);
        result.put("skipped_count", skippedCount);
        result.put("no_master_count", noMasterCount);
        return result;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
