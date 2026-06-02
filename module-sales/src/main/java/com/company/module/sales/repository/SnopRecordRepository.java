package com.company.module.sales.repository;

import com.company.module.sales.entity.SnopRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface SnopRecordRepository extends JpaRepository<SnopRecord, Long> {

    List<SnopRecord> findByItemCodeOrderByPlanMonthAsc(String itemCode);

    List<SnopRecord> findAllByOrderByPlanMonthAscItemCodeAsc();

    Optional<SnopRecord> findFirstByItemCodeAndPlanMonth(String itemCode, String planMonth);

    List<SnopRecord> findByItemCodeAndPlanMonth(String itemCode, String planMonth);

    boolean existsByItemCodeAndPlanMonth(String itemCode, String planMonth);

    /** RFC_003: item_code + plan_month + plant_code 키로 조회 */
    Optional<SnopRecord> findByItemCodeAndPlanMonthAndPlantCode(String itemCode, String planMonth, String plantCode);

    // ── case-insensitive 중복 검사/조회 메서드 (Task 46) ──

    /** item_code 대소문자 무시 + plan_month 기준 존재 여부 */
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
           "FROM SnopRecord s WHERE UPPER(s.itemCode) = UPPER(:itemCode) AND s.planMonth = :planMonth")
    boolean existsByItemCodeIgnoreCaseAndPlanMonth(@Param("itemCode") String itemCode,
                                                   @Param("planMonth") String planMonth);

    /** item_code 대소문자 무시 + plan_month 기준 전체 조회 (중복 정리용) */
    @Query("SELECT s FROM SnopRecord s WHERE UPPER(s.itemCode) = UPPER(:itemCode) AND s.planMonth = :planMonth ORDER BY s.id ASC")
    List<SnopRecord> findByItemCodeIgnoreCaseAndPlanMonth(@Param("itemCode") String itemCode,
                                                          @Param("planMonth") String planMonth);

    /** item_code 대소문자 무시 + plan_month 기준 첫 번째 조회 */
    @Query("SELECT s FROM SnopRecord s WHERE UPPER(s.itemCode) = UPPER(:itemCode) AND s.planMonth = :planMonth ORDER BY s.id ASC")
    List<SnopRecord> findAllByItemCodeIgnoreCaseAndPlanMonthOrderByIdAsc(@Param("itemCode") String itemCode,
                                                                         @Param("planMonth") String planMonth);

}
