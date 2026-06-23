package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.entity.UserMenuPermission;
import com.company.module.sales.repository.UserMenuPermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 사용자별 메뉴 권한 관리 API.
 * ADMIN만 설정 가능하며, ADMIN 사용자는 이 설정과 무관하게 전체 메뉴 접근 가능.
 */
@RestController
@RequestMapping("/sales-api/user-menu-permissions")
@RequiredArgsConstructor
public class UserMenuPermissionController {

    private final UserMenuPermissionRepository repository;

    /** 전체 사용자 메뉴 권한 조회 */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserMenuPermission>>> listAll() {
        try {
            return ResponseEntity.ok(ApiResponse.ok(repository.findAll()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList()));
        }
    }

    /** 특정 사용자의 메뉴 권한 조회 */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<UserMenuPermission>>> getByUser(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(repository.findByUserId(userId)));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList()));
        }
    }

    /**
     * 특정 사용자의 메뉴 권한 일괄 저장 (DELETE → INSERT).
     * body: { "views": ["summary", "table", "sales-upload"] }
     * → 해당 사용자의 기존 권한을 삭제하고, 전달된 view_id 목록으로 재생성.
     */
    @PutMapping("/{userId}")
    @Transactional
    public ResponseEntity<?> savePermissions(
            @PathVariable String userId,
            @RequestBody Map<String, Object> body) {

        try {
            // 기존 권한 삭제
            repository.deleteByUserId(userId);
            repository.flush();

            // 새 권한 생성
            @SuppressWarnings("unchecked")
            List<String> views = (List<String>) body.getOrDefault("views", Collections.emptyList());

            List<UserMenuPermission> saved = new ArrayList<>();
            for (String viewId : views) {
                UserMenuPermission perm = UserMenuPermission.builder()
                        .userId(userId)
                        .viewId(viewId)
                        .allowed(true)
                        .build();
                saved.add(repository.save(perm));
            }

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("user_id", userId);
            result.put("views", views);
            result.put("count", saved.size());
            return ResponseEntity.ok(ApiResponse.ok(result, "메뉴 권한이 저장되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "권한 저장 중 오류: " + e.getMessage()));
        }
    }
}
