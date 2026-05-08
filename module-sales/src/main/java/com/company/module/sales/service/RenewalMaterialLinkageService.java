package com.company.module.sales.service;

import com.company.module.sales.dto.RenewalMaterialLinkageDto;
import com.company.module.sales.entity.RenewalMaterialLinkage;
import com.company.module.sales.repository.RenewalMaterialLinkageRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RenewalMaterialLinkageService {

    private final RenewalMaterialLinkageRepository repository;

    @Transactional(readOnly = true)
    public Page<RenewalMaterialLinkage> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public RenewalMaterialLinkage findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("리뉴얼 자재 연결을 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public List<RenewalMaterialLinkage> findActive() {
        return repository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<RenewalMaterialLinkage> findByLegacyItemCode(String legacyItemCode) {
        return repository.findByLegacyItemCode(legacyItemCode);
    }

    @Transactional(readOnly = true)
    public List<RenewalMaterialLinkage> findByHierarchyName(String hierarchyName) {
        return repository.findByHierarchyName(hierarchyName);
    }

    @Transactional
    public RenewalMaterialLinkage create(RenewalMaterialLinkageDto dto) {
        RenewalMaterialLinkage entity = RenewalMaterialLinkage.builder()
                .hierarchyName(dto.getHierarchyName())
                .legacyItemCode(dto.getLegacyItemCode())
                .legacyItemName(dto.getLegacyItemName())
                .renewalItemCode1(dto.getRenewalItemCode1())
                .renewalItemName1(dto.getRenewalItemName1())
                .renewalItemCode2(dto.getRenewalItemCode2())
                .renewalItemName2(dto.getRenewalItemName2())
                .renewalItemCode3(dto.getRenewalItemCode3())
                .renewalItemName3(dto.getRenewalItemName3())
                .renewalItemCode4(dto.getRenewalItemCode4())
                .renewalItemName4(dto.getRenewalItemName4())
                .renewalItemCode5(dto.getRenewalItemCode5())
                .renewalItemName5(dto.getRenewalItemName5())
                .effectiveMonth(dto.getEffectiveMonth())
                .note(dto.getNote())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return repository.save(entity);
    }

    @Transactional
    public RenewalMaterialLinkage update(Long id, RenewalMaterialLinkageDto dto) {
        RenewalMaterialLinkage existing = findById(id);
        if (dto.getHierarchyName() != null) existing.setHierarchyName(dto.getHierarchyName());
        if (dto.getLegacyItemCode() != null) existing.setLegacyItemCode(dto.getLegacyItemCode());
        if (dto.getLegacyItemName() != null) existing.setLegacyItemName(dto.getLegacyItemName());
        if (dto.getRenewalItemCode1() != null) existing.setRenewalItemCode1(dto.getRenewalItemCode1());
        if (dto.getRenewalItemName1() != null) existing.setRenewalItemName1(dto.getRenewalItemName1());
        if (dto.getRenewalItemCode2() != null) existing.setRenewalItemCode2(dto.getRenewalItemCode2());
        if (dto.getRenewalItemName2() != null) existing.setRenewalItemName2(dto.getRenewalItemName2());
        if (dto.getRenewalItemCode3() != null) existing.setRenewalItemCode3(dto.getRenewalItemCode3());
        if (dto.getRenewalItemName3() != null) existing.setRenewalItemName3(dto.getRenewalItemName3());
        if (dto.getRenewalItemCode4() != null) existing.setRenewalItemCode4(dto.getRenewalItemCode4());
        if (dto.getRenewalItemName4() != null) existing.setRenewalItemName4(dto.getRenewalItemName4());
        if (dto.getRenewalItemCode5() != null) existing.setRenewalItemCode5(dto.getRenewalItemCode5());
        if (dto.getRenewalItemName5() != null) existing.setRenewalItemName5(dto.getRenewalItemName5());
        if (dto.getEffectiveMonth() != null) existing.setEffectiveMonth(dto.getEffectiveMonth());
        if (dto.getNote() != null) existing.setNote(dto.getNote());
        if (dto.getIsActive() != null) existing.setIsActive(dto.getIsActive());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("리뉴얼 자재 연결을 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
