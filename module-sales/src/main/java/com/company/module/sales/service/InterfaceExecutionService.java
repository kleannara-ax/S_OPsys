package com.company.module.sales.service;

import com.company.module.sales.dto.InterfaceExecutionDto;
import com.company.module.sales.entity.InterfaceExecution;
import com.company.module.sales.repository.InterfaceExecutionRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class InterfaceExecutionService {

    private final InterfaceExecutionRepository repository;

    @Transactional(readOnly = true)
    public Page<InterfaceExecution> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public InterfaceExecution findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("인터페이스 수행 설정을 찾을 수 없습니다: " + id));
    }

    @Transactional
    public InterfaceExecution create(InterfaceExecutionDto dto) {
        String ifId = dto.getInterfaceId() != null ? dto.getInterfaceId().trim() : null;
        if (ifId != null && !ifId.isEmpty() && repository.existsByInterfaceId(ifId)) {
            throw new IllegalArgumentException("이미 등록된 인터페이스 수행 설정입니다: " + ifId);
        }
        InterfaceExecution entity = InterfaceExecution.builder()
                .interfaceId(ifId)
                .interfaceName(dto.getInterfaceName())
                .scheduleType(dto.getScheduleType())
                .executionTime(dto.getExecutionTime())
                .intervalMinutes(dto.getIntervalMinutes())
                .cronExpression(dto.getCronExpression())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .description(dto.getDescription())
                .build();
        calculateNextExecution(entity);
        return repository.save(entity);
    }

    @Transactional
    public InterfaceExecution update(Long id, InterfaceExecutionDto dto) {
        InterfaceExecution existing = findById(id);
        if (dto.getInterfaceId() != null) existing.setInterfaceId(dto.getInterfaceId());
        if (dto.getInterfaceName() != null) existing.setInterfaceName(dto.getInterfaceName());
        if (dto.getScheduleType() != null) existing.setScheduleType(dto.getScheduleType());
        if (dto.getExecutionTime() != null) existing.setExecutionTime(dto.getExecutionTime());
        if (dto.getIntervalMinutes() != null) existing.setIntervalMinutes(dto.getIntervalMinutes());
        if (dto.getCronExpression() != null) existing.setCronExpression(dto.getCronExpression());
        if (dto.getIsActive() != null) existing.setIsActive(dto.getIsActive());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
        calculateNextExecution(existing);
        return repository.save(existing);
    }

    @Transactional
    public InterfaceExecution toggle(Long id) {
        InterfaceExecution existing = findById(id);
        existing.setIsActive(!Boolean.TRUE.equals(existing.getIsActive()));
        if (Boolean.TRUE.equals(existing.getIsActive())) {
            calculateNextExecution(existing);
        } else {
            existing.setNextExecutionAt(null);
        }
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("인터페이스 수행 설정을 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }

    private void calculateNextExecution(InterfaceExecution exec) {
        LocalDateTime now = LocalDateTime.now();
        String type = exec.getScheduleType();
        if (type == null) return;
        switch (type.toUpperCase()) {
            case "DAILY":
                if (exec.getExecutionTime() != null && !exec.getExecutionTime().isEmpty()) {
                    LocalTime time = LocalTime.parse(exec.getExecutionTime());
                    LocalDateTime next = now.toLocalDate().atTime(time);
                    if (next.isBefore(now) || next.isEqual(now)) next = next.plusDays(1);
                    exec.setNextExecutionAt(next);
                }
                break;
            case "HOURLY":
            case "MINUTE":
                int minutes = exec.getIntervalMinutes() != null ? exec.getIntervalMinutes() : 60;
                exec.setNextExecutionAt(now.plusMinutes(minutes));
                break;
            default:
                exec.setNextExecutionAt(now.plusHours(1));
        }
    }
}
