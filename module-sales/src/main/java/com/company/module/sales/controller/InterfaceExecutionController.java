package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.InterfaceExecutionDto;
import com.company.module.sales.entity.InterfaceExecution;
import com.company.module.sales.repository.InterfaceExecutionRepository;
import com.company.module.sales.service.InterfaceExecutionService;
import javax.annotation.PostConstruct;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.module.sales.dto.PageResponse;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/sales-api/interface-executions")
@RequiredArgsConstructor
@Slf4j
public class InterfaceExecutionController {

    private final InterfaceExecutionService service;
    private final InterfaceExecutionRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<InterfaceExecution>>> list(
            @PageableDefault(size = 500, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.findAll(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InterfaceExecution>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InterfaceExecution>> create(@Valid @RequestBody InterfaceExecutionDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InterfaceExecution>> update(@PathVariable Long id,
                                                                   @Valid @RequestBody InterfaceExecutionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<InterfaceExecution>> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.toggle(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    /**
     * 초기 시드 데이터: 인터페이스 마스터에 등록된 6개 RFC에 대한 수행 스케줄 자동 생성
     * - SNOP_RFC_001 ~ 004: 매일 06:00 실행 (SAP → S&OP 기본 동기화)
     * - SNOP_RFC_005: 매일 23:00 실행 (월말마감실적 - 영업일 마감 후)
     * - SNOP_RFC_006: 매일 07:00 실행 (리뉴얼자재연결 - 자재마스터 동기화 후)
     */
    @PostConstruct
    public void initSeedData() {
        List<InterfaceExecution> seeds = Arrays.asList(
            InterfaceExecution.builder()
                .interfaceId("SNOP_RFC_001").interfaceName("자재마스터")
                .scheduleType("DAILY").executionTime("06:00")
                .isActive(true).description("SAP 자재마스터 일일 동기화").build(),
            InterfaceExecution.builder()
                .interfaceId("SNOP_RFC_002").interfaceName("일자별재고")
                .scheduleType("DAILY").executionTime("06:00")
                .isActive(true).description("SAP 일자별재고 일일 동기화").build(),
            InterfaceExecution.builder()
                .interfaceId("SNOP_RFC_003").interfaceName("생산실적")
                .scheduleType("DAILY").executionTime("06:00")
                .isActive(true).description("SAP 생산실적 일일 동기화").build(),
            InterfaceExecution.builder()
                .interfaceId("SNOP_RFC_004").interfaceName("판매실적")
                .scheduleType("DAILY").executionTime("06:00")
                .isActive(true).description("SAP 판매실적 일일 동기화").build(),
            InterfaceExecution.builder()
                .interfaceId("SNOP_RFC_005").interfaceName("월말마감실적")
                .scheduleType("DAILY").executionTime("23:00")
                .isActive(true).description("SAP 월말마감실적 일일 동기화").build(),
            InterfaceExecution.builder()
                .interfaceId("SNOP_RFC_006").interfaceName("리뉴얼자재연결")
                .scheduleType("DAILY").executionTime("07:00")
                .isActive(true).description("SAP 리뉴얼자재연결 일일 동기화").build()
        );

        for (InterfaceExecution seed : seeds) {
            if (!repository.existsByInterfaceId(seed.getInterfaceId())) {
                // 다음 수행 예정일시 계산
                LocalDateTime now = LocalDateTime.now();
                LocalTime time = LocalTime.parse(seed.getExecutionTime());
                LocalDateTime next = now.toLocalDate().atTime(time);
                if (!next.isAfter(now)) {
                    next = next.plusDays(1);
                }
                seed.setNextExecutionAt(next);
                repository.save(seed);
                log.info("[IF-EXEC-SEED] 수행 스케줄 등록: {} - {} ({})",
                        seed.getInterfaceId(), seed.getInterfaceName(), seed.getExecutionTime());
            }
        }
    }
}
