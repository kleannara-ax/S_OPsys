package com.company.module.sales.repository;

import com.company.module.sales.entity.PlantStorageLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlantStorageLocationRepository extends JpaRepository<PlantStorageLocation, Long> {

    List<PlantStorageLocation> findAllByOrderByPlantCodeAscStorageLocationAsc();

    List<PlantStorageLocation> findByPlantCodeOrderByStorageLocationAsc(String plantCode);

    List<PlantStorageLocation> findByIsSelectedTrue();

    Optional<PlantStorageLocation> findByPlantCodeAndStorageLocation(String plantCode, String storageLocation);

    /** 마스터(seed) 데이터에서 plant_code + storage_location 조회 (plan_month=null) — 다건 가능 */
    List<PlantStorageLocation> findByPlantCodeAndStorageLocationAndPlanMonthIsNull(
            String plantCode, String storageLocation);

    /** RFC_002: item_code + plant_code + storage_location + plan_month 키로 조회 (다건 가능 → List 반환) */
    List<PlantStorageLocation> findByItemCodeAndPlantCodeAndStorageLocationAndPlanMonth(
            String itemCode, String plantCode, String storageLocation, String planMonth);

    /** item_code + plant_code + plan_month 으로 조회 */
    List<PlantStorageLocation> findByItemCodeAndPlantCodeAndPlanMonth(
            String itemCode, String plantCode, String planMonth);

    /** RFC_002: plan_month 기준 전체 조회 (삭제 후 재등록용) */
    List<PlantStorageLocation> findByPlanMonth(String planMonth);

    /** RFC_002: plant_code + storage_location + plan_month 키로 조회 (다건 가능 → List 반환) */
    List<PlantStorageLocation> findByPlantCodeAndStorageLocationAndPlanMonth(
            String plantCode, String storageLocation, String planMonth);

    /** 마스터 데이터(seed) 조회 — plan_month가 null인 레코드만 (플랜트별 저장위치 선택 화면용) */
    List<PlantStorageLocation> findByPlanMonthIsNullOrderByPlantCodeAscStorageLocationAsc();

    /** 마스터 데이터 중 선택된 저장위치만 조회 (plan_month=null AND is_selected=true) */
    List<PlantStorageLocation> findByPlanMonthIsNullAndIsSelectedTrue();
}
