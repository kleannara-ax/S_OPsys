package com.company.module.sales.repository;

import com.company.module.sales.entity.LineCapaPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LineCapaPlanRepository extends JpaRepository<LineCapaPlan, Long> {
    List<LineCapaPlan> findAllByOrderByProductionLineAscPlanMonthAsc();
}
