package com.company.module.sales.repository;

import com.company.module.sales.entity.ManualProd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManualProdRepository extends JpaRepository<ManualProd, Long> {

    /** 전체 조회 — 계획일 → 제품코드 순 정렬 */
    @Query("SELECT m FROM ManualProd m ORDER BY m.planDate ASC, m.productCode ASC, m.id ASC")
    List<ManualProd> findAllSorted();

    /** 여러 ID 일괄 삭제 */
    void deleteAllByIdIn(List<Long> ids);
}
