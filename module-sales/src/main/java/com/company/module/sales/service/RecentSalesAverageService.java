package com.company.module.sales.service;

import com.company.module.sales.dto.RecentSalesAverageDto;
import com.company.module.sales.entity.RecentSalesAverage;
import com.company.module.sales.repository.RecentSalesAverageRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class RecentSalesAverageService {

    private final RecentSalesAverageRepository repository;

    @Transactional(readOnly = true)
    public Page<RecentSalesAverage> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public RecentSalesAverage findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("최근판매평균을 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public java.util.List<RecentSalesAverage> findAllSorted() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public RecentSalesAverage create(RecentSalesAverageDto dto) {
        RecentSalesAverage entity = RecentSalesAverage.builder()
                .baseMonth(dto.getBaseMonth())
                .itemCode(dto.getItemCode())
                .m3(dto.getM3())
                .m2(dto.getM2())
                .m1(dto.getM1())
                .note(dto.getNote())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public RecentSalesAverage update(Long id, RecentSalesAverageDto dto) {
        RecentSalesAverage existing = findById(id);
        if (dto.getBaseMonth() != null) existing.setBaseMonth(dto.getBaseMonth());
        if (dto.getItemCode() != null) existing.setItemCode(dto.getItemCode());
        if (dto.getM3() != null) existing.setM3(dto.getM3());
        if (dto.getM2() != null) existing.setM2(dto.getM2());
        if (dto.getM1() != null) existing.setM1(dto.getM1());
        if (dto.getNote() != null) existing.setNote(dto.getNote());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("최근판매평균을 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
