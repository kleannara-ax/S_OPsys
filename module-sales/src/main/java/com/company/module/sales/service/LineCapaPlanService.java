package com.company.module.sales.service;

import com.company.module.sales.dto.LineCapaPlanDto;
import com.company.module.sales.entity.LineCapaPlan;
import com.company.module.sales.repository.LineCapaPlanRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class LineCapaPlanService {

    private final LineCapaPlanRepository repository;

    @Transactional(readOnly = true)
    public Page<LineCapaPlan> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public LineCapaPlan findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("라인 CAPA 계획을 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public java.util.List<LineCapaPlan> findAllSorted() {
        return repository.findAllByOrderByProductionLineAscPlanMonthAsc();
    }

    @Transactional
    public LineCapaPlan create(LineCapaPlanDto dto) {
        LineCapaPlan entity = LineCapaPlan.builder()
                .lineCategory(dto.getLineCategory())
                .productionLine(dto.getProductionLine())
                .planMonth(dto.getPlanMonth())
                .dailyCapa(dto.getDailyCapa())
                .dailyOperatingHours(dto.getDailyOperatingHours())
                .plannedOperatingDays(dto.getPlannedOperatingDays())
                .note(dto.getNote())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public LineCapaPlan update(Long id, LineCapaPlanDto dto) {
        LineCapaPlan existing = findById(id);
        if (dto.getLineCategory() != null) existing.setLineCategory(dto.getLineCategory());
        if (dto.getProductionLine() != null) existing.setProductionLine(dto.getProductionLine());
        if (dto.getPlanMonth() != null) existing.setPlanMonth(dto.getPlanMonth());
        if (dto.getDailyCapa() != null) existing.setDailyCapa(dto.getDailyCapa());
        if (dto.getDailyOperatingHours() != null) existing.setDailyOperatingHours(dto.getDailyOperatingHours());
        if (dto.getPlannedOperatingDays() != null) existing.setPlannedOperatingDays(dto.getPlannedOperatingDays());
        if (dto.getNote() != null) existing.setNote(dto.getNote());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("라인 CAPA 계획을 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
