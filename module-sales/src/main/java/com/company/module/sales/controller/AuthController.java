package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.entity.User;
import com.company.module.sales.entity.UserMenuPermission;
import com.company.module.sales.repository.UserMenuPermissionRepository;
import com.company.module.sales.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 인증 관련 컨트롤러.
 * 세션 기반 로그인/로그아웃 및 사용자 정보 조회.
 */
@RestController
@RequestMapping("/sales-api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final UserMenuPermissionRepository menuPermissionRepository;

    /** 로그인 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String userId = body.get("user_id");
        String password = body.get("password");

        if (userId == null || userId.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "아이디와 비밀번호를 입력하세요."));
        }

        Optional<User> optUser = userRepository.findByUserId(userId.trim());
        if (optUser.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(Map.of("success", false, "message", "존재하지 않는 사용자입니다."));
        }

        User user = optUser.get();

        // 비밀번호 검증 (평문 비교 — 추후 BCrypt 전환 권장)
        if (!password.equals(user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("success", false, "message", "비밀번호가 일치하지 않습니다."));
        }

        // 비활성 계정 확인
        if (user.getIsActive() == null || !user.getIsActive()) {
            return ResponseEntity.status(403)
                    .body(Map.of("success", false, "message", "비활성화된 계정입니다."));
        }

        // 세션에 사용자 정보 저장
        HttpSession session = request.getSession(true);
        session.setAttribute("loginUser", user.getUserId());
        session.setAttribute("loginUserName", user.getUserName());
        session.setAttribute("loginUserRole", user.getRole());

        // 마지막 로그인 시각 업데이트
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // 메뉴 권한 조회
        List<String> allowedViews = menuPermissionRepository.findByUserId(user.getUserId())
                .stream()
                .filter(p -> Boolean.TRUE.equals(p.getAllowed()))
                .map(UserMenuPermission::getViewId)
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("user_id", user.getUserId());
        result.put("user_name", user.getUserName());
        result.put("role", user.getRole());
        result.put("allowed_views", allowedViews);
        return ResponseEntity.ok(result);
    }

    /** 로그아웃 */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "로그아웃 되었습니다."));
    }

    /** 현재 로그인 사용자 정보 조회 (JWT / Session) */
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        if (principal != null) {
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("authenticated", true);
            result.put("user_id", principal.getName());
            userRepository.findByUserId(principal.getName()).ifPresent(user -> {
                result.put("user_name", user.getUserName());
                result.put("role", user.getRole());
                result.put("allowed_views", getallowedViews(user.getUserId()));
            });
            return ResponseEntity.ok(result);
        }
        // Session fallback
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("loginUser") != null) {
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("authenticated", true);
            String sessionUserId = (String) session.getAttribute("loginUser");
            result.put("user_id", sessionUserId);
            result.put("user_name", session.getAttribute("loginUserName"));
            result.put("role", session.getAttribute("loginUserRole"));
            result.put("allowed_views", getallowedViews(sessionUserId));
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(401)
                .body(Map.of("authenticated", false, "message", "인증이 필요합니다."));
    }

    /** 사용자의 허용된 메뉴 view_id 목록 조회 */
    private List<String> getallowedViews(String userId) {
        if (userId == null) return List.of();
        return menuPermissionRepository.findByUserId(userId)
                .stream()
                .filter(p -> Boolean.TRUE.equals(p.getAllowed()))
                .map(UserMenuPermission::getViewId)
                .collect(Collectors.toList());
    }
}
