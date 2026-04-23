package com.company.module.sales.service;

import com.company.module.sales.dto.MonthlyClosingDto;
import com.company.module.sales.entity.MonthlyClosing;
import com.company.module.sales.repository.MonthlyClosingRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MonthlyClosingService {

    private final MonthlyClosingRepository repository;

    @Transactional(readOnly = true)
    public Page<MonthlyClosing> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public MonthlyClosing findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("월마감 데이터를 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public List<MonthlyClosing> findByClosingMonth(String closingMonth) {
        return repository.findByClosingMonth(closingMonth);
    }

    @Transactional(readOnly = true)
    public List<MonthlyClosing> findByRange(String fromMonth, String toMonth) {
        return repository.findByClosingMonthBetween(fromMonth, toMonth);
    }

    @Transactional(readOnly = true)
    public List<String> findDistinctMonths() {
        return repository.findDistinctClosingMonths();
    }

    @Transactional
    public MonthlyClosing create(MonthlyClosingDto dto) {
        if (dto.getItemCode() != null && dto.getClosingMonth() != null) {
            if (repository.existsByItemCodeAndClosingMonth(dto.getItemCode(), dto.getClosingMonth())) {
                throw new IllegalArgumentException("이미 등록된 월마감 데이터입니다: " +
                        dto.getItemCode() + " / " + dto.getClosingMonth());
            }
        }
        MonthlyClosing entity = MonthlyClosing.builder()
                .itemCode(dto.getItemCode())
                .itemName(dto.getItemName())
                .hierarchyName(dto.getHierarchyName())
                .closingMonth(dto.getClosingMonth())
                .endingInventory(dto.getEndingInventory())
                .productionActual(dto.getProductionActual())
                .salesActual(dto.getSalesActual())
                .unit(dto.getUnit())
                .notes(dto.getNotes())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public MonthlyClosing update(Long id, MonthlyClosingDto dto) {
        MonthlyClosing existing = findById(id);
        if (dto.getItemCode() != null) existing.setItemCode(dto.getItemCode());
        if (dto.getItemName() != null) existing.setItemName(dto.getItemName());
        if (dto.getHierarchyName() != null) existing.setHierarchyName(dto.getHierarchyName());
        if (dto.getClosingMonth() != null) existing.setClosingMonth(dto.getClosingMonth());
        if (dto.getEndingInventory() != null) existing.setEndingInventory(dto.getEndingInventory());
        if (dto.getProductionActual() != null) existing.setProductionActual(dto.getProductionActual());
        if (dto.getSalesActual() != null) existing.setSalesActual(dto.getSalesActual());
        if (dto.getUnit() != null) existing.setUnit(dto.getUnit());
        if (dto.getNotes() != null) existing.setNotes(dto.getNotes());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public Map<String, Object> bulkUpsertByMonth(String closingMonth, List<MonthlyClosingDto> items) {
        int created = 0, updated = 0;
        for (MonthlyClosingDto dto : items) {
            Optional<MonthlyClosing> opt = repository.findByItemCodeAndClosingMonth(
                    dto.getItemCode(), closingMonth);
            if (opt.isPresent()) {
                MonthlyClosing mc = opt.get();
                if (dto.getEndingInventory() != null) mc.setEndingInventory(dto.getEndingInventory());
                if (dto.getProductionActual() != null) mc.setProductionActual(dto.getProductionActual());
                if (dto.getSalesActual() != null) mc.setSalesActual(dto.getSalesActual());
                repository.save(mc);
                updated++;
            } else {
                MonthlyClosing mc = MonthlyClosing.builder()
                        .itemCode(dto.getItemCode())
                        .itemName(dto.getItemName())
                        .hierarchyName(dto.getHierarchyName())
                        .closingMonth(closingMonth)
                        .endingInventory(dto.getEndingInventory())
                        .productionActual(dto.getProductionActual())
                        .salesActual(dto.getSalesActual())
                        .unit(dto.getUnit())
                        .notes(dto.getNotes())
                        .build();
                repository.save(mc);
                created++;
            }
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("created", created);
        result.put("updated", updated);
        result.put("total", items.size());
        return result;
    }
}
