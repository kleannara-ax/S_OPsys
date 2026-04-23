package com.company.module.sales.service;

import com.company.module.sales.dto.SnopRecordDto;
import com.company.module.sales.entity.SnopRecord;
import com.company.module.sales.repository.SnopRecordRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SnopRecordService {

    private final SnopRecordRepository repository;

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
}
