package com.company.module.sales.repository;

import com.company.module.sales.entity.RenewalMaterialLinkage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RenewalMaterialLinkageRepository extends JpaRepository<RenewalMaterialLinkage, Long> {

    /** 기존자재코드로 조회 */
    List<RenewalMaterialLinkage> findByLegacyItemCode(String legacyItemCode);

    /** 기존자재코드 + 리뉴얼자재코드1 로 중복 확인 */
    Optional<RenewalMaterialLinkage> findByLegacyItemCodeAndRenewalItemCode1(String legacyItemCode, String renewalItemCode1);

    /** 활성화된 연결만 조회 */
    List<RenewalMaterialLinkage> findByIsActiveTrue();

    /** 기존자재코드 단건 조회 */
    Optional<RenewalMaterialLinkage> findFirstByLegacyItemCode(String legacyItemCode);

    /** 기존자재코드 존재 여부 */
    boolean existsByLegacyItemCode(String legacyItemCode);

    /** 카테고리별 조회 */
    List<RenewalMaterialLinkage> findByHierarchyName(String hierarchyName);

    /** 기존자재코드로 삭제 */
    void deleteByLegacyItemCode(String legacyItemCode);
}
