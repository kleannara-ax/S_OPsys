package com.company.module.sales.service;

import com.company.module.sales.entity.ManualProd;
import com.company.module.sales.repository.ManualProdRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 수작업 생산계획 CRUD + 벌크 저장 서비스.
 */
@Service
@RequiredArgsConstructor
public class ManualProdService {

    private final ManualProdRepository repository;

    @Transactional(readOnly = true)
    public List<ManualProd> findAllSorted() {
        return repository.findAllSorted();
    }

    @Transactional(readOnly = true)
    public ManualProd findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("수작업 생산계획을 찾을 수 없습니다: " + id));
    }

    @Transactional
    public ManualProd create(ManualProd entity) {
        return repository.save(entity);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return;
        repository.deleteAllByIdIn(ids);
    }

    /**
     * 벌크 저장 (엑셀 업로드용)
     * mode = "replace" → 기존 전체 삭제 후 새 데이터 저장
     * mode = "append"  → 기존 데이터 유지, 새 데이터 추가
     */
    @Transactional
    public Map<String, Object> bulkSave(List<ManualProd> records, String mode) {
        int deleted = 0;
        if ("replace".equalsIgnoreCase(mode)) {
            List<ManualProd> existing = repository.findAll();
            deleted = existing.size();
            repository.deleteAll();
            repository.flush();
        }

        List<ManualProd> saved = repository.saveAll(records);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("saved", saved.size());
        result.put("deleted", deleted);
        result.put("mode", mode);
        result.put("total", repository.count());
        return result;
    }
}
