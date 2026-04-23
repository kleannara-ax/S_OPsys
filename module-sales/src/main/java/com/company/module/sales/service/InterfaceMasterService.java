package com.company.module.sales.service;

import com.company.module.sales.dto.InterfaceMasterDto;
import com.company.module.sales.entity.InterfaceMaster;
import com.company.module.sales.repository.InterfaceMasterRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterfaceMasterService {

    private final InterfaceMasterRepository repository;

    @Transactional(readOnly = true)
    public Page<InterfaceMaster> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public InterfaceMaster findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("인터페이스 마스터를 찾을 수 없습니다: " + id));
    }

    @Transactional
    public InterfaceMaster create(InterfaceMasterDto dto) {
        String ifId = dto.getInterfaceId() != null ? dto.getInterfaceId().trim() : null;
        if (ifId != null && repository.existsByInterfaceId(ifId)) {
            throw new IllegalArgumentException("이미 등록된 인터페이스 ID입니다: " + ifId);
        }
        InterfaceMaster entity = InterfaceMaster.builder()
                .interfaceId(ifId)
                .interfaceName(dto.getInterfaceName())
                .sender(dto.getSender())
                .receiver(dto.getReceiver())
                .rfcUrl(dto.getRfcUrl())
                .rfcParam(dto.getRfcParam())
                .execCommand(dto.getExecCommand())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public InterfaceMaster update(Long id, InterfaceMasterDto dto) {
        InterfaceMaster existing = findById(id);
        if (dto.getInterfaceId() != null) existing.setInterfaceId(dto.getInterfaceId());
        if (dto.getInterfaceName() != null) existing.setInterfaceName(dto.getInterfaceName());
        if (dto.getSender() != null) existing.setSender(dto.getSender());
        if (dto.getReceiver() != null) existing.setReceiver(dto.getReceiver());
        if (dto.getRfcUrl() != null) existing.setRfcUrl(dto.getRfcUrl());
        if (dto.getRfcParam() != null) existing.setRfcParam(dto.getRfcParam());
        if (dto.getExecCommand() != null) existing.setExecCommand(dto.getExecCommand());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("인터페이스 마스터를 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
