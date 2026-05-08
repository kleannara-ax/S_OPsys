package com.company.module.sales.repository;

import com.company.module.sales.entity.InterfaceMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterfaceMasterRepository extends JpaRepository<InterfaceMaster, Long> {

    Optional<InterfaceMaster> findByInterfaceId(String interfaceId);

    boolean existsByInterfaceId(String interfaceId);
}
