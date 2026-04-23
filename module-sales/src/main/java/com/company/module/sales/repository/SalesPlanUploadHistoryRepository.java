package com.company.module.sales.repository;

import com.company.module.sales.entity.SalesPlanUploadHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesPlanUploadHistoryRepository extends JpaRepository<SalesPlanUploadHistory, Long> {
    List<SalesPlanUploadHistory> findAllByOrderByCreatedAtDesc();
}
