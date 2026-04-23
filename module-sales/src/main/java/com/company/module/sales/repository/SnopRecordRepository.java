package com.company.module.sales.repository;

import com.company.module.sales.entity.SnopRecord;
import org.springframework.data.jpa.repository.JpaRepository;
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

}
