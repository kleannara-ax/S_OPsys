package com.company.module.sales.repository;

import com.company.module.sales.entity.UserMenuPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMenuPermissionRepository extends JpaRepository<UserMenuPermission, Long> {

    /** 특정 사용자의 메뉴 권한 목록 */
    List<UserMenuPermission> findByUserId(String userId);

    /** 특정 사용자의 모든 권한 삭제 (재설정 시 사용) */
    @Modifying
    @Query("DELETE FROM UserMenuPermission p WHERE p.userId = :userId")
    void deleteByUserId(@Param("userId") String userId);
}
