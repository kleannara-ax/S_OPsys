package com.company.module.sales.repository;

import com.company.module.sales.entity.LineItemMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LineItemMasterRepository extends JpaRepository<LineItemMaster, Long> {
}
