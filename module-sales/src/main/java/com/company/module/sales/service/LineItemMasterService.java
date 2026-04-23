package com.company.module.sales.service;

import com.company.module.sales.dto.LineItemMasterDto;
import com.company.module.sales.entity.LineItemMaster;
import com.company.module.sales.repository.LineItemMasterRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class LineItemMasterService {

    private final LineItemMasterRepository repository;

    @Transactional(readOnly = true)
    public Page<LineItemMaster> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public LineItemMaster findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("라인 아이템 마스터를 찾을 수 없습니다: " + id));
    }


    @Transactional
    public LineItemMaster create(LineItemMasterDto dto) {
        LineItemMaster entity = LineItemMaster.builder()
                .itemCode(dto.getItemCode())
                .productionLine(dto.getProductionLine())
                .hourlyThroughput(dto.getHourlyThroughput())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public LineItemMaster update(Long id, LineItemMasterDto dto) {
        LineItemMaster existing = findById(id);
        if (dto.getItemCode() != null) existing.setItemCode(dto.getItemCode());
        if (dto.getProductionLine() != null) existing.setProductionLine(dto.getProductionLine());
        if (dto.getHourlyThroughput() != null) existing.setHourlyThroughput(dto.getHourlyThroughput());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("라인 아이템 마스터를 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
