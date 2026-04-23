package com.company.module.sales.repository;

import com.company.module.sales.entity.MonthlyClosing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyClosingRepository extends JpaRepository<MonthlyClosing, Long> {

    /** item_code + closing_month 으로 단건 조회 */
    Optional<MonthlyClosing> findByItemCodeAndClosingMonth(String itemCode, String closingMonth);

    /** item_code + closing_month 존재 여부 */
    boolean existsByItemCodeAndClosingMonth(String itemCode, String closingMonth);

    /** closing_month 로 조회 */
    List<MonthlyClosing> findByClosingMonth(String closingMonth);

    /** item_code 로 조회 */
    List<MonthlyClosing> findByItemCode(String itemCode);

    /** hierarchy_name 으로 조회 */
    List<MonthlyClosing> findByHierarchyName(String hierarchyName);

    /** closing_month 기준 삭제 후 재등록 시 사용 */
    void deleteByClosingMonth(String closingMonth);

    /** 특정 월 범위 조회 (closing_month BETWEEN) */
    @Query("SELECT mc FROM MonthlyClosing mc WHERE mc.closingMonth >= :fromMonth AND mc.closingMonth <= :toMonth ORDER BY mc.closingMonth, mc.itemCode")
    List<MonthlyClosing> findByClosingMonthBetween(@Param("fromMonth") String fromMonth, @Param("toMonth") String toMonth);

    /** 고유 closing_month 목록 조회 */
    @Query("SELECT DISTINCT mc.closingMonth FROM MonthlyClosing mc ORDER BY mc.closingMonth")
    List<String> findDistinctClosingMonths();
}
