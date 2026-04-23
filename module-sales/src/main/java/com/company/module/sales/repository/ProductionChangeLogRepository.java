package com.company.module.sales.repository;

import com.company.module.sales.entity.ProductionChangeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductionChangeLogRepository extends JpaRepository<ProductionChangeLog, Long> {

    List<ProductionChangeLog> findByItemCodeOrderByCreatedAtDesc(String itemCode);

    List<ProductionChangeLog> findAllByOrderByCreatedAtDesc();
}
