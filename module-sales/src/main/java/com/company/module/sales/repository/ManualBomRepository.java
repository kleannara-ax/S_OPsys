package com.company.module.sales.repository;

import com.company.module.sales.entity.ManualBom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManualBomRepository extends JpaRepository<ManualBom, Long> {

    /** 제품코드로 조회 */
    List<ManualBom> findByProductCode(String productCode);

    /** 구분(type)으로 조회 */
    List<ManualBom> findByType(String type);

    /** 제품코드 + 투입단품1코드 기준 중복 확인용 */
    Optional<ManualBom> findByProductCodeAndInputItem1Code(String productCode, String inputItem1Code);

    /** 전체 조회 — 구분 → 제품코드 순 정렬 */
    @Query("SELECT m FROM ManualBom m ORDER BY m.type ASC, m.productCode ASC, m.id ASC")
    List<ManualBom> findAllSorted();

    /** 여러 ID 일괄 삭제 */
    void deleteAllByIdIn(List<Long> ids);
}
