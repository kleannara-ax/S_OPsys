package com.company.module.sales.repository;

import com.company.module.sales.entity.InterfaceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterfaceHistoryRepository extends JpaRepository<InterfaceHistory, Long> {

    List<InterfaceHistory> findByInterfaceIdOrderByStartTimeDesc(String interfaceId);

    List<InterfaceHistory> findByStatusOrderByStartTimeDesc(String status);

    List<InterfaceHistory> findAllByOrderByStartTimeDesc();

    List<InterfaceHistory> findByStatusInOrderByStartTimeDesc(List<String> statuses);

    Optional<InterfaceHistory> findFirstByInterfaceIdOrderByStartTimeDesc(String interfaceId);

    @Query(value = "SELECT h.* FROM mod_sales_interface_history h " +
           "INNER JOIN (SELECT INTERFACE_ID, MAX(id) as max_id FROM mod_sales_interface_history GROUP BY INTERFACE_ID) latest " +
           "ON h.id = latest.max_id ORDER BY h.START_TIME DESC", nativeQuery = true)
    List<InterfaceHistory> findLatestPerInterface();
}
