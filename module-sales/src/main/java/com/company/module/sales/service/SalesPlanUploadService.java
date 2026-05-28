package com.company.module.sales.service;

import com.company.module.sales.dto.SalesPlanUploadDto;
import com.company.module.sales.entity.SalesPlanUpload;
import com.company.module.sales.repository.SalesPlanUploadRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Slf4j
public class SalesPlanUploadService {

    private final SalesPlanUploadRepository repository;
    private final SalesPlanSyncService salesPlanSyncService;

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
        SalesPlanUpload saved = repository.save(entity);

        // SnopRecord 동기화 (같은 월+코드 SUM → salesPlan 반영)
        syncAfterMutation(saved.getPlanMonth(), saved.getItemCode());

        return saved;
    }

    @Transactional
    public SalesPlanUpload update(Long id, SalesPlanUploadDto dto) {
        SalesPlanUpload existing = findById(id);

        // 변경 전 월+코드 기억 (월이나 코드가 바뀌면 이전 조합도 동기화 필요)
        String oldMonth = existing.getPlanMonth();
        String oldItemCode = existing.getItemCode();

        if (dto.getPlanMonth() != null) existing.setPlanMonth(dto.getPlanMonth());
        if (dto.getItemCode() != null) existing.setItemCode(dto.getItemCode());
        if (dto.getChannel() != null) existing.setChannel(dto.getChannel());
        if (dto.getStandardQuantity() != null) existing.setStandardQuantity(dto.getStandardQuantity());
        if (dto.getPromotionQuantity() != null) existing.setPromotionQuantity(dto.getPromotionQuantity());
        if (dto.getQuantity() != null) existing.setQuantity(dto.getQuantity());
        if (dto.getNote() != null) existing.setNote(dto.getNote());
        SalesPlanUpload saved = repository.save(existing);

        // 현재 월+코드 동기화
        syncAfterMutation(saved.getPlanMonth(), saved.getItemCode());

        // 월이나 코드가 변경된 경우, 이전 조합도 재동기화 (합산에서 빠져야 하므로)
        if (oldMonth != null && oldItemCode != null) {
            boolean monthChanged = !oldMonth.equals(saved.getPlanMonth());
            boolean codeChanged = !oldItemCode.equals(saved.getItemCode());
            if (monthChanged || codeChanged) {
                syncAfterMutation(oldMonth, oldItemCode);
            }
        }

        return saved;
    }

    @Transactional
    public void delete(Long id) {
        SalesPlanUpload existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("판매계획 업로드를 찾을 수 없습니다: " + id));

        String planMonth = existing.getPlanMonth();
        String itemCode = existing.getItemCode();

        repository.deleteById(id);

        // 삭제 후 해당 월+코드 재동기화 (남은 건 합산 또는 0건이면 null)
        syncAfterMutation(planMonth, itemCode);
    }

    /**
     * SalesPlanUpload 변경 후 SnopRecord 동기화 호출
     */
    private void syncAfterMutation(String planMonth, String itemCode) {
        try {
            salesPlanSyncService.syncSalesPlan(planMonth, itemCode);
        } catch (Exception e) {
            // 동기화 실패 시 업로드 자체는 롤백하지 않음 — 로그만 남김
            log.error("[SalesPlanUpload] SnopRecord 동기화 실패 (planMonth={}, itemCode={}): {}",
                    planMonth, itemCode, e.getMessage(), e);
        }
    }
}
