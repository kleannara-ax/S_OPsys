package com.company.module.sales.controller;

import com.company.module.sales.config.AuditUserContext;
import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.entity.UserMenuPermission;
import com.company.module.sales.repository.UserMenuPermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 사용자별 메뉴 권한 관리 API.
 * ADMIN만 설정 가능하며, ADMIN 사용자는 이 설정과 무관하게 전체 메뉴 접근 가능.
 *
 * 주의: savePermissions는 @Transactional 대신 TransactionTemplate을 사용한다.
 * 이유: @Transactional 프록시 예외는 Controller try-catch가 아닌 GlobalExceptionHandler가 잡아서
 * 클라이언트에 구체적 에러 원인을 전달하기 어려웠기 때문.
 */
@Slf4j
@RestController
@RequestMapping("/sales-api/user-menu-permissions")
@RequiredArgsConstructor
public class UserMenuPermissionController {

    private final UserMenuPermissionRepository repository;
    private final TransactionTemplate transactionTemplate;

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
     *
     * TransactionTemplate으로 프로그래밍 방식 트랜잭션 사용 → try-catch에서 모든 예외를 직접 포착.
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> savePermissions(
            @PathVariable String userId,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request) {

        try {
            // AuditUserContext에 사용자 설정 보장 (AuditFilter가 설정하지만 방어적으로 재확인)
            ensureAuditContext(request);

            @SuppressWarnings("unchecked")
            List<String> views = (List<String>) body.getOrDefault("views", Collections.emptyList());

            transactionTemplate.executeWithoutResult(status -> {
                // 기존 권한 삭제
                repository.deleteAllByUserId(userId);
                repository.flush();

                // 새 권한 생성
                List<UserMenuPermission> newPerms = new ArrayList<>();
                for (String viewId : views) {
                    UserMenuPermission perm = new UserMenuPermission();
                    perm.setUserId(userId);
                    perm.setViewId(viewId);
                    perm.setAllowed(true);
                    newPerms.add(perm);
                }
                repository.saveAll(newPerms);
                repository.flush();
            });

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("user_id", userId);
            result.put("views", views);
            result.put("count", views.size());
            return ResponseEntity.ok(ApiResponse.ok(result, "메뉴 권한이 저장되었습니다."));
        } catch (Exception e) {
            // TransactionTemplate 예외도 여기서 직접 포착 가능
            String cause = e.getMessage();
            if (e.getCause() != null) cause += " [원인: " + e.getCause().getMessage() + "]";
            log.error("메뉴 권한 저장 실패 (userId={}): {}", userId, cause, e);
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "권한 저장 중 오류: " + cause));
        }
    }

    /**
     * AuditUserContext에 현재 사용자가 설정되어 있지 않으면 세션에서 가져와 설정.
     * AuditEntityListener가 @PrePersist에서 createdBy/updatedBy를 채우려면
     * AuditUserContext에 사용자가 있어야 한다.
     */
    private void ensureAuditContext(HttpServletRequest request) {
        if (AuditUserContext.get() != null) return;
        // 세션에서 사용자 ID 가져오기
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object loginUser = session.getAttribute("loginUser");
            if (loginUser != null) {
                AuditUserContext.set(loginUser.toString());
                return;
            }
        }
        // Principal fallback
        if (request.getUserPrincipal() != null) {
            AuditUserContext.set(request.getUserPrincipal().getName());
        }
    }
}
