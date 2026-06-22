package com.company.module.sales.entity;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 사용자별 메뉴 접근 권한.
 * 한 사용자가 여러 메뉴(view_id)에 대한 접근 권한을 가질 수 있다.
 * ADMIN 역할은 이 테이블과 무관하게 모든 메뉴에 접근 가능.
 */
@Entity
@Table(name = "mod_sales_user_menu_permission",
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_user_menu", columnNames = {"USER_ID", "VIEW_ID"})
       })
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class UserMenuPermission extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 사용자 ID (mod_sales_user.USER_ID) */
    @Column(name = "USER_ID", length = 50, nullable = false)
    private String userId;

    /** 화면 식별자 (예: summary, table, sales-upload, optimal-inventory 등) */
    @Column(name = "VIEW_ID", length = 50, nullable = false)
    private String viewId;

    /** 접근 허용 여부 */
    @Column(name = "ALLOWED", nullable = false)
    private Boolean allowed;
}
