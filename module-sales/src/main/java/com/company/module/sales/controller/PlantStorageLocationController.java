package com.company.module.sales.controller;

import com.company.module.sales.dto.ApiResponse;
import com.company.module.sales.dto.PlantStorageLocationDto;
import com.company.module.sales.entity.PlantStorageLocation;
import com.company.module.sales.repository.PlantStorageLocationRepository;
import com.company.module.sales.service.PlantStorageLocationService;
import javax.annotation.PostConstruct;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/sales-api/plant-storage")
@RequiredArgsConstructor
public class PlantStorageLocationController {

    private final PlantStorageLocationService service;
    private final PlantStorageLocationRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAll() {
        // 마스터 데이터(plan_month=null)만 조회 — RFC_002로 생성된 재고 데이터는 제외
        List<PlantStorageLocation> all = repository.findByPlanMonthIsNullOrderByPlantCodeAscStorageLocationAsc();

        // plant_code + storage_location 기준 중복 제거 (is_selected=true 우선 보존)
        Map<String, PlantStorageLocation> uniqueMap = new LinkedHashMap<>();
        for (PlantStorageLocation psl : all) {
            String key = psl.getPlantCode() + "|" + psl.getStorageLocation();
            PlantStorageLocation existing = uniqueMap.get(key);
            if (existing == null) {
                uniqueMap.put(key, psl);
            } else if (Boolean.TRUE.equals(psl.getIsSelected()) && !Boolean.TRUE.equals(existing.getIsSelected())) {
                uniqueMap.put(key, psl); // 선택된 것 우선
            }
        }
        List<PlantStorageLocation> unique = new ArrayList<>(uniqueMap.values());

        Map<String, List<PlantStorageLocation>> grouped = unique.stream()
            .collect(Collectors.groupingBy(
                PlantStorageLocation::getPlantCode,
                LinkedHashMap::new,
                Collectors.toList()
            ));
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total_count", unique.size());
        result.put("selected_count", unique.stream().filter(p -> Boolean.TRUE.equals(p.getIsSelected())).count());
        result.put("plants", grouped);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{plantCode}")
    public ResponseEntity<ApiResponse<List<PlantStorageLocation>>> getByPlant(@PathVariable String plantCode) {
        return ResponseEntity.ok(ApiResponse.ok(service.findByPlantCode(plantCode)));
    }

    @GetMapping("/selected")
    public ResponseEntity<ApiResponse<List<PlantStorageLocation>>> getSelected() {
        return ResponseEntity.ok(ApiResponse.ok(service.findSelected()));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<PlantStorageLocation>> toggleSelection(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.toggleSelected(id)));
    }

    @PatchMapping("/plant/{plantCode}/toggle-all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleAllByPlant(
            @PathVariable String plantCode,
            @RequestBody Map<String, Boolean> body) {
        boolean selected = body.getOrDefault("selected", false);
        List<PlantStorageLocation> locations = service.findByPlantCode(plantCode);
        locations.forEach(loc -> loc.setIsSelected(selected));
        repository.saveAll(locations);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("plant_code", plantCode);
        result.put("selected", selected);
        result.put("count", locations.size());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PutMapping("/selection")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateSelection(@RequestBody Map<String, List<Long>> body) {
        List<Long> selectedIds = body.getOrDefault("selected_ids", Collections.emptyList());
        List<PlantStorageLocation> all = repository.findAll();
        all.forEach(loc -> loc.setIsSelected(selectedIds.contains(loc.getId())));
        repository.saveAll(all);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total", all.size());
        result.put("selected", selectedIds.size());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PlantStorageLocation>> create(@Valid @RequestBody PlantStorageLocationDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto), "등록 완료"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제 완료"));
    }

    /** 중복 seed 데이터 정리 — 동일 plant_code+storage_location의 중복 레코드 삭제 */
    @PostMapping("/cleanup-duplicates")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cleanupDuplicates() {
        int seedDeleted = service.cleanupDuplicateSeeds();
        Map<String, Object> rfcResult = service.cleanupDuplicateRfcData();
        int rfcDeleted = (int) rfcResult.getOrDefault("deleted_count", 0);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("seed_deleted_count", seedDeleted);
        result.put("rfc_deleted_count", rfcDeleted);
        result.put("rfc_duplicate_groups", rfcResult.get("duplicate_groups"));
        result.put("total_deleted", seedDeleted + rfcDeleted);
        return ResponseEntity.ok(ApiResponse.ok(result,
                (seedDeleted + rfcDeleted) + "건 중복 정리 완료 (seed=" + seedDeleted + ", RFC=" + rfcDeleted + ")"));
    }

    @PostConstruct
    public void initSeedData() {
        if (repository.count() > 0) {
            // 기존 데이터가 있으면 중복 seed 자동 정리
            int cleaned = service.cleanupDuplicateSeeds();
            if (cleaned > 0) {
                log.info("[PostConstruct] 서버 시작 시 중복 seed {}건 자동 정리 완료", cleaned);
            }
            return;
        }
        Map<String, List<String>> plantData = new LinkedHashMap<>();
        plantData.put("P200", Arrays.asList("1100","1110","2000","2100","2999","3000","3100","3500","3800","3900","5100","6000","7300","7600"));
        plantData.put("P300", Arrays.asList("1200","1500","1600","1700","1900","2000","2300","2400","2500","2600","3000","3100","3900","5100"));
        plantData.put("P400", Arrays.asList("4100","4200","4300","4400","4500","4700","4800","6001","6003","6005","B004","B007","B008","B009","B010","B011","B013","DELI","S001"));
        plantData.put("P500", Arrays.asList("1200","1600","2200","5100","2500","3000","3100","3900","2000","7200"));
        List<PlantStorageLocation> seeds = new ArrayList<>();
        plantData.forEach((plant, locations) -> locations.forEach(loc ->
            seeds.add(PlantStorageLocation.builder()
                .plantCode(plant).plantName(plant).storageLocation(loc).isSelected(false).build())));
        repository.saveAll(seeds);
    }
}
