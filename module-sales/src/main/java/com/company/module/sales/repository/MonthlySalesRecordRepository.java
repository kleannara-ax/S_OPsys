package com.company.module.sales.repository;

import com.company.module.sales.entity.MonthlySalesRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlySalesRecordRepository extends JpaRepository<MonthlySalesRecord, Long> {

    /** item_code + closing_month 으로 단건 조회 */
    Optional<MonthlySalesRecord> findByItemCodeAndClosingMonth(String itemCode, String closingMonth);

    /** item_code + closing_month 존재 여부 */
    boolean existsByItemCodeAndClosingMonth(String itemCode, String closingMonth);

    /** closing_month 로 조회 */
    List<MonthlySalesRecord> findByClosingMonth(String closingMonth);

    /** item_code 로 조회 */
    List<MonthlySalesRecord> findByItemCode(String itemCode);

    /** closing_month 기준 삭제 */
    void deleteByClosingMonth(String closingMonth);

    /** 특정 월 범위 조회 */
    @Query("SELECT r FROM MonthlySalesRecord r WHERE r.closingMonth >= :fromMonth AND r.closingMonth <= :toMonth ORDER BY r.closingMonth, r.itemCode")
    List<MonthlySalesRecord> findByClosingMonthBetween(@Param("fromMonth") String fromMonth, @Param("toMonth") String toMonth);

    /** 고유 closing_month 목록 조회 */
    @Query("SELECT DISTINCT r.closingMonth FROM MonthlySalesRecord r ORDER BY r.closingMonth")
    List<String> findDistinctClosingMonths();

}
