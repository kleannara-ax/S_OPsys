package com.company.module.sales.service;

import com.company.module.sales.dto.SalesPlanUploadDto;
import com.company.module.sales.entity.SalesPlanUpload;
import com.company.module.sales.repository.SalesPlanUploadRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class SalesPlanUploadService {

    private final SalesPlanUploadRepository repository;

    @Transactional(readOnly = true)
    public Page<SalesPlanUpload> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public SalesPlanUpload findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("판매계획 업로드를 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public java.util.List<SalesPlanUpload> findAllSorted() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public SalesPlanUpload create(SalesPlanUploadDto dto) {
        SalesPlanUpload entity = SalesPlanUpload.builder()
                .planMonth(dto.getPlanMonth())
                .itemCode(dto.getItemCode())
                .channel(dto.getChannel())
                .standardQuantity(dto.getStandardQuantity())
                .promotionQuantity(dto.getPromotionQuantity())
                .quantity(dto.getQuantity())
                .note(dto.getNote())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public SalesPlanUpload update(Long id, SalesPlanUploadDto dto) {
        SalesPlanUpload existing = findById(id);
        if (dto.getPlanMonth() != null) existing.setPlanMonth(dto.getPlanMonth());
        if (dto.getItemCode() != null) existing.setItemCode(dto.getItemCode());
        if (dto.getChannel() != null) existing.setChannel(dto.getChannel());
        if (dto.getStandardQuantity() != null) existing.setStandardQuantity(dto.getStandardQuantity());
        if (dto.getPromotionQuantity() != null) existing.setPromotionQuantity(dto.getPromotionQuantity());
        if (dto.getQuantity() != null) existing.setQuantity(dto.getQuantity());
        if (dto.getNote() != null) existing.setNote(dto.getNote());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("판매계획 업로드를 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
