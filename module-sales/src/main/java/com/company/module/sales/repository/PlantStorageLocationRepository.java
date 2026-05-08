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

    /** RFC_002: item_code + plant_code + storage_location + plan_month 키로 조회 */
    Optional<PlantStorageLocation> findByItemCodeAndPlantCodeAndStorageLocationAndPlanMonth(
            String itemCode, String plantCode, String storageLocation, String planMonth);

    /** item_code + plant_code + plan_month 으로 조회 */
    List<PlantStorageLocation> findByItemCodeAndPlantCodeAndPlanMonth(
            String itemCode, String plantCode, String planMonth);

    /** RFC_002: plan_month 기준 전체 조회 (삭제 후 재등록용) */
    List<PlantStorageLocation> findByPlanMonth(String planMonth);
}
