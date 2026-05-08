package com.company.module.sales.service;

import com.company.module.sales.dto.OptimalInventoryBaselineDto;
import com.company.module.sales.entity.OptimalInventoryBaseline;
import com.company.module.sales.repository.OptimalInventoryBaselineRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class OptimalInventoryBaselineService {

    private final OptimalInventoryBaselineRepository repository;

    @Transactional(readOnly = true)
    public Page<OptimalInventoryBaseline> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public OptimalInventoryBaseline findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("적정재고 기준을 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public java.util.List<OptimalInventoryBaseline> findAllSorted() {
        return repository.findAllByOrderByBaseYearAscCategoryAsc();
    }

    @Transactional
    public OptimalInventoryBaseline create(OptimalInventoryBaselineDto dto) {
        OptimalInventoryBaseline entity = OptimalInventoryBaseline.builder()
                .baseYear(dto.getBaseYear())
                .category(dto.getCategory())
                .optimalQuantity(dto.getOptimalQuantity())
                .notes(dto.getNotes())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public OptimalInventoryBaseline update(Long id, OptimalInventoryBaselineDto dto) {
        OptimalInventoryBaseline existing = findById(id);
        if (dto.getBaseYear() != null) existing.setBaseYear(dto.getBaseYear());
        if (dto.getCategory() != null) existing.setCategory(dto.getCategory());
        if (dto.getOptimalQuantity() != null) existing.setOptimalQuantity(dto.getOptimalQuantity());
        if (dto.getNotes() != null) existing.setNotes(dto.getNotes());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("적정재고 기준을 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
