package com.company.module.sales.service;

import com.company.module.sales.dto.PlantStorageLocationDto;
import com.company.module.sales.entity.PlantStorageLocation;
import com.company.module.sales.repository.PlantStorageLocationRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
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
}
