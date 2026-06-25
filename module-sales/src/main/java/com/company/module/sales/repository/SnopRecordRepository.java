package com.company.module.sales.repository;

import com.company.module.sales.entity.SnopRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

    /**
     * 특정 계획월(planMonth)의 모든 레코드에 대해 manual_input_quantity를 0으로 일괄 초기화.
     * 매월 1일 자동 리셋 스케줄러에서 사용.
     * @return 업데이트된 레코드 수
     */
    @Modifying
    @Query("UPDATE SnopRecord s SET s.manualInputQuantity = 0 WHERE s.planMonth = :planMonth")
    int resetManualInputQuantityByPlanMonth(@Param("planMonth") String planMonth);

}
