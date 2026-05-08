package com.company.module.sales.repository;

import com.company.module.sales.entity.SalesPlanUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesPlanUploadRepository extends JpaRepository<SalesPlanUpload, Long> {
    List<SalesPlanUpload> findAllByOrderByCreatedAtDesc();
}
