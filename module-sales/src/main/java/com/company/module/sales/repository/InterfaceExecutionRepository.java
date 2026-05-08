package com.company.module.sales.repository;

import com.company.module.sales.entity.InterfaceExecution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterfaceExecutionRepository extends JpaRepository<InterfaceExecution, Long> {

    Optional<InterfaceExecution> findByInterfaceId(String interfaceId);

    List<InterfaceExecution> findByIsActiveTrue();

    List<InterfaceExecution> findByIsActiveTrueAndNextExecutionAtBefore(LocalDateTime now);

    boolean existsByInterfaceId(String interfaceId);
}
