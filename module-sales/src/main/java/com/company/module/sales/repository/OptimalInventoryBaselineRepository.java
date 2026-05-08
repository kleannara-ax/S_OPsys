package com.company.module.sales.repository;

import com.company.module.sales.entity.OptimalInventoryBaseline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptimalInventoryBaselineRepository extends JpaRepository<OptimalInventoryBaseline, Long> {
    List<OptimalInventoryBaseline> findAllByOrderByBaseYearAscCategoryAsc();
}
