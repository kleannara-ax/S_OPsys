package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.UserDto;
import com.company.module.sales.entity.User;
import com.company.module.sales.repository.UserRepository;
import com.company.module.sales.service.UserService;
import javax.annotation.PostConstruct;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales-api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final UserRepository userRepository;

    @PostConstruct
    public void initSeedData() {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder()
                    .userId("admin").userName("관리자").password("admin1234")
                    .email("admin@company.com").department("시스템관리")
                    .role("ADMIN").isActive(true).build());
            userRepository.save(User.builder()
                    .userId("planner").userName("계획담당자").password("plan1234")
                    .email("planner@company.com").department("SCM기획")
                    .role("USER").isActive(true).build());
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(userRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<User>> create(@Valid @RequestBody UserDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "사용자 등록 완료"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> update(@PathVariable Long id, @Valid @RequestBody UserDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "사용자 수정 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제되었습니다."));
    }

    @PatchMapping("/{id}/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@PathVariable Long id,
                                                            @RequestBody Map<String, String> body) {
        User user = service.findById(id);
        String newPw = body.getOrDefault("password", "password1234");
        user.setPassword(newPw);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok(null, "비밀번호가 초기화되었습니다."));
    }
}
