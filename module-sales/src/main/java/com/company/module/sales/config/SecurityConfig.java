package com.company.module.sales.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 설정.
 * 정적 리소스 및 API 접근 허용, CSRF 비활성화 (REST API).
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .headers().frameOptions().sameOrigin()
            .and()
            .authorizeHttpRequests(auth -> auth
                // 정적 리소스 허용
                .antMatchers("/", "/index.html", "/login.html",
                        "/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll()
                // API 엔드포인트 허용 (컨트롤러 레벨에서 @PreAuthorize 로 보호)
                .antMatchers("/sales-api/**").permitAll()
                // 나머지 허용
                .anyRequest().permitAll()
            )
            .formLogin().disable()
            .httpBasic().disable();

        return http.build();
    }
}
