package com.company.module.sales.service;

import com.company.module.sales.entity.SalesPlanUploadHistory;
import com.company.module.sales.repository.SalesPlanUploadHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesPlanUploadHistoryService {

    private final SalesPlanUploadHistoryRepository repository;

    @Transactional(readOnly = true)
    public Page<SalesPlanUploadHistory> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<SalesPlanUploadHistory> findAllSorted() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}
