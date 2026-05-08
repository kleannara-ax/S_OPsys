package com.company.module.sales.repository;

import com.company.module.sales.entity.DataChangeHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DataChangeHistoryRepository extends JpaRepository<DataChangeHistory, Long> {

    List<DataChangeHistory> findByTableNameOrderByChangedAtDesc(String tableName);

    List<DataChangeHistory> findByTableNameAndRecordIdOrderByChangedAtDesc(String tableName, String recordId);

    List<DataChangeHistory> findByChangedByOrderByChangedAtDesc(String changedBy);

    @Query("SELECT h FROM DataChangeHistory h WHERE " +
           "(:tableName IS NULL OR h.tableName = :tableName) AND " +
           "(:changeType IS NULL OR h.changeType = :changeType) AND " +
           "(:changedBy IS NULL OR h.changedBy = :changedBy) AND " +
           "(:from IS NULL OR h.changedAt >= :from) AND " +
           "(:to IS NULL OR h.changedAt <= :to) " +
           "ORDER BY h.changedAt DESC")
    Page<DataChangeHistory> search(
            @Param("tableName") String tableName,
            @Param("changeType") String changeType,
            @Param("changedBy") String changedBy,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);
}
