package com.company.module.sales.service;

import com.company.module.sales.entity.BaseMaterialMaster;
import com.company.module.sales.entity.SalesPlanUpload;
import com.company.module.sales.entity.SnopRecord;
import com.company.module.sales.repository.BaseMaterialMasterRepository;
import com.company.module.sales.repository.SalesPlanUploadRepository;
import com.company.module.sales.repository.SnopRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 판매계획 업로드(SalesPlanUpload) → 생산계획현황(SnopRecord) 동기화 서비스.
 *
 * 동일 planMonth + itemCode 의 SalesPlanUpload.quantity 를 모두 SUM 한 값을
 * SnopRecord.salesPlan 에 반영한다.
 * SnopRecord가 없는 신규 자재는 새 레코드를 생성한다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SalesPlanSyncService {

    private final SalesPlanUploadRepository salesPlanUploadRepository;
    private final SnopRecordRepository snopRecordRepository;
    private final BaseMaterialMasterRepository baseMaterialMasterRepository;

    /**
     * 특정 planMonth + itemCode 에 대해 SalesPlanUpload 의 quantity 합산 →
     * SnopRecord.salesPlan 에 반영 (upsert).
     */
    @Transactional
    public void syncSalesPlan(String planMonth, String itemCode) {
        if (planMonth == null || planMonth.isBlank() || itemCode == null || itemCode.isBlank()) {
            log.warn("[SalesPlanSync] planMonth 또는 itemCode가 비어있어 동기화 건너뜀: planMonth={}, itemCode={}", planMonth, itemCode);
            return;
        }

        String trimmedMonth = planMonth.trim();
        String trimmedCode = itemCode.trim();

        // 동일 월+자재의 모든 SalesPlanUpload 조회 → quantity SUM
        List<SalesPlanUpload> uploads = salesPlanUploadRepository.findByPlanMonthAndItemCode(trimmedMonth, trimmedCode);
        long totalQuantity = uploads.stream()
                .mapToLong(u -> u.getQuantity() != null ? u.getQuantity() : 0L)
                .sum();

        log.info("[SalesPlanSync] {}+{}: 업로드 {}건, SUM quantity={}", trimmedMonth, trimmedCode, uploads.size(), totalQuantity);

        // SnopRecord 조회 (item_code + plan_month)
        Optional<SnopRecord> existingOpt = snopRecordRepository.findFirstByItemCodeAndPlanMonth(trimmedCode, trimmedMonth);

        if (existingOpt.isPresent()) {
            // 기존 SnopRecord 업데이트
            SnopRecord existing = existingOpt.get();
            if (uploads.isEmpty()) {
                // 업로드 데이터가 모두 삭제된 경우 — salesPlan을 null로 초기화
                existing.setSalesPlan(null);
                log.info("[SalesPlanSync] 기존 SnopRecord(id={}) salesPlan → null (업로드 0건)", existing.getId());
            } else {
                existing.setSalesPlan(totalQuantity);
                log.info("[SalesPlanSync] 기존 SnopRecord(id={}) salesPlan → {}", existing.getId(), totalQuantity);
            }
            snopRecordRepository.save(existing);
        } else if (!uploads.isEmpty()) {
            // 신규 자재 — SnopRecord 생성
            SnopRecord newRecord = SnopRecord.builder()
                    .itemCode(trimmedCode)
                    .planMonth(trimmedMonth)
                    .salesPlan(totalQuantity)
                    .build();

            // BaseMaterialMaster에서 자재명·카테고리 등 보충
            enrichFromMaterialMaster(newRecord, trimmedCode);

            snopRecordRepository.save(newRecord);
            log.info("[SalesPlanSync] 신규 SnopRecord 생성: itemCode={}, planMonth={}, salesPlan={}",
                    trimmedCode, trimmedMonth, totalQuantity);
        }
        // uploads.isEmpty() && existingOpt.isEmpty() → 아무것도 할 필요 없음
    }

    /**
     * 전체 SalesPlanUpload 데이터를 기반으로 SnopRecord 를 일괄 동기화.
     * (초기 데이터 마이그레이션 또는 수동 전체 동기화용)
     *
     * @return 동기화된 (planMonth, itemCode) 조합 수
     */
    @Transactional
    public int syncAll() {
        List<Object[]> distinctCombinations = salesPlanUploadRepository.findDistinctPlanMonthAndItemCode();
        log.info("[SalesPlanSync] 전체 동기화 시작: {} 개 (planMonth, itemCode) 조합", distinctCombinations.size());

        int count = 0;
        for (Object[] combo : distinctCombinations) {
            String planMonth = (String) combo[0];
            String itemCode = (String) combo[1];
            syncSalesPlan(planMonth, itemCode);
            count++;
        }

        log.info("[SalesPlanSync] 전체 동기화 완료: {} 건 처리", count);
        return count;
    }

    /**
     * BaseMaterialMaster 에서 자재명, 카테고리(hierarchyName), vendorName 등을 가져와
     * SnopRecord 에 보충한다.
     */
    private void enrichFromMaterialMaster(SnopRecord record, String itemCode) {
        try {
            List<BaseMaterialMaster> masters = baseMaterialMasterRepository.findByItemCode(itemCode);
            if (masters.isEmpty()) {
                // 대소문자 무관 검색 시도
                masters = baseMaterialMasterRepository.findAll().stream()
                        .filter(m -> m.getItemCode() != null && m.getItemCode().equalsIgnoreCase(itemCode))
                        .collect(Collectors.toList());
            }
            if (!masters.isEmpty()) {
                BaseMaterialMaster master = masters.get(0);
                if (record.getItemName() == null && master.getItemName() != null) {
                    record.setItemName(master.getItemName());
                }
                if (record.getCategory() == null && master.getHierarchyName() != null) {
                    record.setCategory(master.getHierarchyName());
                }
                if (record.getVendorName() == null && master.getVendorName() != null) {
                    record.setVendorName(master.getVendorName());
                }
                if (record.getMoq() == null && master.getMoq() != null) {
                    record.setMoq(master.getMoq());
                }
                log.debug("[SalesPlanSync] 자재마스터에서 보충: itemCode={}, itemName={}, category={}",
                        itemCode, master.getItemName(), master.getHierarchyName());
            } else {
                log.debug("[SalesPlanSync] 자재마스터에 해당 자재 없음: {}", itemCode);
            }
        } catch (Exception e) {
            log.warn("[SalesPlanSync] 자재마스터 조회 중 오류 (무시): {}", e.getMessage());
        }
    }
}
