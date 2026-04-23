package com.company.module.sales.service;

import com.company.module.sales.entity.ProductionChangeLog;
import com.company.module.sales.repository.ProductionChangeLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductionChangeLogService {

    private final ProductionChangeLogRepository repository;

    @Transactional(readOnly = true)
    public Page<ProductionChangeLog> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<ProductionChangeLog> findAllSorted() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<ProductionChangeLog> findByItemCode(String itemCode) {
        return repository.findByItemCodeOrderByCreatedAtDesc(itemCode);
    }
}
