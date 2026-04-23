package com.company.module.sales.repository;

import com.company.module.sales.entity.RecentSalesAverage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecentSalesAverageRepository extends JpaRepository<RecentSalesAverage, Long> {
    List<RecentSalesAverage> findAllByOrderByCreatedAtDesc();
}
