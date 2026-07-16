package com.company.module.sales.service;

import com.company.module.sales.dto.MonthlySalesRecordDto;
import com.company.module.sales.entity.MonthlySalesRecord;
import com.company.module.sales.entity.MonthlyClosing;
import com.company.module.sales.repository.MonthlySalesRecordRepository;
import com.company.module.sales.repository.MonthlyClosingRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MonthlySalesRecordService {

    private final MonthlySalesRecordRepository repository;
    private final MonthlyClosingRepository monthlyClosingRepository;

    @Transactional(readOnly = true)
    public List<MonthlySalesRecord> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public MonthlySalesRecord findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("월별 판매실적을 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public List<MonthlySalesRecord> findByClosingMonth(String closingMonth) {
        return repository.findByClosingMonth(closingMonth);
    }

    @Transactional(readOnly = true)
    public List<MonthlySalesRecord> findByRange(String fromMonth, String toMonth) {
        return repository.findByClosingMonthBetween(fromMonth, toMonth);
    }

    @Transactional(readOnly = true)
    public List<String> findDistinctMonths() {
        return repository.findDistinctClosingMonths();
    }

    @Transactional
    public MonthlySalesRecord create(MonthlySalesRecordDto dto) {
        if (dto.getItemCode() != null && dto.getClosingMonth() != null) {
            if (repository.existsByItemCodeAndClosingMonth(dto.getItemCode(), dto.getClosingMonth())) {
                throw new IllegalArgumentException("이미 등록된 월별 판매실적입니다: " +
                        dto.getItemCode() + " / " + dto.getClosingMonth());
            }
        }
        MonthlySalesRecord entity = MonthlySalesRecord.builder()
                .itemCode(dto.getItemCode())
                .itemName(dto.getItemName())
                .hierarchyName(dto.getHierarchyName())
                .closingMonth(dto.getClosingMonth())
                .salesActual(dto.getSalesActual())
                .unit(dto.getUnit())
                .source(dto.getSource())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public MonthlySalesRecord update(Long id, MonthlySalesRecordDto dto) {
        MonthlySalesRecord existing = findById(id);
        if (dto.getItemCode() != null) existing.setItemCode(dto.getItemCode());
        if (dto.getItemName() != null) existing.setItemName(dto.getItemName());
        if (dto.getHierarchyName() != null) existing.setHierarchyName(dto.getHierarchyName());
        if (dto.getClosingMonth() != null) existing.setClosingMonth(dto.getClosingMonth());
        if (dto.getSalesActual() != null) existing.setSalesActual(dto.getSalesActual());
        if (dto.getUnit() != null) existing.setUnit(dto.getUnit());
        if (dto.getSource() != null) existing.setSource(dto.getSource());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    /**
     * 엑셀 업로드용 bulk upsert — item_code + closingMonth 기준 upsert, source='UPLOAD'
     */
    @Transactional
    public Map<String, Object> bulkUpsertByMonth(String closingMonth, List<MonthlySalesRecordDto> items) {
        int created = 0, updated = 0;
        for (MonthlySalesRecordDto dto : items) {
            Optional<MonthlySalesRecord> opt = repository.findByItemCodeAndClosingMonth(
                    dto.getItemCode(), closingMonth);
            if (opt.isPresent()) {
                MonthlySalesRecord rec = opt.get();
                if (dto.getSalesActual() != null) rec.setSalesActual(dto.getSalesActual());
                if (dto.getItemName() != null) rec.setItemName(dto.getItemName());
                if (dto.getHierarchyName() != null) rec.setHierarchyName(dto.getHierarchyName());
                if (dto.getUnit() != null) rec.setUnit(dto.getUnit());
                rec.setSource("UPLOAD");
                repository.save(rec);
                updated++;
            } else {
                MonthlySalesRecord rec = MonthlySalesRecord.builder()
                        .itemCode(dto.getItemCode())
                        .itemName(dto.getItemName())
                        .hierarchyName(dto.getHierarchyName())
                        .closingMonth(closingMonth)
                        .salesActual(dto.getSalesActual())
                        .unit(dto.getUnit() != null ? dto.getUnit() : "BOX")
                        .source("UPLOAD")
                        .build();
                repository.save(rec);
                created++;
            }
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("created", created);
        result.put("updated", updated);
        result.put("total", items.size());
        return result;
    }

    /**
     * MonthlyClosing(RFC005) → MonthlySalesRecord 동기화
     * closing_month 기준으로 monthly_closing의 sales_actual을 가져와 upsert, source='RFC005'
     */
    @Transactional
    public Map<String, Object> syncFromMonthlyClosing(String closingMonth) {
        List<MonthlyClosing> closings = monthlyClosingRepository.findByClosingMonth(closingMonth);
        int created = 0, updated = 0, skipped = 0;

        for (MonthlyClosing mc : closings) {
            if (mc.getItemCode() == null || mc.getSalesActual() == null) {
                skipped++;
                continue;
            }

            Optional<MonthlySalesRecord> opt = repository.findByItemCodeAndClosingMonth(
                    mc.getItemCode(), closingMonth);
            if (opt.isPresent()) {
                MonthlySalesRecord rec = opt.get();
                rec.setSalesActual(mc.getSalesActual());
                rec.setItemName(mc.getItemName());
                rec.setHierarchyName(mc.getHierarchyName());
                rec.setUnit(mc.getUnit());
                rec.setSource("RFC005");
                repository.save(rec);
                updated++;
            } else {
                MonthlySalesRecord rec = MonthlySalesRecord.builder()
                        .itemCode(mc.getItemCode())
                        .itemName(mc.getItemName())
                        .hierarchyName(mc.getHierarchyName())
                        .closingMonth(closingMonth)
                        .salesActual(mc.getSalesActual())
                        .unit(mc.getUnit() != null ? mc.getUnit() : "BOX")
                        .source("RFC005")
                        .build();
                repository.save(rec);
                created++;
            }
        }

        log.info("[MonthlySalesRecord] syncFromMonthlyClosing {} — created: {}, updated: {}, skipped: {}",
                closingMonth, created, updated, skipped);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("closingMonth", closingMonth);
        result.put("created", created);
        result.put("updated", updated);
        result.put("skipped", skipped);
        result.put("total", closings.size());
        return result;
    }

    /**
     * MonthlyClosing(RFC005)의 모든 고유 closing_month에 대해 일괄 동기화
     */
    @Transactional
    public List<Map<String, Object>> syncAllFromMonthlyClosing() {
        List<String> months = monthlyClosingRepository.findDistinctClosingMonths();
        List<Map<String, Object>> results = new ArrayList<>();
        for (String month : months) {
            results.add(syncFromMonthlyClosing(month));
        }
        log.info("[MonthlySalesRecord] syncAllFromMonthlyClosing — {} months processed", months.size());
        return results;
    }

}
