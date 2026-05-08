package com.company.module.sales.service;

import com.company.module.sales.dto.DevScheduleDto;
import com.company.module.sales.entity.DevSchedule;
import com.company.module.sales.repository.DevScheduleRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DevScheduleService {

    private final DevScheduleRepository repository;

    @Transactional(readOnly = true)
    public Page<DevSchedule> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<DevSchedule> findAllSorted() {
        return repository.findAllByOrderByScheduleDateDescScheduleTimeDesc();
    }

    @Transactional(readOnly = true)
    public DevSchedule findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("개발 일정을 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public List<DevSchedule> findByDateRange(LocalDate start, LocalDate end) {
        return repository.findByScheduleDateBetweenOrderByScheduleDateAscScheduleTimeAsc(start, end);
    }

    @Transactional(readOnly = true)
    public List<DevSchedule> findByStatus(String status) {
        return repository.findByStatusOrderByScheduleDateAscScheduleTimeAsc(status);
    }

    @Transactional
    public DevSchedule create(DevScheduleDto dto) {
        DevSchedule entity = DevSchedule.builder()
                .scheduleDate(dto.getScheduleDate())
                .scheduleTime(dto.getScheduleTime())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .status(dto.getStatus() != null ? dto.getStatus() : "planned")
                .priority(dto.getPriority() != null ? dto.getPriority() : "medium")
                .assignee(dto.getAssignee())
                .progress(dto.getProgress() != null ? dto.getProgress() : 0)
                .notes(dto.getNotes())
                .build();
        return repository.save(entity);
    }

    @Transactional
    public DevSchedule update(Long id, DevScheduleDto dto) {
        DevSchedule existing = findById(id);
        if (dto.getScheduleDate() != null) existing.setScheduleDate(dto.getScheduleDate());
        if (dto.getScheduleTime() != null) existing.setScheduleTime(dto.getScheduleTime());
        if (dto.getTitle() != null) existing.setTitle(dto.getTitle());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
        if (dto.getCategory() != null) existing.setCategory(dto.getCategory());
        if (dto.getStatus() != null) existing.setStatus(dto.getStatus());
        if (dto.getPriority() != null) existing.setPriority(dto.getPriority());
        if (dto.getAssignee() != null) existing.setAssignee(dto.getAssignee());
        if (dto.getProgress() != null) existing.setProgress(dto.getProgress());
        if (dto.getNotes() != null) existing.setNotes(dto.getNotes());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("개발 일정을 찾을 수 없습니다: " + id);
        }
        repository.deleteById(id);
    }
}
