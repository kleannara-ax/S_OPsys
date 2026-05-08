package com.company.module.sales.service;

import com.company.module.sales.entity.SalesPlanUploadLog;
import com.company.module.sales.repository.SalesPlanUploadLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesPlanUploadLogService {

    private final SalesPlanUploadLogRepository repository;

    @Transactional(readOnly = true)
    public Page<SalesPlanUploadLog> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<SalesPlanUploadLog> findAllSorted() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}
