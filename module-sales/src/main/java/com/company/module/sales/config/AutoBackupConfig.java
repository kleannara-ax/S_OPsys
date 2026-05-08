package com.company.module.sales.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 자동 백업 스케줄링 설정.
 * 백업 데몬(scripts/auto_backup_daemon.sh)이 외부에서 동작하므로
 * 현재는 스케줄링 활성화만 담당한다.
 */
@Configuration
@EnableScheduling
public class AutoBackupConfig {
}
