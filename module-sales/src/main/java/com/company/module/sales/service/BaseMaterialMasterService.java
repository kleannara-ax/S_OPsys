package com.company.module.sales.service;

import com.company.module.sales.dto.BaseMaterialMasterDto;
import com.company.module.sales.entity.BaseMaterialMaster;
import com.company.module.sales.repository.BaseMaterialMasterRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class BaseMaterialMasterService {

    private final BaseMaterialMasterRepository repository;

    @Transactional(readOnly = true)
    public Page<BaseMaterialMaster> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<BaseMaterialMaster> findAllSorted() {
        List<BaseMaterialMaster> all = repository.findAll();
        all.sort(Comparator.comparing(
            (BaseMaterialMaster m) -> m.getScmArea() != null ? m.getScmArea() : "",
            String::compareToIgnoreCase
        ).thenComparing(
            m -> m.getItemCode() != null ? m.getItemCode() : "",
            String::compareToIgnoreCase
        ));
        return all;
    }

    @Transactional(readOnly = true)
    public BaseMaterialMaster findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("자재 마스터를 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getFilterOptions() {
        Map<String, Object> options = new LinkedHashMap<>();
        options.put("scm_areas", repository.findDistinctScmAreas());
        return options;
    }

    @Transactional
    public BaseMaterialMaster create(BaseMaterialMasterDto dto) {
        BaseMaterialMaster entity = BaseMaterialMaster.builder()
                .scmArea(dto.getScmArea())
                .hierarchyName(dto.getHierarchyName())
                .productionUnit(dto.getProductionUnit())
                .itemCode(dto.getItemCode())
                .itemName(dto.getItemName())
                .conversion1(dto.getConversion1())
                .conversion2(dto.getConversion2())
                .conversion3(dto.getConversion3())
                .conversion5(dto.getConversion5())
                .vendorName(dto.getVendorName())
                .moq(dto.getMoq())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public BaseMaterialMaster update(Long id, BaseMaterialMasterDto dto) {
        BaseMaterialMaster existing = findById(id);
        if (dto.getScmArea() != null) existing.setScmArea(dto.getScmArea());
        if (dto.getHierarchyName() != null) existing.setHierarchyName(dto.getHierarchyName());
        if (dto.getProductionUnit() != null) existing.setProductionUnit(dto.getProductionUnit());
        if (dto.getItemCode() != null) existing.setItemCode(dto.getItemCode());
        if (dto.getItemName() != null) existing.setItemName(dto.getItemName());
        if (dto.getConversion1() != null) existing.setConversion1(dto.getConversion1());
        if (dto.getConversion2() != null) existing.setConversion2(dto.getConversion2());
        if (dto.getConversion3() != null) existing.setConversion3(dto.getConversion3());
        if (dto.getConversion5() != null) existing.setConversion5(dto.getConversion5());
        if (dto.getVendorName() != null) existing.setVendorName(dto.getVendorName());
        if (dto.getMoq() != null) existing.setMoq(dto.getMoq());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public Map<String, Object> bulkUpdateOemVendorMoq(List<Map<String, Object>> items) {
        int updated = 0, skipped = 0, notFound = 0;
        List<Map<String, String>> errors = new ArrayList<>();

        for (Map<String, Object> item : items) {
            String itemCode = item.get("item_code") != null ? item.get("item_code").toString().trim() : "";
            if (itemCode.isEmpty()) {
                skipped++;
                errors.add(Map.of("item_code", "", "reason", "item_code 누락"));
                continue;
            }
            List<BaseMaterialMaster> masters = repository.findByItemCode(itemCode);
            if (masters.isEmpty()) {
                notFound++;
                errors.add(Map.of("item_code", itemCode, "reason", "자재코드를 찾을 수 없음"));
                continue;
            }
            for (BaseMaterialMaster master : masters) {
                String prodUnit = master.getProductionUnit();
                if (prodUnit == null || !prodUnit.toUpperCase().contains("OEM")) {
                    skipped++;
                    errors.add(Map.of("item_code", itemCode, "reason", "OEM 상품이 아닙니다 (생산라인: " + prodUnit + ")"));
                    continue;
                }
                if (item.get("vendor_name") != null) {
                    master.setVendorName(item.get("vendor_name").toString().trim());
                }
                if (item.get("moq") != null) {
                    try {
                        String moqStr = item.get("moq").toString().trim().replaceAll("[^\\d]", "");
                        if (!moqStr.isEmpty()) master.setMoq(Long.parseLong(moqStr));
                    } catch (NumberFormatException ignored) {}
                }
                repository.save(master);
                updated++;
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("updated", updated);
        result.put("skipped", skipped);
        result.put("not_found", notFound);
        result.put("total", items.size());
        if (!errors.isEmpty()) result.put("errors", errors.subList(0, Math.min(errors.size(), 10)));
        return result;
    }
}
