package com.company.module.sales.repository;

import com.company.module.sales.entity.MaterialLinkage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialLinkageRepository extends JpaRepository<MaterialLinkage, Long> {
}
