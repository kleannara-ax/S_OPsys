package com.company.module.sales.service;

import com.company.module.sales.entity.ManualBom;
import com.company.module.sales.repository.ManualBomRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 수작업 BOM CRUD + 벌크 저장 서비스.
 */
@Service
@RequiredArgsConstructor
public class ManualBomService {

    private final ManualBomRepository repository;

    /**
     * 전체 조회 (구분 → 제품코드 순 정렬)
     */
    @Transactional(readOnly = true)
    public List<ManualBom> findAllSorted() {
        return repository.findAllSorted();
    }

    /**
     * 단건 조회
     */
    @Transactional(readOnly = true)
    public ManualBom findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("수작업 BOM을 찾을 수 없습니다: " + id));
    }

    /**
     * 단건 저장
     */
    @Transactional
    public ManualBom create(ManualBom entity) {
        return repository.save(entity);
    }

    /**
     * 단건 수정
     */
    @Transactional
    public ManualBom update(Long id, ManualBom updated) {
        ManualBom existing = findById(id);
        if (updated.getType() != null) existing.setType(updated.getType());
        if (updated.getComposition() != null) existing.setComposition(updated.getComposition());
        if (updated.getProductCode() != null) existing.setProductCode(updated.getProductCode());
        if (updated.getInputItem1Code() != null) existing.setInputItem1Code(updated.getInputItem1Code());
        existing.setInputQty1(updated.getInputQty1());
        if (updated.getInputItem2Code() != null) existing.setInputItem2Code(updated.getInputItem2Code());
        existing.setInputQty2(updated.getInputQty2());
        if (updated.getInputItem3Code() != null) existing.setInputItem3Code(updated.getInputItem3Code());
        existing.setInputQty3(updated.getInputQty3());
        if (updated.getInputItem4Code() != null) existing.setInputItem4Code(updated.getInputItem4Code());
        existing.setInputQty4(updated.getInputQty4());
        return repository.save(existing);
    }

    /**
     * 단건 삭제
     */
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    /**
     * 여러 건 일괄 삭제
     */
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
    public Map<String, Object> bulkSave(List<ManualBom> records, String mode) {
        int deleted = 0;
        if ("replace".equalsIgnoreCase(mode)) {
            List<ManualBom> existing = repository.findAll();
            deleted = existing.size();
            repository.deleteAll();
            repository.flush();  // 즉시 반영
        }

        List<ManualBom> saved = repository.saveAll(records);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("saved", saved.size());
        result.put("deleted", deleted);
        result.put("mode", mode);
        result.put("total", repository.count());
        return result;
    }
}
