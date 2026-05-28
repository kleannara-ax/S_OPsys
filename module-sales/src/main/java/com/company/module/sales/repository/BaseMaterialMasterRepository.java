package com.company.module.sales.repository;

import com.company.module.sales.entity.BaseMaterialMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaseMaterialMasterRepository extends JpaRepository<BaseMaterialMaster, Long> {

    List<BaseMaterialMaster> findByScmArea(String scmArea);

    List<BaseMaterialMaster> findByItemCode(String itemCode);

    /** 대소문자 무시하여 자재코드 조회 */
    @Query("SELECT b FROM BaseMaterialMaster b WHERE UPPER(b.itemCode) = UPPER(:itemCode)")
    List<BaseMaterialMaster> findByItemCodeIgnoreCase(String itemCode);

    @Query("SELECT DISTINCT b.scmArea FROM BaseMaterialMaster b WHERE b.scmArea IS NOT NULL ORDER BY b.scmArea")
    List<String> findDistinctScmAreas();

    @Query("SELECT b FROM BaseMaterialMaster b WHERE UPPER(b.productionUnit) LIKE '%OEM%'")
    List<BaseMaterialMaster> findOemMasters();
}
