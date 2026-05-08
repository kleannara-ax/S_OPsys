package com.company.module.sales.config;

/**
 * ThreadLocal 기반 현재 로그인 사용자 컨텍스트.
 * Servlet Filter에서 세션 정보를 읽어 set하고,
 * JPA EntityListener에서 get하여 created_by / updated_by를 자동 채운다.
 */
public class AuditUserContext {

    private static final ThreadLocal<String> currentUser = new ThreadLocal<>();

    public static void set(String userId) {
        currentUser.set(userId);
    }

    public static String get() {
        return currentUser.get();
    }

    public static void clear() {
        currentUser.remove();
    }
}
