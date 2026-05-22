package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.InterfaceMasterDto;
import com.company.module.sales.dto.PageResponse;
import com.company.module.sales.entity.InterfaceMaster;
import com.company.module.sales.repository.InterfaceMasterRepository;
import com.company.module.sales.service.InterfaceMasterService;
import javax.annotation.PostConstruct;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/sales-api/interface-masters")
@RequiredArgsConstructor
public class InterfaceMasterController {

    private final InterfaceMasterService service;
    private final InterfaceMasterRepository repo;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<InterfaceMaster>>> list(
            @PageableDefault(size = 500, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(service.findAll(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InterfaceMaster>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @GetMapping("/by-interface-id/{interfaceId}")
    public ResponseEntity<ApiResponse<InterfaceMaster>> getByInterfaceId(@PathVariable String interfaceId) {
        return repo.findByInterfaceId(interfaceId)
                .map(m -> ResponseEntity.ok(ApiResponse.ok(m)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("NOT_FOUND", "인터페이스를 찾을 수 없습니다: " + interfaceId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InterfaceMaster>> create(@Valid @RequestBody InterfaceMasterDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InterfaceMaster>> update(@PathVariable Long id,
                                                                @Valid @RequestBody InterfaceMasterDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto), "수정 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    /**
     * 초기 시드 데이터 (SNOP_RFC_001 ~ 006)
     */
    @PostConstruct
    public void initSeedData() {
        List<InterfaceMaster> seeds = Arrays.asList(
            InterfaceMaster.builder()
                .interfaceId("SNOP_RFC_001").interfaceName("자재마스터")
                .sender("SAP").receiver("S&OP")
                .rfcUrl("/sales-api/sap/rfc/001").rfcParam("\"A\"").build(),
            InterfaceMaster.builder()
                .interfaceId("SNOP_RFC_002").interfaceName("일자별재고")
                .sender("SAP").receiver("S&OP")
                .rfcUrl("/sales-api/sap/rfc/002").build(),
            InterfaceMaster.builder()
                .interfaceId("SNOP_RFC_003").interfaceName("생산실적")
                .sender("SAP").receiver("S&OP")
                .rfcUrl("/sales-api/sap/rfc/003").build(),
            InterfaceMaster.builder()
                .interfaceId("SNOP_RFC_004").interfaceName("판매실적")
                .sender("SAP").receiver("S&OP")
                .rfcUrl("/sales-api/sap/rfc/004").build(),
            InterfaceMaster.builder()
                .interfaceId("SNOP_RFC_005").interfaceName("월말마감실적")
                .sender("SAP").receiver("S&OP")
                .rfcUrl("/sales-api/sap/rfc/005").build(),
            InterfaceMaster.builder()
                .interfaceId("SNOP_RFC_006").interfaceName("리뉴얼자재연결")
                .sender("SAP").receiver("S&OP")
                .rfcUrl("/sales-api/sap/rfc/006").rfcParam("\"A\"").build()
        );
        for (InterfaceMaster seed : seeds) {
            if (!repo.existsByInterfaceId(seed.getInterfaceId())) {
                repo.save(seed);
            }
        }
    }
}
