package com.company.module.sales.config;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.Principal;

/**
 * 모든 요청에서 사용자 정보를 AuditUserContext에 설정하는 필터.
 * JWT 기반 인증 환경: SecurityContext 의 Principal 우선, 없으면 세션 loginUser fallback.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AuditFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            if (request instanceof HttpServletRequest) {
                HttpServletRequest httpReq = (HttpServletRequest) request;
                // 1) SecurityContext principal (JWT)
                Principal principal = httpReq.getUserPrincipal();
                if (principal != null) {
                    AuditUserContext.set(principal.getName());
                } else {
                    // 2) Session fallback
                    HttpSession session = httpReq.getSession(false);
                    if (session != null) {
                        Object userId = session.getAttribute("loginUser");
                        if (userId != null) {
                            AuditUserContext.set(userId.toString());
                        }
                    }
                }
            }
            chain.doFilter(request, response);
        } finally {
            AuditUserContext.clear();
        }
    }
}
