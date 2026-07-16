package com.company.module.sales.repository;

import com.company.module.sales.entity.ItemSortOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemSortOrderRepository extends JpaRepository<ItemSortOrder, Long> {

    /** 카테고리 + 자재코드로 단건 조회 */
    Optional<ItemSortOrder> findByCategoryAndItemCode(String category, String itemCode);

    /** 카테고리별 정렬 순서 조회 (sort_order 오름차순) */
    List<ItemSortOrder> findByCategoryOrderBySortOrderAsc(String category);

    /** 전체 조회 (카테고리 → sort_order 순) */
    @Query("SELECT s FROM ItemSortOrder s ORDER BY s.category, s.sortOrder, s.itemCode")
    List<ItemSortOrder> findAllOrdered();

    /** 카테고리 내 특정 sort_order 범위의 레코드 조회 */
    @Query("SELECT s FROM ItemSortOrder s WHERE s.category = :category " +
           "AND s.sortOrder >= :minOrder AND s.sortOrder <= :maxOrder " +
           "ORDER BY s.sortOrder")
    List<ItemSortOrder> findByCategoryAndSortOrderBetween(
            @Param("category") String category,
            @Param("minOrder") int minOrder,
            @Param("maxOrder") int maxOrder);

    /** 특정 카테고리의 최대 sort_order 조회 */
    @Query("SELECT COALESCE(MAX(s.sortOrder), 0) FROM ItemSortOrder s WHERE s.category = :category")
    int findMaxSortOrderByCategory(@Param("category") String category);

}
