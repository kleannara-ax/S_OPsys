package com.company.module.sales.repository;

import com.company.module.sales.entity.SalesPlanUploadLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesPlanUploadLogRepository extends JpaRepository<SalesPlanUploadLog, Long> {
    List<SalesPlanUploadLog> findAllByOrderByCreatedAtDesc();
}
