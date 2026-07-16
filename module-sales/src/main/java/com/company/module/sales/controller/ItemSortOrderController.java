package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.ItemSortOrderDto;
import com.company.module.sales.entity.ItemSortOrder;
import com.company.module.sales.service.ItemSortOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales-api/item-sort-orders")
@RequiredArgsConstructor
@Slf4j
public class ItemSortOrderController {

    private final ItemSortOrderService service;

    /** 전체 조회 (카테고리 → sort_order 순) */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ItemSortOrder>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.findAllOrdered()));
    }

    /** 카테고리별 조회 */
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<ItemSortOrder>>> listByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.ok(service.findByCategory(category)));
    }

    /** 위로 이동 */
    @PostMapping("/move-up")
    public ResponseEntity<ApiResponse<Map<String, Object>>> moveUp(
            @RequestParam String category,
            @RequestParam("item_code") String itemCode) {
        Map<String, Object> result = service.moveUp(category, itemCode);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    /** 아래로 이동 */
    @PostMapping("/move-down")
    public ResponseEntity<ApiResponse<Map<String, Object>>> moveDown(
            @RequestParam String category,
            @RequestParam("item_code") String itemCode) {
        Map<String, Object> result = service.moveDown(category, itemCode);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    /** 일괄 upsert (엑셀 업로드 등) */
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkUpsert(
            @Valid @RequestBody List<ItemSortOrderDto> dtos) {
        Map<String, Object> result = service.bulkUpsert(dtos);
        return ResponseEntity.ok(ApiResponse.ok(result,
                result.get("total") + "건 정렬순서 저장 완료"));
    }

    /** 카테고리 자재 자동 등록 (미등록 자재만) */
    @PostMapping("/ensure")
    public ResponseEntity<ApiResponse<Map<String, Object>>> ensure(
            @RequestBody Map<String, Object> body) {
        String category = (String) body.get("category");
        @SuppressWarnings("unchecked")
        List<String> itemCodes = (List<String>) body.get("item_codes");
        int added = service.ensureCategoryItems(category, itemCodes);
        return ResponseEntity.ok(ApiResponse.ok(
                Map.of("added", added, "category", category),
                added + "건 자동 등록 완료"));
    }

}
