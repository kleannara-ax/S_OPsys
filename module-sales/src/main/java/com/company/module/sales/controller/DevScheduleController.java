package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.DevScheduleDto;
import com.company.module.sales.dto.PageResponse;
import com.company.module.sales.entity.DevSchedule;
import com.company.module.sales.service.DevScheduleService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/sales-api/dev-schedules")
@RequiredArgsConstructor
public class DevScheduleController {

    private final DevScheduleService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DevSchedule>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllSorted()));
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<PageResponse<DevSchedule>>> listPaged(
            @PageableDefault(size = 100) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.findAll(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DevSchedule>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<DevSchedule>>> getByDateRange(
            @RequestParam String start, @RequestParam String end) {
        return ResponseEntity.ok(ApiResponse.ok(
                service.findByDateRange(LocalDate.parse(start), LocalDate.parse(end))));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<DevSchedule>>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.ok(service.findByStatus(status)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DevSchedule>> create(@Valid @RequestBody DevScheduleDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DevSchedule>> update(@PathVariable Long id,
                                                            @Valid @RequestBody DevScheduleDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }
}
