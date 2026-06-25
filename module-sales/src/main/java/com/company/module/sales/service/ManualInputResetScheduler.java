package com.company.module.sales.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * 수작업 투입수량(manual_input_quantity) 매월 자동 리셋 스케줄러.
 *
 * 매월 1일 00:00:00에 해당 월의 모든 SnopRecord에 대해
 * manual_input_quantity를 0으로 일괄 초기화한다.
 *
 * 예) 2026-07-01 00:00 실행 시 → planMonth = "2026-07" 레코드 전체 초기화
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ManualInputResetScheduler {

    private final SnopRecordService snopRecordService;

    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("yyyy-MM");

    /**
     * 매월 1일 00:00:00 실행.
     * cron = "초 분 시 일 월 요일"
     */
    @Scheduled(cron = "0 0 0 1 * *")
    public void resetManualInputQuantityMonthly() {
        String currentMonth = LocalDate.now().format(MONTH_FMT);
        log.info("[manual-input-reset] 스케줄러 시작 — 대상 월: {}", currentMonth);

        try {
            int count = snopRecordService.resetManualInputForMonth(currentMonth);
            log.info("[manual-input-reset] 스케줄러 완료 — {}건 초기화", count);
        } catch (Exception e) {
            log.error("[manual-input-reset] 스케줄러 실행 중 오류 발생: {}", e.getMessage(), e);
        }
    }
}
