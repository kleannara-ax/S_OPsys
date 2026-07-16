package com.company.module.sales.service;

import com.company.module.sales.dto.ItemSortOrderDto;
import com.company.module.sales.entity.ItemSortOrder;
import com.company.module.sales.repository.ItemSortOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemSortOrderService {

    private final ItemSortOrderRepository repository;

    /** 전체 조회 (카테고리 → sort_order 순) */
    @Transactional(readOnly = true)
    public List<ItemSortOrder> findAllOrdered() {
        return repository.findAllOrdered();
    }

    /** 카테고리별 조회 */
    @Transactional(readOnly = true)
    public List<ItemSortOrder> findByCategory(String category) {
        return repository.findByCategoryOrderBySortOrderAsc(category);
    }

    /** 단건 조회 (category + item_code) */
    @Transactional(readOnly = true)
    public Optional<ItemSortOrder> findByCategoryAndItemCode(String category, String itemCode) {
        return repository.findByCategoryAndItemCode(category, itemCode);
    }

    /**
     * 카테고리 내에서 자재를 위로 이동 (sort_order swap).
     * 바로 위 항목과 sort_order를 교환.
     */
    @Transactional
    public Map<String, Object> moveUp(String category, String itemCode) {
        List<ItemSortOrder> ordered = repository.findByCategoryOrderBySortOrderAsc(category);
        int idx = -1;
        for (int i = 0; i < ordered.size(); i++) {
            if (ordered.get(i).getItemCode().equals(itemCode)) {
                idx = i;
                break;
            }
        }
        if (idx <= 0) {
            // 첫 번째 항목이거나 못 찾음 → 이동 불가
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("moved", false);
            result.put("reason", idx == 0 ? "already_first" : "not_found");
            return result;
        }

        ItemSortOrder current = ordered.get(idx);
        ItemSortOrder above = ordered.get(idx - 1);
        int tempOrder = current.getSortOrder();
        current.setSortOrder(above.getSortOrder());
        above.setSortOrder(tempOrder);
        repository.save(current);
        repository.save(above);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("moved", true);
        result.put("swapped_with", above.getItemCode());
        return result;
    }

    /**
     * 카테고리 내에서 자재를 아래로 이동 (sort_order swap).
     * 바로 아래 항목과 sort_order를 교환.
     */
    @Transactional
    public Map<String, Object> moveDown(String category, String itemCode) {
        List<ItemSortOrder> ordered = repository.findByCategoryOrderBySortOrderAsc(category);
        int idx = -1;
        for (int i = 0; i < ordered.size(); i++) {
            if (ordered.get(i).getItemCode().equals(itemCode)) {
                idx = i;
                break;
            }
        }
        if (idx < 0 || idx >= ordered.size() - 1) {
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("moved", false);
            result.put("reason", idx < 0 ? "not_found" : "already_last");
            return result;
        }

        ItemSortOrder current = ordered.get(idx);
        ItemSortOrder below = ordered.get(idx + 1);
        int tempOrder = current.getSortOrder();
        current.setSortOrder(below.getSortOrder());
        below.setSortOrder(tempOrder);
        repository.save(current);
        repository.save(below);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("moved", true);
        result.put("swapped_with", below.getItemCode());
        return result;
    }

    /**
     * 일괄 upsert — 엑셀 업로드 또는 대량 순서 재배치 시 사용.
     * (category, item_code)가 이미 있으면 sort_order 업데이트, 없으면 INSERT.
     */
    @Transactional
    public Map<String, Object> bulkUpsert(List<ItemSortOrderDto> dtos) {
        int inserted = 0;
        int updated = 0;

        for (ItemSortOrderDto dto : dtos) {
            Optional<ItemSortOrder> existing = repository.findByCategoryAndItemCode(
                    dto.getCategory(), dto.getItemCode());

            if (existing.isPresent()) {
                ItemSortOrder entity = existing.get();
                entity.setSortOrder(dto.getSortOrder());
                repository.save(entity);
                updated++;
            } else {
                ItemSortOrder entity = ItemSortOrder.builder()
                        .category(dto.getCategory())
                        .itemCode(dto.getItemCode())
                        .sortOrder(dto.getSortOrder())
                        .build();
                repository.save(entity);
                inserted++;
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("inserted", inserted);
        result.put("updated", updated);
        result.put("total", inserted + updated);
        return result;
    }

    /**
     * 단건 upsert — 화살표 이동 전 해당 카테고리 자재가 sort_order 테이블에 없으면 자동 등록.
     */
    @Transactional
    public ItemSortOrder upsert(String category, String itemCode, int sortOrder) {
        Optional<ItemSortOrder> existing = repository.findByCategoryAndItemCode(category, itemCode);
        if (existing.isPresent()) {
            ItemSortOrder entity = existing.get();
            entity.setSortOrder(sortOrder);
            return repository.save(entity);
        } else {
            ItemSortOrder entity = ItemSortOrder.builder()
                    .category(category)
                    .itemCode(itemCode)
                    .sortOrder(sortOrder)
                    .build();
            return repository.save(entity);
        }
    }

    /**
     * 카테고리 내 자재 목록을 sort_order 테이블에 자동 등록 (없는 것만).
     * 이미 등록된 자재는 건너뜀.
     * @param category 카테고리
     * @param itemCodes 자재 코드 목록
     */
    @Transactional
    public int ensureCategoryItems(String category, List<String> itemCodes) {
        List<ItemSortOrder> existing = repository.findByCategoryOrderBySortOrderAsc(category);
        Set<String> existingCodes = existing.stream()
                .map(ItemSortOrder::getItemCode)
                .collect(Collectors.toSet());

        int maxOrder = existing.isEmpty() ? 0 : existing.get(existing.size() - 1).getSortOrder();
        int added = 0;

        for (String code : itemCodes) {
            if (!existingCodes.contains(code)) {
                maxOrder += 10;
                ItemSortOrder entity = ItemSortOrder.builder()
                        .category(category)
                        .itemCode(code)
                        .sortOrder(maxOrder)
                        .build();
                repository.save(entity);
                added++;
            }
        }
        return added;
    }

}
