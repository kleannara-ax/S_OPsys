package com.company.module.sales.service;

import com.company.module.sales.dto.MaterialLinkageDto;
import com.company.module.sales.entity.MaterialLinkage;
import com.company.module.sales.repository.MaterialLinkageRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class MaterialLinkageService {

    private final MaterialLinkageRepository repository;

    @Transactional(readOnly = true)
    public Page<MaterialLinkage> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public MaterialLinkage findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("자재 연결 정보를 찾을 수 없습니다: " + id));
    }


    @Transactional
    public MaterialLinkage create(MaterialLinkageDto dto) {
        MaterialLinkage entity = MaterialLinkage.builder()
                .legacyItemCode(dto.getLegacyItemCode())
                .legacyItemName(dto.getLegacyItemName())
                .renewalItemCode(dto.getRenewalItemCode())
                .renewalItemName(dto.getRenewalItemName())
                .effectiveMonth(dto.getEffectiveMonth())
                .note(dto.getNote())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public MaterialLinkage update(Long id, MaterialLinkageDto dto) {
        MaterialLinkage existing = findById(id);
        if (dto.getLegacyItemCode() != null) existing.setLegacyItemCode(dto.getLegacyItemCode());
        if (dto.getLegacyItemName() != null) existing.setLegacyItemName(dto.getLegacyItemName());
        if (dto.getRenewalItemCode() != null) existing.setRenewalItemCode(dto.getRenewalItemCode());
        if (dto.getRenewalItemName() != null) existing.setRenewalItemName(dto.getRenewalItemName());
        if (dto.getEffectiveMonth() != null) existing.setEffectiveMonth(dto.getEffectiveMonth());
        if (dto.getNote() != null) existing.setNote(dto.getNote());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("자재 연결 정보를 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
