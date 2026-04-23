package com.company.module.sales.service;

import com.company.module.sales.entity.DataChangeHistory;
import com.company.module.sales.repository.DataChangeHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataChangeHistoryService {

    private final DataChangeHistoryRepository repository;

    @Transactional(readOnly = true)
    public Page<DataChangeHistory> search(String tableName, String changeType,
                                           String changedBy, LocalDateTime from,
                                           LocalDateTime to, Pageable pageable) {
        return repository.search(tableName, changeType, changedBy, from, to, pageable);
    }

    @Transactional(readOnly = true)
    public List<DataChangeHistory> findByRecord(String tableName, String recordId) {
        return repository.findByTableNameAndRecordIdOrderByChangedAtDesc(tableName, recordId);
    }
}
