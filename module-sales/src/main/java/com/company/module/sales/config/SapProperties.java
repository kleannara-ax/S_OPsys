package com.company.module.sales.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * SAP RFC 연결 설정 프로퍼티.
 * sap-connection.yml 파일에서 값을 읽어옵니다.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "sap.jco")
public class SapProperties {

    /** SAP 서버 IP 또는 도메인 */
    private String host;

    /** 시스템 번호 */
    private String systemNumber;

    /** 클라이언트 번호 */
    private String client;

    /** RFC 접속 계정 */
    private String user;

    /** RFC 접속 비밀번호 */
    private String password;

    /** 접속 언어 */
    private String language = "KO";

    /** 연결 풀 — 최대 동시 연결 수 */
    private int poolCapacity = 5;

    /** 연결 풀 — 최대 대기 연결 수 */
    private int peakLimit = 10;
}
