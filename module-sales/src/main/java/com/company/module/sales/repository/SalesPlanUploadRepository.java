package com.company.module.sales.repository;

import com.company.module.sales.entity.SalesPlanUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesPlanUploadRepository extends JpaRepository<SalesPlanUpload, Long> {
    List<SalesPlanUpload> findAllByOrderByCreatedAtDesc();

    /** 동일 계획월 + 자재코드의 모든 업로드 건 조회 (SUM 집계용) */
    List<SalesPlanUpload> findByPlanMonthAndItemCode(String planMonth, String itemCode);

    /** 특정 계획월의 모든 업로드 건 조회 */
    List<SalesPlanUpload> findByPlanMonth(String planMonth);

    /** 유니크한 (planMonth, itemCode) 조합 조회 — 전체 동기화용 */
    @org.springframework.data.jpa.repository.Query(
        "SELECT DISTINCT u.planMonth, u.itemCode FROM SalesPlanUpload u " +
        "WHERE u.planMonth IS NOT NULL AND u.itemCode IS NOT NULL")
    List<Object[]> findDistinctPlanMonthAndItemCode();
}
