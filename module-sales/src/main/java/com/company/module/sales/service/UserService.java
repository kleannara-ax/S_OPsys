package com.company.module.sales.service;

import com.company.module.sales.dto.UserDto;
import com.company.module.sales.entity.User;
import com.company.module.sales.repository.UserRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    @Transactional(readOnly = true)
    public Page<User> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public User findByUserId(String userId) {
        return repository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));
    }

    @Transactional
    public User create(UserDto dto) {
        if (repository.existsByUserId(dto.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다: " + dto.getUserId());
        }
        User entity = User.builder()
                .userId(dto.getUserId())
                .userName(dto.getUserName())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .department(dto.getDepartment())
                .role(dto.getRole() != null ? dto.getRole() : "USER")
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return repository.save(entity);
    }

    @Transactional
    public User update(Long id, UserDto dto) {
        User existing = findById(id);
        if (dto.getUserName() != null) existing.setUserName(dto.getUserName());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) existing.setPassword(dto.getPassword());
        if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
        if (dto.getDepartment() != null) existing.setDepartment(dto.getDepartment());
        if (dto.getRole() != null) existing.setRole(dto.getRole());
        if (dto.getIsActive() != null) existing.setIsActive(dto.getIsActive());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
