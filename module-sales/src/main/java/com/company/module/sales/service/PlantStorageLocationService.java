package com.company.module.sales.service;

import com.company.module.sales.dto.PlantStorageLocationDto;
import com.company.module.sales.entity.PlantStorageLocation;
import com.company.module.sales.repository.PlantStorageLocationRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlantStorageLocationService {

    private final PlantStorageLocationRepository repository;

    @Transactional(readOnly = true)
    public Page<PlantStorageLocation> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<PlantStorageLocation> findAllSorted() {
        return repository.findAllByOrderByPlantCodeAscStorageLocationAsc();
    }

    @Transactional(readOnly = true)
    public PlantStorageLocation findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("플랜트 저장위치를 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public List<PlantStorageLocation> findByPlantCode(String plantCode) {
        return repository.findByPlantCodeOrderByStorageLocationAsc(plantCode);
    }

    @Transactional(readOnly = true)
    public List<PlantStorageLocation> findSelected() {
        return repository.findByIsSelectedTrue();
    }

    @Transactional
    public PlantStorageLocation create(PlantStorageLocationDto dto) {
        // 중복 검사: 동일 plant_code + storage_location + plan_month=null(seed) 이미 존재하면 등록 거부
        if (dto.getPlanMonth() == null || dto.getPlanMonth().isEmpty()) {
            List<PlantStorageLocation> existing =
                    repository.findByPlantCodeAndStorageLocationAndPlanMonthIsNull(
                            dto.getPlantCode(), dto.getStorageLocation());
            if (!existing.isEmpty()) {
                throw new IllegalArgumentException(
                        "이미 등록된 저장위치입니다: " + dto.getPlantCode() + " / " + dto.getStorageLocation());
            }
        }

        PlantStorageLocation entity = PlantStorageLocation.builder()
                .planMonth(dto.getPlanMonth())
                .itemCode(dto.getItemCode())
                .plantCode(dto.getPlantCode())
                .plantName(dto.getPlantName())
                .storageLocation(dto.getStorageLocation())
                .isSelected(dto.getIsSelected() != null ? dto.getIsSelected() : false)
                .stockUnit(dto.getStockUnit())
                .beginningInventory(dto.getBeginningInventory())
                .availableInventory(dto.getAvailableInventory())
                .availableStock(dto.getAvailableStock())
                .currentStock(dto.getCurrentStock())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public PlantStorageLocation update(Long id, PlantStorageLocationDto dto) {
        PlantStorageLocation existing = findById(id);
        if (dto.getPlanMonth() != null) existing.setPlanMonth(dto.getPlanMonth());
        if (dto.getItemCode() != null) existing.setItemCode(dto.getItemCode());
        if (dto.getPlantCode() != null) existing.setPlantCode(dto.getPlantCode());
        if (dto.getPlantName() != null) existing.setPlantName(dto.getPlantName());
        if (dto.getStorageLocation() != null) existing.setStorageLocation(dto.getStorageLocation());
        if (dto.getIsSelected() != null) existing.setIsSelected(dto.getIsSelected());
        if (dto.getStockUnit() != null) existing.setStockUnit(dto.getStockUnit());
        if (dto.getBeginningInventory() != null) existing.setBeginningInventory(dto.getBeginningInventory());
        if (dto.getAvailableInventory() != null) existing.setAvailableInventory(dto.getAvailableInventory());
        if (dto.getAvailableStock() != null) existing.setAvailableStock(dto.getAvailableStock());
        if (dto.getCurrentStock() != null) existing.setCurrentStock(dto.getCurrentStock());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("플랜트 저장위치를 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public PlantStorageLocation toggleSelected(Long id) {
        PlantStorageLocation existing = findById(id);
        existing.setIsSelected(!Boolean.TRUE.equals(existing.getIsSelected()));
        return repository.save(existing);
    }

    /**
     * DB 중복 seed 데이터 정리
     * 동일 plant_code + storage_location + plan_month=null 조합이 여러 건이면
     * 첫 번째(is_selected=true 우선)만 남기고 나머지 삭제
     */
    @Transactional
    public int cleanupDuplicateSeeds() {
        List<PlantStorageLocation> allSeeds =
                repository.findByPlanMonthIsNullOrderByPlantCodeAscStorageLocationAsc();

        // plant_code + storage_location 기준으로 그룹핑
        Map<String, List<PlantStorageLocation>> grouped = allSeeds.stream()
                .collect(Collectors.groupingBy(
                        psl -> psl.getPlantCode() + "|" + psl.getStorageLocation(),
                        LinkedHashMap::new,
                        Collectors.toList()));

        int deletedCount = 0;
        for (Map.Entry<String, List<PlantStorageLocation>> entry : grouped.entrySet()) {
            List<PlantStorageLocation> duplicates = entry.getValue();
            if (duplicates.size() <= 1) continue;

            // is_selected=true인 것을 우선 보존, 그 다음 id가 작은 것(원본 seed) 보존
            duplicates.sort((a, b) -> {
                // is_selected=true 우선
                boolean aSelected = Boolean.TRUE.equals(a.getIsSelected());
                boolean bSelected = Boolean.TRUE.equals(b.getIsSelected());
                if (aSelected != bSelected) return aSelected ? -1 : 1;
                // id 작은 것(원본) 우선
                return Long.compare(a.getId(), b.getId());
            });

            // 첫 번째만 남기고 나머지 삭제
            for (int i = 1; i < duplicates.size(); i++) {
                PlantStorageLocation dup = duplicates.get(i);
                log.info("[Cleanup] 중복 seed 삭제: id={}, plant={}, storage={}",
                        dup.getId(), dup.getPlantCode(), dup.getStorageLocation());
                repository.delete(dup);
                deletedCount++;
            }
        }

        log.info("[Cleanup] 중복 seed 정리 완료: {}건 삭제", deletedCount);
        return deletedCount;
    }
}
